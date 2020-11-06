const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { getEntry, getPort } = require('./utils');

module.exports = env => {
  return Promise.all([getEntry(), getPort()]).then(([entry, port]) => {
    return {
      mode: 'development',

      devtool: 'inline-source-map',

      entry,

      output: {
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js',
      },

      plugins: [
        ...(fs.existsSync(
          path.resolve(__dirname, '../node_modules/vanillajs-skeleton/dll'),
        )
          ? [
              new webpack.DllReferencePlugin({
                // 链接dll
                manifest: require(path.resolve(
                  __dirname,
                  '../node_modules/vanillajs-skeleton/dll',
                  'dependencies.manifest.json',
                )),
              }),
              new CopyWebpackPlugin({
                patterns: [
                  {
                    from: path.resolve(
                      __dirname,
                      '../node_modules/vanillajs-skeleton/dll',
                    ),
                    to: 'dll',
                  },
                ],
              }),
              new HtmlWebpackTagsPlugin({
                // 将dll库文件插入到html中，需要放在HtmlWebpackTagsPlugin之后
                append: false,
                scripts: ['dll/dependencies.dll.js'],
              }),
            ]
          : []),
      ],

      devServer: {
        port,
        publicPath: '/',
        hot: true,
        historyApiFallback: true,
        overlay: true,
        contentBase: path.resolve(__dirname, '../src'),
      },
    };
  });
};
