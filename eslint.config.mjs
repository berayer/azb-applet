// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  unocss: true,
  rules: {
    'no-console': 'off',
  },
})
