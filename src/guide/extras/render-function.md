---
outline: deep
---

# Render-функции & JSX {#render-functions-jsx}

Vue рекомендует использовать шаблоны для создания приложений в большинстве случаев. Однако есть ситуации, когда нам нужна полная программная мощность JavaScript. Здесь мы можем использовать **render-функцию**.

> Если вы еще не знакомы с концепцией виртуального DOM и render-функциями, обязательно прочтите сначала раздел [Механизм отрисовки](/guide/extras/rendering-mechanism).

## Основное Использование {#basic-usage}

### Создание Vnodes {#creating-vnodes}

Vue предоставляет функцию `h()` для создания vnodes:

```js
import { h } from 'vue'

const vnode = h(
  'div', // тип
  { id: 'foo', class: 'bar' }, // входные параметры
  [
    /* дочерние элементы */
  ]
)
```

`h()` это сокращение от **hyperscript**, что означает "JavaScript, который создает HTML (hypertext markup language)". Это название унаследовано от соглашений, общих для многих реализаций виртуального DOM. Более точным названием может быть`createVnode()`, но короткое название удобнее, когда приходится вызывать эту функцию много раз в render-функции.

Функция `h()` спроектирована очень гибко:

```js
// все аргументы, кроме типа, необязательные
h('div')
h('div', { id: 'foo' })

// в качестве входных параметров могут использоваться как атрибуты, так и свойства
// Vue автоматически выбирает правильный способ назначения
h('div', { class: 'bar', innerHTML: 'hello' })

// Модификаторы входных параметров .prop и .attr могут быть добавлены
// с префиксами '.' and `^' соответственно

h('div', { '.name': 'some-name', '^width': '100' })

// атрибуты class и style имеют такую же поддержку объекта/массива
// которую они имеют в шаблонах
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// слушатели событий должны передаваться как onXxx
h('div', { onClick: () => {} })

// дочерние элементы могут быть в виде строки
h('div', { id: 'foo' }, 'hello')

// входные параметры могут быть опущены, если они отсутствуют
h('div', 'hello')
h('div', [h('span', 'hello')])

// дочерние элементы могут содержать одновременно и vnodes, и строки
h('div', ['hello', h('span', 'hello')])
```

Полученный vnode имеет следующую форму:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Примечание
Полный интерфейс `VNode` содержит множество других внутренних свойств, но настоятельно рекомендуется избегать использования любых свойств, кроме перечисленных здесь. Это позволит избежать непредвиденных ошибок в случае изменения внутренних свойств.
:::

### Обьявление Render-функций {#declaring-render-functions}

<div class="composition-api">

При использовании шаблонов с Composition API возвращаемое значение хука `setup()` используется для передачи данных шаблону. Однако при использовании render-функции мы можем напрямую вернуть функцию рендеринга:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // возвращается render-функция
    return () => h('div', props.msg + count.value)
  }
}
```

Render-функция объявляется внутри `setup()`, поэтому она имеет доступ к props и любому реактивному состоянию, объявленному в той же области видимости.

Кроме возврата одного vnode, можно также возвращать строки или массивы:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // использование массива для возврата нескольких корневых узлов
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip Совет
Убедитесь, что вместо прямого возврата значений возвращается функция! Функция `setup()` вызывается только один раз для каждого компонента, в то время как возвращаемая render-функция будет вызываться несколько раз.
:::

</div>
<div class="options-api">

Мы можем объявить render-функцию используя опцию `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Функция `render()` имеет доступ к экземпляру компонента через `this`.

Помимо возврата одного узла, также можно возвращать строки или массивы:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // использование массива для возврата нескольких корневых узлов
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Если компоненту render-функции не требуется состояние экземпляра, то для краткости он может быть объявлен непосредственно как функция:

```js
function Hello() {
  return 'hello world!'
}
```

Все верно, это действительно компонент Vue! Подробнее об этом синтаксисе смотрите в разделе [Функциональные компоненты](#functional-components).

### Vnodes должны быть уникальными {#vnodes-must-be-unique}

Все vnodes в дереве компонентов должны быть уникальными. Это означает, что следующая render-функция недопустима:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Упс - дублированные vnodes!
    p,
    p
  ])
}
```

Если вы действительно хотите дублировать один и тот же элемент/компонент, это можно сделать с помощью фабричного метода. Например, следующая render-функция является вполне корректным способом вывода 20 одинаковых абзацев:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) - это XML-подобное расширение для JavaScript, позволяющее писать такой код:

```jsx
const vnode = <div>hello</div>
```

