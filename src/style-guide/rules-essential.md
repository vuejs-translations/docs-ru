# Правила приоритета А: Основные {#priority-a-rules-essential}

::: warning Примечание
Это руководство по стилю Vue.js устарело и нуждается в пересмотре. Если у вас есть вопросы или предложения, пожалуйста, [откройте проблему](https://github.com/vuejs-translations/docs-ru/issues/new).
:::

Эти правила помогают избегать ошибок, поэтому выучите и соблюдайте их во что бы то ни стало. Исключения могут присутствовать, но очень редко и совершаться теми, кто обладает высокой экспертизой в области JavaScript и Vue.

## Используйте несколько слов в именах компонентов {#use-multi-word-component-names}

Пользовательские компоненты должны именоваться в несколько слов, за исключением корневых `App` компонентов. Это [предотвращает конфликты](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) с существующими и будущими HTML-элементами, так как всегда HTML-элементы пишутся в одно слово.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<!-- В прекомпилированных шаблонах -->
<Item />

<!-- Внутри сырого index.html -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- В прекомпилированных шаблонах -->
<TodoItem />

<!-- Внутри сырого index.html -->
<todo-item></todo-item>
```

</div>

## Используйте подробное описание входных параметров {#use-detailed-prop-definitions}

При коммите кода объявление входных параметров должно быть максимально подробным - как минимум с указанием типа (типов).

::: details Подробное объяснение
Подробное [объявление входных параметров](/guide/components/props#prop-validation) имеет два преимущества:

- Они документируют API компонента, что дает понимание того, как использовать компонент.
- В режиме разработки Vue будет выводить ошибки (console.warn), если входные параметры некорректно предоставлены, помогая вам отловить потенциальные источники ошибок.
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
// Это "окей" только при прототипировании
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
props: {
  status: String
}
```

```js
// Ещё лучше!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
// Это "окей" только при прототипировании
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Ещё лучше!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## Используйте :key при работе с `v-for` {#use-keyed-v-for}

`key` при работе с `v-for` _всегда_ необходим на компонентах, чтобы поддерживать внутреннее состояние компонента в поддереве. Однако даже для элементов поддерживать предсказуемое поведение - хорошая практика, как например [постоянство объектов](https://bost.ocks.org/mike/constancy/) в анимациях.

::: details Подробное объяснение
Допустим, у вас есть список дел для выполнения:

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Научиться использовать v-for'
      },
      {
        id: 2,
        text: 'Научиться использовать key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: 'Научиться использовать v-for'
  },
  {
    id: 2,
    text: 'Научиться использовать key'
  }
])
```

</div>

Затем вы отсортируете их в алфавитном порядке. При обновлении DOM Vue оптимизирует рендеринг так, чтобы выполнить как можно меньше мутаций DOM. Это может означать удаление первого элемента в списке дел, а затем добавление его в конец списка.

Проблема в том, что есть случаи, когда важно не удалять элементы, которые останутся в DOM. Например, вы можете захотеть использовать `<transition-group>` для анимации сортировки списка или удерживать фокус, если элементом в списке выступает `<input>`. В таких случаях добавление уникального ключа для каждого элемента (т.е. `:key="todo.id"`) подскажет Vue, как вести себя более предсказуемо.

Исходя из нашего опыта, лучше _всегда_ добавлять уникальный ключ - так вы и ваша команда буквально никогда не будете переживать о таких крайних случаях. Но в редких, критичных к производительности случаях, где постоянство внутри DOM не нужно, вы можете сделать сознательное исключение.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Не используйте `v-if` вместе с `v-for` {#avoid-v-if-with-v-for}

**Никогда не используйте `v-if` на том же элементе, что и `v-for`.**

Есть две распространенные ситуации, когда вы можете захотеть так сделать:

- Чтобы отфильтровать элементы в списке (т.е. `v-for="user in users" v-if="user.isActive"`). В таких случаях замените `users` при помощи вычисляемого свойства, которое возвращает отфильтрованный список (т.е. `activeUsers`).

- Чтобы избежать рендеринга списка, если он должен быть скрыт (т.е. `v-for="user in users" v-if="shouldShowUsers"`). В таких случаях используйте `v-if` на элементе выше (т.е. `ul`, `ol`).

::: details Подробное объяснение
Когда Vue обрабатывает директивы, `v-if` имеет больший приоритет, чем `v-for`, так что этот шаблон:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Выкинет ошибку, потому что директива `v-if` будет обработана первее, и итерируемая переменная `user` не существует на этот момент.

Это должно быть исправлено при помощи итерации по вычисляемому свойству, например:

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

В качестве альтернативы мы можем использовать тег `<template>` с `v-for` снаружи `<li>` элемента:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Используйте scoped-стили {#use-component-scoped-styling}

Стили на уровне компонента `App` и лаяутов могут быть глобальными, но все стили остальных компонентов должны быть скрыты.

Это релевантно только для [однофайловых компонентов](/guide/scaling-up/sfc). Это _не_ требует использования [`scoped` атрибута](https://vue-loader.vuejs.org/guide/scoped-css.html). Скрытие стилей может быть достигнуто также при помощи [CSS-модулей](https://vue-loader.vuejs.org/guide/css-modules.html), методологии [BEM](http://getbem.com/) или других библиотек/соглашений.

**Библиотеки компонентов, однако, должны предпочитать стратегию, основанную на классах, вместо использования атрибута `scoped`.**

Это позволяет легче переопределять внутренние стили, позволяя использовать человекочитаемые классы, которые не имеют слишком большой специфичности, но при этом с большей вероятностью не приведут к конфликтам.

::: details Подробное объяснение
Если вы разрабатываете огромный проект, работаете с другими разработчиками или иногда включаете HTML/CSS сторонних разработчиков (например, из Auth0), консистентное скрытие обеспечит применение стилей только к тем компонентам, к которым они предназначены.

Помимо атрибута `scoped`, использование уникальных классов может гарантировать, что CSS сторонних разработчиков не будет применяться к вашему HTML. Например, много проектов используют `button`, `btn` или `icon` классы, поэтому даже если вы не используете такую стратегию, как BEM, добавление специфического для приложения и/или компонента префикса (например, `ButtonClose-icon`) может обеспечить некоторую защиту.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Использует атрибут `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Использует CSS-модуль -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Использует BEM-соглашение -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
