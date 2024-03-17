---
outline: deep
---

# Использование Vue с TypeScript {#using-vue-with-typescript}

Такая система типов, как TypeScript, позволяет выявлять многие распространенные ошибки с помощью статического анализа на этапе сборки. Это снижает вероятность возникновения ошибок во время выполнения в продакшене, а также позволяет более уверенно рефакторить код в крупномасштабных приложениях. TypeScript повышает удобство использования разработчиками благодаря автодополнению типов в среде разработки (IDE), что значительно облегчает работу с типами данных.

Vue написан на TypeScript и обеспечивает первоклассную поддержку TypeScript. Все официальные пакеты Vue поставляются с декларациями типов, которые должны работать "из коробки".

## Настройка проекта {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), официальный инструмент для создания проектов, предлагает возможности для создания проекта Vue на базе [Vite](https://vitejs.dev/) и TypeScript.

### Обзор {#overview}

При использовании Vite сервер разработки и бандлер работают только в режиме транспиляции и не выполняют никакой проверки типов. Это обеспечивает высокую скорость работы сервера разработки Vite даже при использовании TypeScript.

- В процессе разработки мы рекомендуем опираться на хорошую [настройку IDE](#ide-support) для получения мгновенной обратной связи по типовым ошибкам.

- При использовании SFC используйте утилиту [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) для проверки типов в командной строке и генерации объявлений типов. `vue-tsc` представляет собой обертку для `tsc`, собственного интерфейса командной строки TypeScript. Она работает в основном так же, как и `tsc`, за исключением того, что поддерживает Vue SFC в дополнение к файлам TypeScript. Вы можете запустить `vue-tsc` в режиме watch параллельно с сервером Vite dev или использовать плагин Vite, например [vite-plugin-checker](https://vite-plugin-checker.netlify.app/), который выполняет проверки в отдельном рабочем потоке.

- Vue CLI также обеспечивает поддержку TypeScript, но больше не рекомендуется. Смотрите [примечания ниже](#note-on-vue-cli-and-ts-loader).

### Поддержка IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VSCode) настоятельно рекомендуется для использования благодаря отличной встроенной поддержке TypeScript.

  - [Vue - Официальное](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (ранее Volar) — официальное расширение VSCode, которое обеспечивает поддержку TypeScript внутри Vue SFC, а также множество других замечательных функций.

    :::tip
    Vue — официальное расширение заменяет [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), наше предыдущее официальное расширение VSCode для Vue 2. Если у вас уже установлен Vetur, обязательно отключите его в проектах Vue 3.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) также обеспечивает встроенную поддержку TypeScript и Vue. Другие IDE JetBrains также поддерживают их, либо из коробки, либо с помощью [бесплатного плагина](https://plugins.jetbrains.com/plugin/9442-vue-js).

### Настройка `tsconfig.json` {#configuring-tsconfig-json}

Проекты, создаваемые с помощью `create-vue`, включают в себя предварительно сконфигурированный  `tsconfig.json`. Базовый конфиг абстрагирован в пакете [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Внутри проекта мы используем [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) для обеспечения корректных типов кода, работающего в разных окружениях (например, код приложения и код тестирования должны иметь разные глобальные переменные).

При ручной настройке `tsconfig.json` следует обратить внимание на следующие параметры:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) имеет значение `true` поскольку Vite использует [esbuild](https://esbuild.github.io/) для транспиляции TypeScript и имеет ограничения на транспиляцию одним файлом.

- При использовании API Options необходимо установить [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) в `true` (или, по крайней мере, включить [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), который является частью флага `strict`), чтобы задействовать проверку типа `this` в опциях компонента. В противном случае `this` будет рассматриваться как `any`.

- Если вы настроили псевдонимы распознавателя в инструменте сборки, например псевдоним `@/*`, настроенный по умолчанию в проекте `create-vue`, необходимо также настроить его для TypeScript с помощью [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

- Если вы собираетесь использовать TSX с Vue, установите [`CompilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) в `"preserve"` и установите [`CompilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource ) в `"vue"`.

См. также:

- [Официальная документация по параметрам компилятора TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Предостережения при компиляции esbuild TypeScript](https://esbuild.github.io/content-types/#typescript-caveats)

### Примечание о Vue CLI и `ts-loader` {#note-on-vue-cli-and-ts-loader}

В системах на основе webpack, таких как Vue CLI, проверка типов обычно выполняется в рамках конвейера преобразования модулей, например, с помощью `ts-loader`. Однако это не совсем верное решение, поскольку для проверки типов системе типов необходимо знать весь граф модуля. Шаг преобразования отдельного модуля просто не является подходящим местом для решения этой задачи. Это приводит к следующим проблемам:

- `ts-loader` может проверять тип только после преобразования кода. Это не согласуется с ошибками, которые мы видим в IDE или в `vue-tsc`, и которые указывают непосредственно на исходный код.

- Проверка типов может быть медленной. Если она выполняется в одном потоке/процессе с преобразованиями кода, то это существенно влияет на скорость сборки всего приложения.

- У нас уже есть проверка типов, выполняемая прямо в IDE в отдельном процессе, поэтому затраты на замедление работы разработчика просто не являются хорошим компромиссом.

Если вы в настоящее время используете Vue 3 + TypeScript через Vue CLI, мы настоятельно рекомендуем перейти на Vite. Мы также работаем над опциями CLI для включения поддержки TS только в транспайле, чтобы вы могли переключиться на `vue-tsc` для проверки типов.

## Общие сведения об использовании {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Чтобы TypeScript мог правильно выводить типы внутри опций компонентов, необходимо определить компоненты с помощью функции [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // включен вывод типа
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // тип: string | undefined
    this.msg // тип: string
    this.count // тип: number
  }
})
```

`defineComponent()` также поддерживает вывод входных параметров, переданных в `setup()`, при использовании Composition API без `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // включен вывод типа
  props: {
    message: String
  },
  setup(props) {
    props.message // тип: string | undefined
  }
})
```

См. также:

- [Заметка о webpack Treeshaking](/api/general#note-on-webpack-treeshaking)
- [типы тестов для `defineComponent`](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip Совет
`defineComponent()` также позволяет выводить типы для компонентов, определенных в простом JavaScript.
:::

### Использование в однофайловых компонентах {#usage-in-single-file-components}

Чтобы использовать TypeScript в SFC, добавьте атрибут `lang="ts"` к тегам `<script>`. При наличии `lang="ts"` все шаблонные выражения также проходят более строгую проверку типов.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- включена проверка типов и автозаполнение -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` может также использоваться с `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript включен
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- включена проверка типов и автозаполнение -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript в шаблонах {#typescript-in-templates}

Шаблон `<template>` также поддерживает TypeScript в выражениях привязки, когда используется `<script lang="ts">` или `<script setup lang="ts">`. Это полезно в тех случаях, когда вам нужно выполнить приведение типов в выражениях шаблона.

Приведем надуманный пример:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- ошибка, так как x может быть строкой -->
  {{ x.toFixed(2) }}
</template>
```

Это можно обойти с помощью приведения типов:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip Совет
Если используется Vue CLI или настройка на основе webpack, то для использования TypeScript в выражениях шаблонов требуется `vue-loader@^16.8.0`.
:::

### Использование с `TSX` {#usage-with-tsx}
Vue также поддерживает создание компонентов с помощью `JSX / TSX`. Подробности описаны в руководстве [Рендер-функции & `JSX`](/guide/extras/render-function.html#jsx-tsx)

## `Generic` компоненты {#generic-components}
`Generic` компоненты поддерживаются в двух случаях:

- В `SFC`: [`<script setup>` с `generic` атрибутом](/api/sfc-script-setup.html#generics)
- Рендер-функции / `JSX` компоненты: [сигнатура функции `defineComponent()`](/api/general.html#function-signature)

## Специфические рецепты API {#api-specific-recipes}

- [TS с Composition API](./composition-api)
- [TS с Options API](./options-api)