Используйте фигурные скобки в выражениях JSX, чтобы встраивать динамические значения:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

В `create-vue` и Vue CLI есть параметры для создания проектов с предварительно настроенной поддержкой JSX. Если вы настраиваете JSX вручную, обратитесь к документации по [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) чтобы узнать больше.

Хотя JSX впервые появился в React, на самом деле он не имеет определенной семантики во время выполнения и может быть скомпилирован в различные выходные данные. Если вы уже работали с JSX, обратите внимание, что **преобразование JSX в Vue отличается от преобразования JSX в React**, поэтому вы не можете использовать трансформацию JSX React в приложениях Vue. Некоторые заметные отличия от React JSX включают следующее:

- В качестве входных параметров вы можете использовать такие HTML атрибуты как `class` и `for` - нет необходимости использовать `className` или `htmlFor`.
- Передача дочерних элементов компоненту (т.е. слотов) [работает по-другому](#passing-slots).

Определение типов Vue обеспечивает определение типов для использования TSX. При использовании TSX обязательно укажите `"jsx": "preserve"` в файле `tsconfig.json`, чтобы TypeScript оставлял синтаксис JSX нетронутым для его обработки JSX-преобразованием Vue.


### JSX Type Inference {#jsx-type-inference}

Подобно преобразованию, JSX Vue также нуждается в других определениях типов.

Начиная с версии Vue 3.4, Vue больше не регистрирует неявно глобальное пространство имен `JSX`. Чтобы указать TypeScript использовать определения типов JSX от Vue, обязательно включите в свой файл `tsconfig.json` следующее:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Вы также можете подписаться на каждый отдельный файл, добавив комментарий `/* @jsxImportSource vue */` вверху файла.

Если есть код, который зависит от наличия глобального пространства имен `JSX`, вы можете сохранить точное глобальное поведение до версии 3.4, явно импортировав или ссылаясь на `vue/jsx` в своем проекте, который регистрирует глобальное пространство имен `JSX`.

## Реализация возможностей шаблона с помощью render-функций {#render-function-recipes}

Ниже мы приведем несколько общих возможностей реализации функций шаблона в виде эквивалентных им render-функций / JSX.

### `v-if` {#v-if}

Шаблон:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Эквивалент render-функции / JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Шаблон:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Эквивалент render-функции / JSX:

<div class="composition-api">

```js
h(
  'ul',
  // предполагается, что `items` - это ref, который содержит массив
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Входные параметры с именами, начинающимися с `on`, за которым следует заглавная буква, рассматриваются как слушатели событий. Например, `onClick` является эквивалентом `@click` в шаблонах.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  нажмите здесь
</button>
```

#### Модификаторы Событий {#event-modifiers}

Модификаторы событий `.passive`, `.capture` и `.once` могут быть добавлены после названия события с использованием camelCase.

Например:

```js
h('input', {
  onClickCapture() {
    /* слушатель в режиме погружения */
  },
  onKeyupOnce() {
    /* сработает только один раз */
  },
  onMouseoverOnceCapture() {
    /* сработает один раз + режим погружения */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Для других событий и модификаторов можно использовать метод [`withModifiers`](/api/render-function#withmodifiers):


```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Компоненты {#components}

Чтобы создать vnode для компонента, первым аргументом, передаваемым в `h()`, должно быть определение компонента. Это означает, что при использовании render-функции нет необходимости регистрировать компоненты - вы можете просто использовать импортированные компоненты напрямую:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Как мы видим, `h` может работать с компонентами, импортированными из файлов любого формата, если это корректный компонент Vue.

Динамические компоненты становятся более простыми с render-функциями:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Если компонент зарегистрирован по имени и не может быть импортирован напрямую (например, глобально зарегистрирован библиотекой), его можно программно разрешить с помощью метода [`resolveComponent()`](/api/render-function#resolvecomponent).

### Отрисовка Слотов {#rendering-slots}

<div class="composition-api">

В render-функциях доступ к слотам осуществляется из контекста `setup()`. Каждый слот в объекте `slots` представляет собой **функцию, возвращающую массив vnodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // слот по умолчанию:
      // <div><slot /></div>
      h('div', slots.default()),

      // именованный слот:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

Эквивалент JSX:

```jsx
// по умолчанию
<div>{slots.default()}</div>

// именованный
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

В render-функцияx, доступ к слотам осуществляется через [`this.$slots`](/api/component-instance#slots):


```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

Эквивалент JSX:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Passing Slots {#passing-slots}

Передача дочерних элементов компонентам работает несколько иначе, чем передача дочерних элементов элементам. Вместо массива нам нужно передать либо слот-функцию, либо объект слот-функции. Слот-функции могут возвращать все, что может вернуть обычная render-функция. Слот-функции при обращении к дочернему компоненту всегда будут нормализованы к массивам vnodes.

```js
// один слот по умолчанию
h(MyComponent, () => 'hello')

// именованные слоты
// обратите внимание, что `null` требуется для того
// чтобы объект слотов не рассматривался как входные параметры
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

Эквивалент JSX:

```jsx
// по умолчанию
<MyComponent>{() => 'hello'}</MyComponent>

// именованные
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Передача слотов в виде функций позволяет дочернему компоненту лениво вызывать их. Это приводит к тому, что зависимости слота отслеживаются дочерним компонентом, а не родительским, что обеспечивает более точное и эффективное обновление.

### Scoped Slots

Чтобы отобразить слот с ограниченной областью видимости в родительском компоненте, слот передается дочернему компоненту. Обратите внимание, что у слота есть параметр `text`. Слот будет вызван в дочернем компоненте, и данные из дочернего компонента будут переданы родительскому компоненту.

```js
// родительский компонент
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Не забудьте передать `null`, чтобы слоты не рассматривались как props.

```js
// дочерний компонент
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

Эквивалент JSX:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### Встроенные Компоненты {#built-in-components}

[Встроенные компоненты](/api/built-in-components.html), такие как `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` и `<Suspense>`, должны быть импортированы для использования в render-функциях:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

Директива `v-model` при компиляции шаблона расширяется до входных параметров `modelValue` и `onUpdate:modelValue` - нам придется предоставлять их самостоятельно:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Пользовательские директивы {#custom-directives}

Пользовательские директивы могут быть применены к vnode с помощью [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// пользовательская директива
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Если директива зарегистрирована по имени и не может быть импортирована напрямую, она может быть разрешена с помощью метода [`resolveDirective`](/api/render-function#resolvedirective).

### Template Refs {#template-refs}

<div class="composition-api">

С Composition API ссылки на шаблон создаются путем передачи самого `ref()` в качестве props в vnode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

</div>
<div class="options-api">

With the Options API, template refs are created by passing the ref name as a string in the vnode props:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Функциональные Компоненты {#functional-components}

Функциональные компоненты - это альтернативная форма компонентов, не имеющая собственного состояния. Они действуют как чистые функции: входные параметры на входе, vnodes на выходе. Они отображаются без создания экземпляра компонента (т.е. без `this`) и без обычных хуков жизненного цикла компонента.

Для создания функционального компонента мы используем не объект options, а обычную функцию. Функция фактически является функцией `render` для компонента.

<div class="composition-api">

Сигнатура функционального компонента совпадает с сигнатурой хука `setup()`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Поскольку для функционального компонента не существует ссылки `this`, Vue передает `props` в качестве первого аргумента :

```js
function MyComponent(props, context) {
  // ...
}
```

Второй аргумент, `context`, содержит три свойства: `attrs`, `emit` и `slots`. Они эквивалентны свойствам экземпляра [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit) и [`$slots`](/api/component-instance#slots) соответственно.

</div>

Большинство обычных параметров конфигурации для компонентов недоступны для функциональных компонентов. Однако можно определить [`props`](/api/options-state#props) и [`emits`](/api/options-state#emits), добавив их в качестве свойств:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Если опция `props` не указана, то объект `props`, передаваемый функции, будет содержать все атрибуты, как и `attrs`. Названия входных параметров не будут нормализованы к camelCase, если опция `props` не указана.

Для функциональных компонентов с явным указанием `props`, [обычные атрибуты](/guide/components/attrs) работают так же, как и для обычных компонентов. Однако для функциональных компонентов, не указывающих явно свои `props`, по умолчанию от `attrs` наследуются только слушатели событий `class`, `style` и `onXxx`. В любом случае для отключения наследования атрибутов можно установить значение `inheritAttrs` в `false`:


```js
MyComponent.inheritAttrs = false
```

Функциональные компоненты могут быть зарегистрированы и использованы так же, как и обычные компоненты. Если передать функцию в качестве первого аргумента `h()`, то она будет рассматриваться как функциональный компонент.

### Типизирование функциональных компонентов<sup class="vt-badge ts" /> {#typing-functional-components}

Функциональные компоненты можно типизировать в зависимости от того, являются ли они именованными или анонимными. Volar также поддерживает проверку типов правильно типизированных функциональных компонентов при их использовании в шаблонах SFC.

**Именованный функциональный компонент**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Анонимный функциональный компонент**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
