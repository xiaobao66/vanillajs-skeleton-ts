module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
    es6: true,
  },

  extends: [
    'airbnb/base',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    'prettier',
  ],

  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved':['error', {ignore: ['\\?local$']}],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'global-require': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowArgumentsExplicitlyTypedAsAny: true,
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
    }],
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.json'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
