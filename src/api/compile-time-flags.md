---
outline: deep
---

# Флаги, используемые во время компиляции {#compile-time-flags}

:::tip Примечание
Флаги времени компиляции применяются только при использовании сборки `esm-bundler` Vue (т.е. `vue/dist/vue.esm-bundler.js`).
:::

При использовании Vue с шагом сборки, можно настроить ряд флагов времени компиляции для включения / отключения определенных функций. Преимущество использования флагов компиляции заключается в том, что отключенные таким образом функции можно удалить из конечного пакета с помощью tree-shaking.

Vue будет работать, даже если эти флаги не будут явно настроены. Однако рекомендуется всегда настраивать их так, чтобы соответствующие функции были правильно удалены при необходимости.

Как настроить их в зависимости от инструмента сборки, смотрите в разделе [Руководства по настройке](#configuration-guides).

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **По умолчанию:** `true`

  Включить / отключить поддержку Options API. Отключение этой функции приведет к уменьшению размера пакетов, но может повлиять на совместимость со сторонними библиотеками, если они полагаются на Options API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **По умолчанию:** `false`

  Включите / отключите поддержку devtools в продакшн сборках. Это приведет к увеличению количества кода в пакете, поэтому рекомендуется включать эту функцию только для отладки.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **По умолчанию:** `false`

  Включить / выключить подробные предупреждения о несоответствии гидрации в продакшн сборках. Это приведет к увеличению количества кода, включаемого в пакет, поэтому рекомендуется включать эту функцию только для целей отладки.

- Only available in 3.4+

## Руководства по настройке {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` автоматически предоставляет значения по умолчанию для этих флагов. Для того чтобы изменить значения по умолчанию, используйте опцию Vite [`define` config](https://vitejs.dev/config/shared-options.html#define):

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // включить подробности несоответствия гидрации в продакшн сборке
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` автоматически предоставляет значения по умолчанию для некоторых из этих флагов. Чтобы настроить / изменить значения:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Флаги должны быть определены с помощью функции webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Флаги должны быть определены с помощью [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
