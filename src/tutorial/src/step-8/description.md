# Вычисляемые свойства {#computed-property}

Продолжим работу над списком задач, составленным на предыдущем шаге. Здесь мы уже добавили функцию переключения для каждой задачи. Для этого мы добавили свойство `done` к каждому объекту todo и с помощью `v-model` привязали его к чекбоксу:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

Следующее улучшение, которое мы можем добавить - это возможность скрывать уже выполненные задания. У нас уже есть кнопка, которая переключает состояние `hideCompleted`. Но как отобразить различные элементы списка в зависимости от этого состояния?

<div class="options-api">

Встречайте <a target="_blank" href="/guide/essentials/computed.html">вычисляемое свойство</a>. Мы можем объявить свойство, которое реактивно вычисляется из других свойств с помощью параметра `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // возвращает отфильтрованные по `this.hideCompleted` задачи
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // возвращает отфильтрованные по `this.hideCompleted` задачи
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Встречайте <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Мы можем создать вычисляемый ref, который вычисляет свое `.value` на основе других реактивных источников данных:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // возвращает задачи, отфильтрованные по
  // `todos.value` и `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // возвращает задачи, отфильтрованные по
      // `todos.value` и `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Вычисляемое свойство отслеживает другие реактивные состояния, используемые при его вычислении, в качестве зависимостей. Оно кэширует результат и автоматически обновляет его при изменении зависимостей.

Теперь попробуйте добавить вычисляемое свойство `filteredTodos` и реализовать его логику! Если все реализовано правильно, то отметив задачу как выполненную, она должна быть мгновенно скрыта из списка задач.
