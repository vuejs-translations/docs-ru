# Управление состоянием {#state-management}

## Что такое управление состоянием? {#what-is-state-management}

Технически каждый экземпляр компонента Vue уже "управляет" своим реактивным состоянием. Возьмем для примера простой компонент счетчика:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// состояние
const count = ref(0)

// действия
function increment() {
  count.value++
}
</script>

<!-- представление -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // состояние
  data() {
    return {
      count: 0
    }
  },
  // действия
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- представление -->
<template>{{ count }}</template>
```

</div>

Это самостоятельный блок, состоящий из следующих частей:

- **Состояние** - источник истины, который управляет нашим приложением;
- **Представление** - декларативное отображение **состояния**;
- **Действия** - возможные способы изменения состояния в ответ на пользовательский ввод из **представления**.

Это простое представление концепции "одностороннего потока данных":

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Однако эта простота начинает нарушаться, когда у нас есть **несколько компонентов, имеющих общее состояние**:

1. Несколько представлений могут зависеть от одного и того же фрагмента состояния.
2. Действиям из разных представлений может потребоваться мутировать один и тот же фрагмент состояния.

В первом случае возможным обходным путем является "поднятие" общего состояния до общего компонента-предка, а затем передача его вниз в виде входных параметров. Однако это быстро становится утомительным в деревьях компонентов с глубокой иерархией, что приводит к другой проблеме, известной как [пробрасывание входных параметров (prop drilling)](/guide/components/provide-inject#prop-drilling).

Во втором случае мы часто прибегаем к таким решениям, как обращение к прямым родительским и дочерним экземплярам через ссылки на элементы шаблона или попытка мутировать и синхронизировать несколько копий состояния через генерируемые события. Оба эти паттерна являются хрупкими и быстро приводят к сложно поддерживаемому коду.

Более простым и понятным решением является извлечение общего состояния из компонентов и управление им в глобальном синглтоне. Таким образом, наше дерево компонентов превращается в большое "представление", и любой компонент может получить доступ к состоянию или вызвать действия, независимо от того, где он находится в дереве!

## Простое управление состояниям с помощью Reactivity API {#simple-state-management-with-reactivity-api}

<div class="options-api">

В Options API реактивные данные объявляются с помощью функции `data()`. Внутренний объект, возвращаемый функцией `data()`, становится реактивным с помощью функции [`reactive()`](/api/reactivity-core#reactive), которая также доступна в виде публичного API.

</div>

Если у вас есть фрагмент состояния, который должен быть общим для нескольких экземпляров, вы можете использовать функцию [`reactive()`](/api/reactivity-core#reactive) для создания реактивного объекта, а затем импортировать его в несколько компонентов:

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>Из компнента A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>Из компнента B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>Из компнента A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>Из компнента B: {{ store.count }}</template>
```

</div>

Теперь при каждом изменении объекта `store` и `<ComponentA>` и `<ComponentB>` будут автоматически обновлять свои представления - у нас теперь есть единый источник истины.

Однако это также означает, что любой компонент, импортирующий `store`, может мутировать его по своему усмотрению:

```vue-html{2}
<template>
  <button @click="store.count++">
    Из компнента B: {{ store.count }}
  </button>
</template>
```

Хотя в простых случаях это работает, глобальное состояние, которое может произвольно изменяться любым компонентом, в долгосрочной перспективе будет не очень удобным в поддержке. Для того чтобы логика изменения состояния была централизованной, как и само состояние, рекомендуется определять методы хранилища с именами, выражающими замысел действий:

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    Из компонента B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip Совет
Обратите внимание, что в обработчике клика используется `store.increment()` со скобками - это необходимо для вызова метода с правильным контекстом, поскольку `this` не метод компонента.
:::

Хотя здесь мы используем в качестве хранилища один реактивный объект, вы также можете обмениваться реактивным состоянием, созданным с помощью других [API реактивности](/api/reactivity-core.html), таких как `ref()` или `computed()`, или даже возвращать глобальное состояние из [Composable](/guide/reusability/composables.html):

```js
import { ref } from 'vue'

// глобальное состояние, создаваемое в области видимости модуля
const globalCount = ref(1)

export function useCount() {
  // локальное состояние, создаваемое для каждого компонента
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Тот факт, что система реактивности Vue отделена от модели компонентов, делает ее чрезвычайно гибкой.

## Соображения относительно SSR {#ssr-considerations}

Если вы создаете приложение, использующее [отрисовку на стороне сервера (SSR)](./ssr), то описанная выше схема может привести к проблемам, поскольку хранилище является синглтоном, разделяемым на несколько запросов. [Более подробно](./ssr#cross-request-state-pollution) этот вопрос рассматривается в руководстве по SSR.

## Pinia {#pinia}

Если в простых сценариях достаточно нашего решения по управлению состоянием, то в крупномасштабных производственных приложениях необходимо учитывать гораздо больше моментов:

- Более строгие соглашения для совместной работы команды
- Интеграция с инструментами Vue DevTools, включая временную шкалу, внутрикомпонентную проверку и отладку с использованием машины времени
- механизм позволяющий модулям в приложении обновляться без перезагрузки страницы (Hot Module Replacement)
- Поддержка рендеринга на стороне сервера

[Pinia](https://pinia.vuejs.org) - это библиотека управления состояниями, реализующая все вышеперечисленное. Она поддерживается основной командой Vue и работает как с Vue 2, так и с Vue 3.

Некоторые пользователи могут быть знакомы с [Vuex](https://vuex.vuejs.org/), предыдущей официальной библиотекой управления состояниями для Vue. Поскольку Pinia играет ту же роль в экосистеме, Vuex перешла в режим поддержки. Она продолжает работать, но больше не будет получать новых функций. Для новых приложений рекомендуется использовать Pinia.

Pinia начиналась как исследование того, как может выглядеть следующая итерация Vuex, и включала в себя множество идей из обсуждений основной команды Vuex 5. В конце концов, мы поняли, что Pinia уже реализует большую часть того, что мы хотели видеть в Vuex 5, и решили сделать ее новой рекомендацией.

По сравнению с Vuex, Pinia обеспечивает более простой API с меньшим количеством формальностей, предлагает API в стиле Composition-API и, что особенно важно, имеет надежную поддержку вывода типов при использовании TypeScript.
