# Правила приоритета C: Рекомендуются {#priority-c-rules-recommended}

При наличии нескольких одинаково хороших вариантов можно сделать произвольный выбор, чтобы обеспечить консистентность. В этих правилах мы описываем каждый приемлемый вариант и предлагаем выбор по умолчанию. Это означает, что вы можете выбрать другой вариант в собственной кодовой базе, пока вы соблюдаете консистентность и у вас есть веская причина. Пусть у вас будет действительно веская причина! Приспосабливаясь к стандарту общества, вы сможете:

1. Гораздо проще понимать большинство кода сообщества, который вы встретите
2. Копировать и вставлять большинство примеров кода сообщества без дальнейшей модификации
3. Чаще находить сотрудников, которые уже привыкли к предпочитаемому стилю кода, по крайней мере, в отношении Vue

## Порядок опций в компоненте/экземпляре {#component-instance-options-order}

**Порядок опций в компоненте/экземпляре должен сохранять консистентность.**

Это порядок по умолчанию, который рекомендуем для опций компонентов. Они разделены на категории, чтобы вы знали куда добавлять новые свойства из плагинов. 

1. **Глобальная осведомлённость** (требует знаний вне компонента)

   - `name`

2. **Настройки компилятора шаблонов** (изменяется способ компиляции шаблонов)

   - `compilerOptions`

3. **Зависимости шаблона** (ресурсы, используемые в шаблоне)

   - `components`
   - `directives`

4. **Композиция** (объединение свойств в опциях)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Интерфейс** (интерфейс компонента)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (точка входа при использовании Composition API)

   - `setup`

7. **Локальное состояние** (локальные реактивные свойства)

   - `data`
   - `computed`

8. **События** (коллбэки вызываемые реактивными событиями)

   - `watch`
   - События хуков жизненного цикла (в порядке их вызова)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Нереактивные свойства** (свойства экземпляра, не зависящие от реактивности)

   - `methods`

10. **Отрисовка** (декларативное описание вывода компонента)
    - `template`/`render`

## Порядок атрибутов элемента {#element-attribute-order}

**Атрибуты элемента (включая компоненты) должны также сохранять консистентность.**

Это порядок по умолчанию, который рекомендуем для опций компонентов. Они разделены на категории, чтобы вы знали куда добавлять пользовательские атрибуты и директивы.

1. **Определение** (предоставляет параметры компонента)

   - `is`

2. **Отображение списка** (создаёт несколько вариантов одного элемента)

   - `v-for`

3. **Условия** (отрисовывается/отображается ли элемент)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Модификаторы отрисовки** (изменяют способ отрисовки элемента)

   - `v-pre`
   - `v-once`

5. **Глобальная осведомлённость** (требует знания вне компонента)

   - `id`

6. **Уникальные атрибуты** (атрибуты, требующие уникальные значения)

   - `ref`
   - `key`

7. **Двусторонняя привязка** (объединение привязки и событий)

   - `v-model`

8. **Другие атрибуты** (все неуказанные связанные или несвязанные атрибуты)

9. **События** (слушатели событий компонента)

   - `v-on`

10. **Содержимое** (перезаписывают содержимое элемента)
    - `v-html`
    - `v-text`

## Пустые строки между опций компонента/экземпляра {#empty-lines-in-component-instance-options}

**Можно добавить одну пустую строку между многострочными свойствами, особенно если опции не помещаются на экране без прокрутки.**

Когда компоненты начинают казаться тесными и трудночитаемыми, добавление пустых строк между многострочными свойствами может облегчить их чтение. В некоторых редакторах, таких как Vim, подобные опции форматирования могут также облегчить навигацию с помощью клавиатуры.

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
// Отсутствие пробелов не мешает, если компонент
// всё ещё легко читать и перемещаться по нему.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## Порядок секций в однофайловых компонентах {#single-file-component-top-level-element-order}

**[Однофайловые компоненты](/guide/scaling-up/sfc) должны всегда последовательно содержать теги `<script>`, `<template>`, и `<style>`, причём `<style>` должен располагаться последним, поскольку как минимум один из двух других всегда необходим.**

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
