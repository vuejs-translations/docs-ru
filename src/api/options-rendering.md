# Опции: Отрисовка {#options-rendering}

## template {#template}

Строка шаблона для компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Подробности**

  Шаблон, предоставленный с помощью опции `template`, будет скомпилирован "на лету" во время выполнения. Это поддерживается только при использовании сборки Vue, включающей компилятор шаблонов. Компилятор шаблонов **НЕ** включен в сборки Vue, в названии которых присутствует слово `runtime`, например, `vue.runtime.esm-bundler.js`. Более подробную информацию о различных сборках можно найти в [руководство по выбору файла сборки](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use).

  Если строка начинается с `#`, то она будет использована в качестве `querySelector` и в качестве строки шаблона будет использоваться `innerHTML` выбранного элемента. Это позволяет создавать исходный шаблон с использованием нативных элементов `<template>`.

  Если в том же компоненте присутствует опция `render`, то `template` будет проигнорирован.

  Если в корневом компоненте приложения не указана опция `template` или `render`, Vue попытается использовать `innerHTML` смонтированного элемента в качестве шаблона.

  :::warning Примечание о безопасности
  Используйте только те источники шаблонов, которым можно доверять. Не используйте в качестве шаблона содержимое, предоставленное пользователем. Подробнее об этом см. в [Руководстве по безопасности](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates).
  :::

## render {#render}

Функция, программно возвращающая виртуальное DOM-дерево компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Подробности**

  `render` - это альтернатива строковым шаблонам, позволяющая использовать всю программную мощь JavaScript для объявления вывода компонента на экран.

  Предварительно скомпилированные шаблоны, например, в однофайловых компонентах, компилируются в опцию `render` во время сборки. Если в компоненте присутствуют и `render`, и `template`, то `render` будет иметь больший приоритет.

- **См. также**
  - [Механизм отрисовки](/guide/extras/rendering-mechanism)
  - [Render-функции](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Настройка параметров runtime компилятора для шаблона компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // по умолчанию: 'condense'
      delimiters?: [string, string] // по умолчанию: ['{{', '}}']
      comments?: boolean // по умолчанию: false
    }
  }
  ```

- **Подробности**

  Эта опция конфигурации учитывается только при использовании полной сборки (т.е. автономного `vue.js`, который может компилировать шаблоны в браузере). Она поддерживает те же опции, что и на уровне приложения [app.config.compilerOptions](/api/application#app-config-compileroptions), и имеет более высокий приоритет для текущего компонента.

- **См. также** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

An option to assist with type inference when using slots programmatically in render functions. Only supported in 3.3+.

- **Details**

  This option's runtime value is not used. The actual types should be declared via type casting using the `SlotsType` type helper:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
