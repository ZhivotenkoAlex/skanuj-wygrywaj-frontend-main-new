const path = require('path');
const webpack = require('webpack');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    open: process.platform == "darwin",
    host: "127.0.0.1",
    port: 5001,
    https: process.env.VUE_APP_URL,
    client: {
      overlay: false
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('custom-'),
          }
        }
      })
  },
  // transpileDependencies: ["vuetify"],
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
      autoImport: true,
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: undefined,
      enableInSFC: undefined
    }
  },
  pwa: {
    name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    mobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
  }
});
