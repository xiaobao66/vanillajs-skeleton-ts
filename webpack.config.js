const { merge } = require('webpack-merge');
const webpackCommonConfig = require('./webpack/webpack.common.config');
const webpackDevConfig = require('./webpack/webpack.dev.config');
const webpackProdConfig = require('./webpack/webpack.prod.config');

module.exports = env => {
  const commonConfig = webpackCommonConfig(env);

  switch (env.mode) {
    case 'development':
      return webpackDevConfig(env).then(devConfig =>
        merge(commonConfig, devConfig),
      );
    case 'production':
      return webpackProdConfig(env).then(prodConfig =>
        merge(commonConfig, prodConfig),
      );
    default:
      throw new Error(`找不到对应的${env.mode}配置`);
  }
};
