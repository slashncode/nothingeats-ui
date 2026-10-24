#!/usr/bin/env node
// Vendors soren-ui into src/soren from its published registry output (public/r/*.json) at one
// commit. Everything is read with `git show`, so soren-ui's working tree is never used: the result
// depends only on the commit, and `--check` proves the vendored files reproduce byte for byte.
//
// Why not `shadcn add <local json>`: soren-ui's registryDependencies are bare names ("button",
// "tokens"), which the shadcn CLI resolves against ui.shadcn.com and would install shadcn's own
// components instead of soren-ui's.
//
// Usage: node scripts/sync-soren-ui.mjs [--ref <git ref>] [--source <soren-ui checkout>] [--check]

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { values: args } = parseArgs({
    options: {
        'source': { type: 'string', default: process.env.SOREN_UI_DIR ?? resolve(root, '../../soren-ui-astro-starlight') },
        // Default: main for a sync, the commit recorded in SOREN_UI.md for a check.
        'ref': { type: 'string' },
        'check': { type: 'boolean', default: false },
        'allow-unpushed': { type: 'boolean', default: false },
    },
});

// Registry path prefix → vendored path prefix. Anything else in the registry is an error.
const TARGETS = [
    ['src/registry/soren/ui/', 'src/soren/ui/'],
    ['src/styles/', 'src/soren/styles/'],
];
const BARREL = 'src/soren-ui.ts';
const MANIFEST = 'SOREN_UI.md';

function fail(message) {
    console.error(`sync-soren-ui: ${message}`);
    process.exit(1);
}

