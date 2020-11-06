const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 打包分析
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { getArgv, getEntry } = require('./utils');

// argv
const argv = getArgv();
const isAnalyze = argv.analyze || argv.analyse;

// utils
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  }
  if (m.name) {
    return m.name;
  }
  return false;
}

module.exports = env => {
  return Promise.all([getEntry()]).then(([entry]) => {
    return {
      mode: 'production',

      entry,

      output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: 'chunks/[name].[chunkhash:8].js',
      },

      optimization: {
        splitChunks: {
          cacheGroups: {
            // 抽取node_modules中的js模块
            vendors: {
              name: 'vendors',
              // Note the usage of `[\\/]` as a path separator for cross-platform compatibility
              test: /[\\/]node_modules[\\/].*\.js$/,
              chunks: 'initial',
            },
            // 将样式文件打包到一起
            styles: {
              name: 'styles',
              test: module => {
                return (
                  module.constructor.name === 'CssModule' &&
                  recursiveIssuer(module) === 'app'
                );
              },
              chunks: 'all',
              enforce: true, // 忽略chunks的一些限制条件(比如：minSize、minChunks)，强制抽取
            },
          },
        },
      },

      plugins: [
        new CleanWebpackPlugin(),
        // 打包分析
        ...(isAnalyze
          ? [new BundleAnalyzerPlugin(), new DuplicatePackageCheckerPlugin()]
          : []),
      ],
    };
  });
};
