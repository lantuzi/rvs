module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // You can add custom rules here
    '@typescript-eslint/no-explicit-any': 'warn', // or 'off' to completely disable
    'react-hooks/rules-of-hooks': 'error', // keep this as error to ensure proper hook usage
    '@typescript-eslint/no-unused-vars': 'warn', // or 'off' if you prefer
    '@typescript-eslint/no-unused-expressions': 'warn', // or 'off' if you prefer
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
