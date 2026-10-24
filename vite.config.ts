import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import pkg from './package.json' with { type: 'json' };

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Dependencies stay imports in the published modules. That includes the fonts: library mode would
// inline every font file as base64 into the stylesheet, so the app's bundler serves them instead.
const external = [
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies),
];

export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            cssFileName: 'nothingeats-ui',
        },
        rolldownOptions: {
            external: id => external.some(name => id === name || id.startsWith(`${name}/`)),
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
            },
        },
        sourcemap: true,
    },
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [
                            { browser: 'chromium' },
                        ],
                    },
                },
            },
        ],
    },
});
