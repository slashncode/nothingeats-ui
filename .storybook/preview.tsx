import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { I18nProvider } from 'react-aria-components';

import '../src/styles';

const preview: Preview = {
    globalTypes: {
        locale: {
            description: 'Language of the components',
            toolbar: {
                title: 'Locale',
                icon: 'globe',
                items: [
                    { value: 'de-DE', title: 'Deutsch' },
                    { value: 'en-US', title: 'English' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        locale: 'de-DE',
    },
    decorators: [
        withThemeByClassName({
            themes: { light: '', dark: 'dark' },
            defaultTheme: 'light',
            parentSelector: 'html',
        }),
        (Story, context) => (
            <I18nProvider locale={context.globals.locale as string}>
                <Story />
            </I18nProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
        // Accessibility violations fail the story tests, not just the panel.
        a11y: { test: 'error' },
        controls: {
            matchers: { color: /(background|color)$/i },
        },
    },
};

export default preview;
