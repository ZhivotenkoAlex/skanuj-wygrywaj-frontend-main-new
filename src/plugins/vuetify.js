// import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        iconfont: "md" || 'mdi' || 'fa',
        values: {
            mdi: {
                component: 'mdi', // you can use string here if component is globally registered
            },
            fa: {
                component: 'fa', // you can use string here if component is globally registered
            },
        },
    },
    theme: {
        dark: false
    },
    themes: {
        light: {
            primary: "#ffffff",
            secondary: "#b0bec5",
            accent: "#8c9eff",
            error: "#b71c1c"
        }
    },
    options: {
        customProperties: true
    }
});

export default vuetify