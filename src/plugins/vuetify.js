// import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { fa } from 'vuetify/iconsets/fa';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
            fa,
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                primary: '#ffffff',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
    },
    options: {
        customProperties: true,
    },
});

export default vuetify