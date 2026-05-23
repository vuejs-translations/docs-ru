# Правила приоритета D: Используйте с осторожностью {#priority-d-rules-use-with-caution}

Vue предоставляет некоторые возможности, которые обеспечивают "плавный" процесс миграции с устаревшей кодовой базы и учитывают редкие случаи. Если их использовать слишком часто, они могут сделать код сложно поддерживаемым или могут быть источниками багов. Эти правила "освещают" рисковые возможности Vue, объясняя, где и почему их стоит избегать.

## Селектор по тегу в `scoped` стилях {#element-selectors-with-scoped}

**Селектор по тегу в `scoped` стилях не должен использоваться.**

Селектор по классу должен быть приоритетнее, чем селектор по тегу в `scoped` стилях, потому что большое количество таких селекторов — это медленно.

:::details Подробное объяснение
Чтобы ограничить стили, Vue добавляет уникальный атрибут к элементам компонента, например `data-v-f3f3eg9`. Затем меняются селекторы, так что только подходящие элементы с этим атрибутом будут выбраны (т.е. `button[data-v-f3f3eg9]`)

Проблема в том, что большое количество элемент-атрибут селекторов (т.е. `button[data-v-f3f3eg9]`) будут значительно медленнее, нежели класс-атрибут селектор (т.е. `.btn-close[data-v-f3f3eg9]`), следовательно, селектор по классу должен быть в приоритете, где это возможно.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Неявная связь между родитель-ребенок {#implicit-parent-child-communication}

**Входные параметры и события должны быть в приоритете для связи между родителем и ребенком, нежели `this.$parent` или мутация входных параметров.**

Идеальное Vue приложение — это входные параметры вниз, события наверх. Следование этой конвенции делает ваши компоненты легче для понимания. Несмотря на это, есть крайние случаи, где мутация входных параметров или `this.$parent` может упростить взаимодействие двух компонентов, которые имеют сильное зацепление.

Но проблема в том, что есть много _простых_ случаев, когда эти паттерны могут казаться удобными. Будьте внимательны: не подвергайтесь соблазну обменять простоту (возможность понимать всю цепочку вашего состояния) на кратко строчное удобство (меньше кода).

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

function renameTodo() {
  // Mutates the parent's reactive object via the prop
  // In other words, the child is reaching into and changing parent-owned state.
  props.todo.text = 'renamed by child'
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="renameTodo">rename</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:todo'])

function renameTodo() {
  // Emit a new object — the parent owns the update.
  emit('update:todo', { ...props.todo, text: 'renamed by parent' })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="renameTodo">rename</button>
  </span>
</template>
```

</div>

</div>
