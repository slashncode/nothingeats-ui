import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    core: {
        disableTelemetry: true,
    },
    // vite.config.ts builds the library; Storybook builds an app from the same config.
    viteFinal: (config) => {
        if (config.build) {
            delete config.build.lib;
            delete config.build.rolldownOptions;
        }
        return config;
    },
};

export default config;
