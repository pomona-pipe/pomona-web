module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier'
  ],
  /*
  ** Custom rules
  ** https://eslint.org/docs/rules/
  ** off || 0
  ** warn || 1
  ** error || 2
  */
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'camelcase': 'warn',
    'import/order': 'warn',
    'no-unused-vars': 'warn',
    'object-shorthand': 'warn',
    'prettier/prettier': 'off',
    'promise/param-names': 'warn',
    'prefer-promise-reject-errors': 'warn',
    'require-await': 'off'
  }
}
