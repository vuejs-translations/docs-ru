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

[Попробовать в песочнице](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPENvbXBvbmVudEEgLz5cbiAgPENvbXBvbmVudEIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBvbmVudEEudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCJzdG9yZS5pbmNyZW1lbnQoKVwiPlxuICAgICAgRnJvbSBBOiB7eyBzdG9yZS5jb3VudCB9fVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQ29tcG9uZW50Qi52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIENvbXBvbmVudEEsXG4gICAgQ29tcG9uZW50QlxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8Q29tcG9uZW50QSAvPlxuICA8Q29tcG9uZW50QiAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ29tcG9uZW50QS52dWUiOiI8c2NyaXB0PlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3JlXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIDxidXR0b24gQGNsaWNrPVwic3RvcmUuaW5jcmVtZW50KClcIj5cbiAgICAgIEZyb20gQToge3sgc3RvcmUuY291bnQgfX1cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIkNvbXBvbmVudEIudnVlIjoiPHNjcmlwdD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdG9yZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>

:::tip Совет
Обратите внимание, что в обработчике клика используется `store.increment()` со скобками - это необходимо для вызова метода с правильным контекстом, поскольку `this` не метод компонента.
:::

Хотя здесь мы используем в качестве хранилища один реактивный объект, вы также можете обмениваться реактивным состоянием, созданным с помощью других [Reactivity API](/api/reactivity-core.html), таких как `ref()` или `computed()`, или даже возвращать глобальное состояние из [Composable](/guide/reusability/composables.html):

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
