module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  lintOnSave: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: false,
    },
    proxy: {
      '^/mts/transcription': {
        target: 'http://localhost:8002/',
        secure: false,
        pathRewrite: { "^/mts": "" },
        logLevel: "debug"
      },
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Muzikos transkripcijos paslauga";
        return args;
      })
  }
};
