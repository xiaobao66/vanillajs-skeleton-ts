const pkg = require('./package.json');

module.exports = api => {
  // api.env内部已经使用了api.cache，所以可以不使用api.cache
  const isDebug = api.env(['development']);

  const webConfig = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: pkg.browserslist,
          },
          modules: false, // use webpack trans es6 module with tree-shaking
          forceAllTransforms: !isDebug, // for UglifyJS
          debug: false,
          useBuiltIns: 'usage',
          corejs: { version: 3, proposals: false },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ],
  };

  return {
    env: {
      development: webConfig,
      production: webConfig,
    },
  };
};
