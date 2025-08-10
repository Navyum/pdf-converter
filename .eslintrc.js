module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // 忽略未使用变量警告
    '@typescript-eslint/no-unused-vars': 'off',
    // 忽略 any 类型警告
    '@typescript-eslint/no-explicit-any': 'off',
    // React 相关规则
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // 忽略 console 语句警告
    'no-console': 'off',
    'prefer-const': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    node: true,
    browser: true,
    es6: true
  },
  overrides: [
    {
      files: ['*.test.tsx', '*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['webpack.config.js', '*.config.js'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off'
      }
    }
  ]
}; 