function git(...gitArgs) {
    return execFileSync('git', ['-C', args.source, ...gitArgs], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

if (!existsSync(join(args.source, '.git')))
    fail(`no soren-ui checkout at ${args.source} (set SOREN_UI_DIR or --source)`);

function recordedCommit() {
    const manifestPath = join(root, MANIFEST);
    const match = existsSync(manifestPath) && /^- Commit: `([0-9a-f]{40})`/m.exec(readFileSync(manifestPath, 'utf8'));
    if (!match)
        fail(`no commit recorded in ${MANIFEST}; pass --ref`);
    return match[1];
}

const ref = args.ref ?? (args.check
    ? recordedCommit()
    : 'main');
const sha = git('rev-parse', '--verify', `${ref}^{commit}`).trim();
if (!args['allow-unpushed'] && git('branch', '-r', '--contains', sha).trim() === '')
    fail(`${sha} is not on any remote branch; push soren-ui first so the sync is reproducible elsewhere`);

const committedAt = git('show', '-s', '--format=%cI', sha).trim();
const origin = git('remote', 'get-url', 'origin').trim().replace(/\.git$/, '').replace(/^git@github\.com:/, 'https://github.com/');
const sorenPackage = JSON.parse(git('show', `${sha}:package.json`));

const items = git('ls-tree', '--name-only', sha, 'public/r/')
    .split('\n')
    .filter(path => path.endsWith('.json'))
    .map(path => JSON.parse(git('show', `${sha}:${path}`)))
    .filter(item => Array.isArray(item.files))
    .sort((a, b) => a.name.localeCompare(b.name));

if (items.length === 0)
    fail(`no registry items in public/r at ${sha}`);

function vendoredPath(registryPath) {
    const target = TARGETS.find(([from]) => registryPath.startsWith(from));
    if (!target)
        fail(`unexpected registry file ${registryPath}; extend TARGETS in this script`);
    return target[1] + registryPath.slice(target[0].length);
}

// The registry JSON embeds each file's content. It must match the source at the same commit,
// otherwise soren-ui was committed without re-running `pnpm registry:build`.
const files = new Map();
const stale = [];
for (const item of items) {
    for (const file of item.files) {
        const source = git('show', `${sha}:${file.path}`);
        if (source !== file.content)
            stale.push(file.path);
        files.set(vendoredPath(file.path), file.content);
    }
}
if (stale.length > 0)
    fail(`registry output is stale at ${sha} for:\n  ${stale.join('\n  ')}\nRun \`pnpm registry:build\` in soren-ui, commit, push, then sync again.`);

const components = items.filter(item => item.type === 'registry:ui');
const npmDependencies = [
    ...new Set(items.flatMap(item => item.dependencies ?? [])),
].sort();

const ownPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const missing = npmDependencies.filter(name => !ownPackage.dependencies?.[name]);
if (missing.length > 0)
    fail(`package.json lacks dependencies the vendored code imports: ${missing.join(', ')} (soren-ui uses ${missing.map(name => `${name}@${sorenPackage.dependencies?.[name] ?? '?'}`).join(', ')})`);

// The barrel re-exports every component module. When two modules export the same name, an
// explicit re-export from the first one resolves the ambiguity (TS2308) and is reported, since
// it usually means a duplicated helper upstream.
const modules = components.map((item) => {
    const tsx = item.files.find(file => file.path.endsWith('.tsx'));
    const names = { values: [], types: [] };
    for (const [, list] of tsx.content.matchAll(/^export\s*\{([^}]*)\}/gm)) {
        names.values.push(...list.split(',').map(name => name.trim().split(/\s+as\s+/).pop()).filter(Boolean));
    }
    for (const [, kind, name] of tsx.content.matchAll(/^export\s+(type|interface|function|const|class)\s+(\w+)/gm)) {
        (kind === 'type' || kind === 'interface'
            ? names.types
            : names.values).push(name);
    }
    return {
        path: vendoredPath(tsx.path).replace(/^src\//, './').replace(/\.tsx$/, ''),
        names,
    };
});
const firstModule = {
    values: new Map(),
    types: new Map(),
};
const duplicates = [];
for (const module of modules) {
    for (const kind of ['values', 'types']) {
        for (const name of module.names[kind]) {
            if (!firstModule[kind].has(name)) {
                firstModule[kind].set(name, module.path);
            }
            else if (firstModule[kind].get(name) !== module.path) {
                duplicates.push({
                    kind,
                    name,
                    kept: firstModule[kind].get(name),
                    shadowed: module.path,
                });
            }
        }
    }
}
for (const { name, kept, shadowed } of duplicates)
    console.warn(`sync-soren-ui: warning: ${name} is exported by ${kept} and ${shadowed}; the barrel uses ${kept}`);

function explicitExports(kind) {
    const byModule = Map.groupBy(duplicates.filter(duplicate => duplicate.kind === kind), duplicate => duplicate.kept);
    return [...byModule].map(([path, list]) =>
        `export ${kind === 'types'
            ? 'type '
            : ''}{ ${[
            ...new Set(list.map(duplicate => duplicate.name)),
        ].sort().join(', ')} } from '${path}';`);
}

const barrel = [
    `// Generated by scripts/sync-soren-ui.mjs from soren-ui ${sha.slice(0, 7)}. Do not edit.`,
    '',
    ...modules.map(module => `export * from '${module.path}';`),
    ...(duplicates.length > 0
        ? [
                '',
                '// Exported by more than one module upstream; the first module wins.',
                ...explicitExports('values'),
                ...explicitExports('types'),
            ]
        : []),
    '',
].join('\n');

const manifest = [
    '# Vendored soren-ui',
    '',
    `Generated by \`scripts/sync-soren-ui.mjs\`. **Do not edit \`src/soren/\` by hand**: fix upstream in soren-ui, push, then run \`just sync-soren-ui\` in the hub repo (or \`pnpm sync:soren-ui\` here).`,
    '',
    `- Source: ${origin}`,
    `- Commit: \`${sha}\` (${committedAt})`,
    `- Items: ${items.length} (${components.length} components, ${items.length - components.length} shared)`,
    '',
    '## npm dependencies of the vendored code',
    '',
    '| Package | soren-ui range |',
    '| --- | --- |',
    ...npmDependencies.map(name => `| \`${name}\` | \`${sorenPackage.dependencies?.[name] ?? '?'}\` |`),
    '',
    '## Items',
    '',
    '| Item | Type | Files |',
    '| --- | --- | --- |',
    ...items.map(item => `| \`${item.name}\` | ${item.type.replace('registry:', '')} | ${item.files.map(file => `\`${vendoredPath(file.path).replace(/^src\/soren\//, '')}\``).join(', ')} |`),
    '',
].join('\n');

// Write the complete result into a scratch directory first, so a failure never leaves a half sync.
const scratch = mkdtempSync(join(tmpdir(), 'soren-ui-sync-'));
for (const [path, content] of files) {
    mkdirSync(dirname(join(scratch, path)), { recursive: true });
    writeFileSync(join(scratch, path), content);
}
writeFileSync(join(scratch, BARREL), barrel);
writeFileSync(join(scratch, MANIFEST), manifest);

function walk(dir) {
    if (!existsSync(dir))
        return [];
    return readdirSync(dir, { withFileTypes: true, recursive: true })
        .filter(entry => entry.isFile())
        .map(entry => relative(dir, join(entry.parentPath, entry.name)));
}

if (args.check) {
    const expected = [
        ...walk(join(scratch, 'src/soren')).map(path => `src/soren/${path}`),
        BARREL,
        MANIFEST,
    ].sort();
    const actual = [
        ...walk(join(root, 'src/soren')).map(path => `src/soren/${path}`),
        BARREL,
        MANIFEST,
    ].sort();
    const differences = [
        ...expected.filter(path => !actual.includes(path)).map(path => `missing  ${path}`),
        ...actual.filter(path => !expected.includes(path)).map(path => `extra    ${path}`),
        ...expected.filter(path => actual.includes(path) && existsSync(join(root, path))
            && !readFileSync(join(root, path)).equals(readFileSync(join(scratch, path)))).map(path => `changed  ${path}`),
        ...expected.filter(path => actual.includes(path) && !existsSync(join(root, path))).map(path => `missing  ${path}`),
    ];
    rmSync(scratch, { recursive: true, force: true });
    if (differences.length > 0)
        fail(`vendored files differ from soren-ui ${sha.slice(0, 7)}:\n  ${differences.join('\n  ')}`);
    console.log(`sync-soren-ui: src/soren matches soren-ui ${sha.slice(0, 7)} byte for byte (${files.size} files)`);
    process.exit(0);
}

rmSync(join(root, 'src/soren'), { recursive: true, force: true });
for (const path of walk(scratch)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), readFileSync(join(scratch, path)));
}
rmSync(scratch, { recursive: true, force: true });
console.log(`sync-soren-ui: vendored soren-ui ${sha.slice(0, 7)}: ${items.length} items, ${files.size} files`);
