# Вспомогательные типы {#utility-types}

:::info Информация
На этой странице перечислены лишь некоторые часто используемые вспомогательные типы, применение которых может потребовать объяснений по их использованию. Полный список экспортируемых типов можно найти в [исходном коде](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Используется для аннотации входного параметра с более сложными типами по сравнению с runtime определением входных параметров

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

- **Смотрите также:** [Руководство — Типизация входных параметров компонентов](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

Псевдоним для `T | Ref<T>`. Полезно для аннотирования аргументов [Composables](/guide/reusability/composables.html).

- Поддерживается только в версиях 3.3+.

## MaybeRefOrGetter\<T> {#maybereforgetter}

Псевдоним для `T | Ref<T> | (() => T)`. Полезно для аннотирования аргументов [Composables](/guide/reusability/composables.html).

- Поддерживается только в версиях 3.3+.

## ExtractPropTypes\<T> {#extractproptypes}

Извлекает типы значений из объекта входных параметров во время выполнения. Извлеченные типы являются внутренними, то есть разрешенными входными параметрами, полученными компонентом. Это означает, что булевы входные параметры и входные параметры со значениями по умолчанию всегда определены, даже если они не нужны.

Для извлечения общедоступных входных параметров, то есть входных параметров, которые разрешено передать родителю, используйте [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Пример**

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

Извлечение типов входных параметров из объекта runtime props options. Извлеченные типы являются публичными — то есть входными параметрами, которые разрешено передавать родителю.

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
