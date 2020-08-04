const pkg = require('../package.json');

module.exports = () => ({
  plugins: [
    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
    // https://github.com/postcss/postcss-calc
    require('postcss-calc')(),
    // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
    // https://github.com/iamvdo/pleeease-filters
    require('pleeease-filters')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // PostCSS Preset Env, which allows you easily to use all the features in cssdb.
    // See what features in which stage in https://preset-env.cssdb.org/features
    // https://github.com/csstools/postcss-preset-env
    require('postcss-preset-env')({
      stage: 3,
      browsers: pkg.browserslist,
      autoprefixer: { flexbox: 'no-2009' },
    }),
  ],
});
