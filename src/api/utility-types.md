# Вспомогательные типы {#utility-types}

:::info Информация
На этой странице перечислены лишь некоторые часто используемые вспомогательные типы, применение которых может потребовать объяснений по их использованию. Полный список экспортируемых типов можно найти в [исходном коде](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Используется для анотации входного параметра с более сложными типами по сравнению с runtime определением входных параметров

- **Пример**

  ```ts
  import type { PropType } from 'vue'

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

- **See also** [Guide - Typing Component Props](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

Alias for `T | Ref<T>`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## MaybeRefOrGetter\<T> {#maybereforgetter}

Alias for `T | Ref<T> | (() => T)`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## ExtractPropTypes\<T> {#extractproptypes}

Extract prop types from a runtime props options object. The extracted types are internal facing - i.e. the resolved props received by the component. This means boolean props and props with default values are always defined, even if they are not required.

To extract public facing props, i.e. props that the parent is allowed to pass, use [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

Extract prop types from a runtime props options object. The extracted types are public facing - i.e. the props that the parent is allowed to pass.

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Используется для расширения типа экземпляра компонента с целью поддержки пользовательских глобальных свойств.

- **Пример**

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
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **См. также** [Руководство — Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Используется для расширения типа опций компонента с целью поддержки пользовательских опций.

- **Пример**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **См. также** [Руководство — Расширение глобальных свойств](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Используется для расширения разрешенных входных параметров в TSX с целью использования недекларированных входных параметров на элементах TSX.

- **Пример**

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
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

## CSSProperties {#cssproperties}

Используется для расширения допустимых значений в привязках свойств стиля.

- **Пример**

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
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

  :::tip Совет
  Дополнения должны быть размещены в файле модуля `.ts` или `.d.ts`. Подробнее об этом см. в разделе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

  :::info См. также
  Секции однофайловых компонентов `<style>` поддерживают привязку CSS-значений к динамическому состоянию компонента с помощью CSS-функции `v-bind`. Это позволяет использовать пользовательские свойства без дополнения типа.

  - [v-bind() внутри CSS](/api/sfc-css-features#v-bind-in-css)
  :::
