# Вспомогательные типы {#utility-types}

:::info Информация
На этой странице перечислены лишь некоторые часто используемые вспомогательные типы, применение которых может потребовать объяснений по их использованию. Полный список экспортируемых типов можно найти в [исходном коде](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Используется для анотации входного параметра с более сложными типами по сравнению с runtime определением входных параметров

- **Пример:**

  ```ts
  import { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // предоставление более конкретного типа `Object`.
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **См. также:** [Руководство - Типизация входных параметров компонента](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties {#componentcustomproperties}

Используется для расширения типа экземпляра компонента с целью поддержки пользовательских глобальных свойств.

- **Пример:**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-global-properties).
  :::

- **См. также:** [Руководство - Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Используется для расширения типа опций компонента с целью поддержки пользовательских опций.

- **Пример:**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-global-properties).
  :::

- **См. также:** [Руководство - Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Используется для расширения разрешенных входных параметров в TSX с целью использования недекларированных входных параметров на элементах TSX.

- **Пример:**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // теперь работает, даже если hello не является объявленным входным параметром
  <MyComponent hello="world" />
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-global-properties).
  :::

## CSSProperties {#cssproperties}

Используется для расширения допустимых значений в привязках свойств стиля.

- **Пример:**

  Разрешить любое пользовательское CSS-свойство

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```
  ```html
  <div :style="{ '--bg-color': 'blue' }">
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api.html#augmenting-global-properties).
  :::

  :::info См. также
  Секции однофайловых компонентов `<style>` поддерживают привязку CSS-значений к динамическому состоянию компонента с помощью CSS-функции `v-bind`. Это позволяет использовать пользовательские свойства без дополнения типа.

  - [v-bind() внутри CSS](/api/sfc-css-features.html#v-bind-in-css)
  :::
