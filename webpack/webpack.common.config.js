const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { getArgv } = require('./utils');

// argv
const argv = getArgv();
const isVerbose = argv.verbose;

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(__dirname, '../src');
const BUILD_DIR = path.resolve(__dirname, '../build');

module.exports = env => {
  const isDev = env.mode === 'development';
  const staticAssetName = isDev
    ? '[name].[ext]?[hash:8]'
    : '[name].[hash:8].[ext]';
  const staticImagePath = 'images';
  const staticFontPath = 'fonts';

  return {
    context: ROOT_DIR,

    output: {
      path: BUILD_DIR,
      publicPath: '/',
    },

    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        src: SRC_DIR,
        assets: path.join(SRC_DIR, 'assets'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          include: [SRC_DIR],
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: isDev,
              },
            },
          ],
        },
        {
          test: /\.(css|less|scss)$/,
          // 内嵌rules需要注意放置顺序
          // 匹配时，从下到上逐条匹配，遇到匹配的就会执行，并且不中断匹配过程，直到第一条规则匹配完毕
          rules: [
            {
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: isDev,
                    // reloadAll: isDebug, // 如果hmr使用不正确才启用
                  },
                },
              ],
            },
            {
              oneOf: [
                {
                  resourceQuery: /local/,
                  use: [
                    {
                      loader: 'css-loader',
                      options: {
                        sourceMap: isDev,
                        modules: {
                          mode: 'local',
                          localIdentName: isDev
                            ? '[path][name]__[local]'
                            : '[hash:base64:5]',
                        },
                        importLoaders: 1,
                      },
                    },
                  ],
                },
                {
                  use: [
                    {
                      loader: 'css-loader',
                      options: {
                        sourceMap: isDev,
                      },
                    },
                  ],
                },
              ],
            },
            {
              use: [
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true,
                    postcssOptions: {
                      config: path.resolve(__dirname, './postcss.config.js'),
                    },
                  },
                },
              ],
            },
            {
              test: /\.less$/,
              use: [
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: true,
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
            {
              test: /\.scss$/,
              use: [
                {
                  loader: 'resolve-url-loader',
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          // oneOf配置需要注意规则放置顺序
          // 匹配时，从上到下逐条规则进行匹配，先匹配到的生效，无视后续规则，即使后面的规则也能匹配
          oneOf: [
            {
              issuer: /\.(css|less|scss)$/,
              oneOf: [
                {
                  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                  use: [
                    {
                      loader: 'svg-url-loader',
                      options: {
                        limit: 4096, // 4kb
                        name: staticAssetName,
                        outputPath: staticImagePath,
                      },
                    },
                  ],
                },
                {
                  use: [
                    {
                      loader: 'url-loader',
                      options: {
                        limit: 4096, // 4kb
                        name: staticAssetName,
                        outputPath: staticImagePath,
                      },
                    },
                  ],
                },
              ],
            },
            {
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: staticAssetName,
                    outputPath: staticImagePath,
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.(ttf|otf|woff(2)?|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: staticAssetName,
                outputPath: staticFontPath,
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        __DEV__: isDev,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(SRC_DIR, './assets'),
            to: 'assets', // 相对于output
            globOptions: {
              ignore: ['**/styles/**'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.join(SRC_DIR, 'index.ejs'),
        filename: 'index.html',
        title: 'vanillajs-skeleton',
        templateParameters: (compilation, assets, assetTags, options) => {
          return {
            compilation,
            webpack: compilation.getStats().toJson(),
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              tags: assetTags,
              files: assets,
              options,
            },
            __DEV__: isDev,
          };
        },
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: isDev
          ? 'chunks/[id].css'
          : 'chunks/[id].[contenthash:8].css',
        // ignoreOrder: true, // 去除css使用顺序冲突
      }),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          enable: true,
          files: './src/**/*.ts',
        },
      }),
    ],

    stats: {
      cached: false,
      cachedAssets: false,
      chunks: isVerbose,
      chunkModules: isVerbose,
      colors: true,
      hash: isVerbose,
      modules: isVerbose,
      reasons: false,
      timings: true,
      version: isVerbose,
    },
  };
};
