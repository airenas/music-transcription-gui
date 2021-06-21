module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/music/' : '/',
  devServer: {
    host: 'wav2mid.com',
    overlay: {
      warnings: true,
      errors: false,
    },
    proxy: {
      '^/mts/transcription': {
        target: 'http://localhost:8002/',
        secure: false,
        pathRewrite: { '^/mts': '' },
        logLevel: 'debug',
      },
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Muzikos transkripcijos paslauga'; // eslint-disable-line no-param-reassign
        return args;
      });
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  },
};
