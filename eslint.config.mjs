import antfu from '@antfu/eslint-config';
import storybook from 'eslint-plugin-storybook';

export default antfu(
    {
        react: true,
        typescript: true,

        // Same style as soren-ui.
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },

        // Workflows and other YAML keep the 2-space indent used across the NothingEats repos.
        yaml: {
            overrides: {
                'yaml/indent': ['error', 2],
            },
        },

        ignores: [
            // Vendored by scripts/sync-soren-ui.mjs; never edited here.
            'src/soren/**',
            'src/soren-ui.ts',
            'SOREN_UI.md',
            // Owned by pnpm, which rewrites it.
            'pnpm-workspace.yaml',
            'dist/**',
            'storybook-static/**',
        ],
    },
    {
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
    ...storybook.configs['flat/recommended'],
);
