# Отрисовка списков {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Бесплатный урок про отрисовку списков во Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Бесплатный урок про отрисовку списков во Vue.js"/>
</div>

## Отображение элементов массива через `v-for` {#v-for}

Используйте директиву `v-for` для отрисовки списка элементов на основе массива данных. У директивы `v-for` специальный синтаксис: `item in items`, где `items` — исходный массив, а `item` — **ссылка** на итерируемый элемент массива:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Внутри блока `v-for` доступны все свойства из области видимости родителя. Также может быть второй опциональный параметр у `v-for` с индексом текущего элемента:

<div class="composition-api">

```js
const parentMessage = ref('Родитель')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Родитель',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Родитель'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

Область видимости переменных в `v-for` аналогична следующему коду JavaScript:

```js
const parentMessage = 'Родитель'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // есть доступ к внешней области видимости и `parentMessage`
  // но переменные `item` и `index` доступны только здесь
  console.log(parentMessage, item.message, index)
})
```

Обратите внимание, что значения внутри директивы `v-for` совпадают с сигнатурой функции коллбэка `forEach`. Вообще-то можно использовать деструктуризацию на переменной текущего элемента, аналогично деструктуризации аргументов функции:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- при использовании переменой для индекса -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Для вложенных `v-for` область видимости работает аналогично вложенным функциям. Каждая область видимости `v-for` имеет доступ к родительским областям видимости:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Можно использовать `of` в качестве разделителя вместо `in`, как в синтаксисе итераторов JavaScript:

```vue-html
<div v-for="item of items"></div>
```

## Отображение свойств объекта через `v-for` {#v-for-with-an-object}

Также можно использовать `v-for` для итерирования по свойствам объекта. При итерации по объекту порядок обхода свойств будет как и в `Object.keys()`:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Можно указать второй аргумент для получения имени свойства (ключа объекта):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

И третий — для индекса:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` и диапазоны {#v-for-with-a-range}

Можно передавать целое число в `v-for` — шаблон будет повторяться указанное число раз.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Обратите внимание, что в таком случае значения `n` начинаются с `1`, а не с `0`.

## `v-for` и `<template>` {#v-for-on-template}

Аналогично использованию с `v-if`, также можно использовать тег `<template>` с директивой `v-for` для отрисовки блоков из нескольких элементов. Например:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` и `v-if` {#v-for-with-v-if}

:::warning Примечание
Обратите внимание, **не рекомендуется** использовать вместе `v-if` и `v-for` на одном элементе. Подробнее можно прочитать в разделе [рекомендаций](/style-guide/rules-essential#avoid-v-if-with-v-for).
:::

Когда они указаны вместе на одном узле, у `v-if` будет больший приоритет, чем у `v-for`. И поэтому в условии `v-if` не будет доступа к переменным из области видимости `v-for`:

```vue-html
<!--
Будет выброшена ошибка, так как свойство "todo" не объявлено в экземпляре.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Это можно исправить, для ясности переместив `v-for` на тег-обёртку `<template>`:

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## Сохранение состояния с помощью `key` {#maintaining-state-with-key}

При обновлении Vue списка элементов, отрисованного директивой `v-for`, по умолчанию используется стратегия обновления «на месте». Если порядок элементов массива или объекта изменился, Vue не станет перемещать элементы DOM, а просто обновит каждый элемент «на месте», чтобы он отображал новые данные по соответствующему индексу.

Режим по умолчанию эффективен, но **применим только в случаях, когда результат отрисовки списка не полагается на состояние дочерних компонентов или временное состояние DOM (например, значения в полях форм)**.

Чтобы подсказать Vue, как определять идентичность каждого элемента, и, таким образом, переиспользовать и упорядочивать существующие элементы, необходимо указать уникальный атрибут `key` для каждого элемента:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- Содержимое -->
</div>
```

При использовании `<template v-for>` атрибут `key` нужно устанавливать на контейнер `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Примечание
`key` в данном случае — специальный атрибут, связываемый через `v-bind`. Его не следует путать с переменной с именем key при [использовании `v-for` с объектами](#v-for-with-an-object).
:::

[Рекомендуется](/style-guide/rules-essential#use-keyed-v-for) всегда указывать атрибут `key` с `v-for`, кроме случаев когда итерируемое содержимое DOM простое (т.е. не содержит компонентов или элементов DOM с состоянием), или когда сознательно полагаетесь на стратегию обновления по умолчанию для улучшения производительности.

Привязка `key` ожидает использования примитивных значений — строк и чисел. Не используйте объекты в качестве ключей для `v-for`. Подробное использование атрибута `key` описано в [документации API](/api/built-in-special-attributes#key).

## `v-for` и компоненты {#v-for-with-a-component}

> Эта секция подразумевает, что уже знакомы с [компонентами](/guide/essentials/component-basics). Не стесняйтесь пропустить её сейчас и вернуться потом.

Можно использовать `v-for` на компонентах, как на обычных элементах (не забывайте указать `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Однако в компонент никакие данные автоматически передаваться не будут, поскольку у каждого будет своя изолированная область видимости. Чтобы передать итерируемые данные в компонент потребуется явно использовать входные параметры:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Причина, почему не происходит автоматической передачи `item` в компонент заключается в том, что это сделает компонент жёстко связанным с тем, как работает `v-for`. Но явное указание на то, откуда поступают данные, позволит переиспользовать и в других ситуациях.

<div class="composition-api">

Посмотрите [этот пример простого TODO-списка](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=), чтобы увидеть, как отрисовать список компонентов с помощью `v-for`, передавая разные данные каждому экземпляру.

</div>
<div class="options-api">

Посмотрите [этот пример простого TODO-списка](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=), чтобы увидеть, как отрисовать список компонентов с помощью `v-for`, передавая разные данные каждому экземпляру.

</div>

## Отслеживание изменений в массивах {#array-change-detection}

### Методы изменения, мутирующие массив {#mutation-methods}

Vue способен определять, когда вызываются методы мутации реактивного массива, и запускать необходимые обновления. К таким мутирующим методам относятся:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Методы изменения с заменой массива {#replacing-an-array}

Методы, мутирующие массив, как следует из названия, будут изменять исходный массив, на котором они вызваны. Но есть и другие, например `filter()`, `concat()` и `slice()`, которые не мутируют исходный массив, а **всегда возвращают новый массив**. При их использовании можно просто заменять старый массив на новый:

<div class="composition-api">

```js
// `items` это ref-ссылка с массивом в значении
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Может показаться, что в таких случаях Vue придётся выбросить существующий DOM и заново отрисовать весь список — к счастью, это не так. Во Vue есть умные эвристики для максимизации переиспользования элементов DOM, поэтому замена одного массива другим, в случае совпадения части элементов этих массивов, будет очень эффективной операцией.

## Отображение отфильтрованных/отсортированных результатов {#displaying-filtered-sorted-results}

Иногда может потребоваться отображать отфильтрованную или отсортированную версию массива, сохранив оригинальные данные. В таком случае можно создать вычисляемое свойство, которое будет возвращать отфильтрованный или отсортированный массив.

Например:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

В ситуациях, когда вычисляемые свойства невозможно применить (например, внутри вложенных циклов `v-for`), можно использовать метод:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Обратите внимание на использование `reverse()` и `sort()` в вычисляемых свойствах! Эти два метода изменят исходный массив, а этого следует избегать в геттерах вычисляемых свойств. Поэтому перед вызовом этих методов создайте копию исходного массива:

<div class="composition-api">

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

</div>
<div class="options-api">

```diff
- return this.numbers.reverse()
+ return [...this.numbers].reverse()
```

</div>
