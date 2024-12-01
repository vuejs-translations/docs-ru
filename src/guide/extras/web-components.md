# Vue и Веб-компоненты {#vue-and-web-components}

[Веб-компоненты (Web Components)](https://developer.mozilla.org/en-US/docs/Web/Web_Components) — общий термин набора нативных API, которые позволяют веб-разработчикам создавать переиспользуемые пользовательские элементы.

Vue и веб-компоненты — взаимодополняющие технологии. Vue имеет отличную поддержку и чтобы использовать и чтобы создавать пользовательские элементы. Независимо от того, интегрируете пользовательские элементы в приложение Vue, или используете Vue для разработки и распространения пользовательских элементов, не прогадаете.

## Использование пользовательских элементов во Vue {#using-custom-elements-in-vue}

Vue [безупречно получает 100% в тестах Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Использование в приложении Vue пользовательских элементов в целом работает аналогично обычному использованию нативных HTML-элементов. Несколько моментов, о которых стоит помнить:

### Пропуск определения компонента {#skipping-component-resolution}

По умолчанию Vue будет пытаться разрешить ненативный HTML-тег зарегистрированным компонентом Vue, прежде чем вернуться к его отрисовке как пользовательского элемента. Это приведет к тому, что во время разработки Vue выдаст предупреждение "не удалось определить компонент" (англ.: "failed to resolve component"). Чтобы сообщить Vue, что некоторые элементы должны рассматриваться как пользовательские и предотвратить их определение как компонентов, мы можем указать параметр [`compilerOptions.isCustomElement`](/api/application#app-config-compileroptions).

В приложениях Vue с использованием шага сборки, опцию необходимо передавать через конфигурацию сборки, поскольку она используется во время компиляции.

#### Пример конфигурации в браузере{#example-in-browser-config}

```js
// Работает только при использовании компиляции шаблонов в браузере.
// При использовании системы сборки, см. примеры ниже.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Пример конфигурации Vite {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // считать все теги с тире как пользовательские элементы
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Пример конфигурации Vue CLI {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // считать все теги начинающиеся с ion- пользовательскими элементами
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Передача свойств DOM {#passing-dom-properties}

Поскольку атрибуты DOM могут быть только строками, то появляется необходимость передавать сложные данные в пользовательские элементы через свойства DOM. При установке входных параметров для пользовательского элемента, Vue 3 автоматически проверяет наличие DOM-свойства с помощью оператора `in` и предпочтёт установить значение как DOM-свойство, если ключ присутствует. Чаще всего об этом и не придётся думать, если пользовательский элемент разработан следуя [рекомендуемым практикам](https://web.dev/custom-elements-best-practices/).

Возможны крайние случаи, когда данные должны быть переданы как свойство DOM, но пользовательский элемент не объявляет/отражает свойство должным образом (приводя к неудаче при проверке с помощью `in`). В таких случаях, форсировать привязку `v-bind` для установки свойства DOM можно использованием модификатора `.prop`:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- сокращенная запись -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Создание пользовательских элементов с помощью Vue {#building-custom-elements-with-vue}

Главное преимущество пользовательских элементов в том, что их можно использовать с любым фреймворком или даже без него. Это делает их идеальными для распространения компонентов, когда конечный пользователь может использовать во фронтенде другой стек, или когда следует изолировать конечное приложение от деталей реализации компонентов, которые оно использует.

### defineCustomElement {#definecustomelement}

Vue позволяет создавать пользовательские элементы с точно таким же же API компонентов Vue с помощью метода [`defineCustomElement`](/api/custom-elements#definecustomelement). Метод принимает такой же аргумент, что и [`defineComponent`](/api/general#definecomponent), но вместо этого будет возвращать конструктор пользовательского элемента, расширяющего `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // обычные опции компонента Vue
  props: {},
  emits: {},
  template: `...`,

  // только для defineCustomElement: CSS, внедряемый в shadow root
  styles: [`/* inlined css */`]
})

// регистрация пользовательского элемента.
// после регистрации все теги `<my-vue-element>`
// на странице будут обновлены.
customElements.define('my-vue-element', MyVueElement)

// Вы также можете программно создать экземпляр элемента:
// (это может быть сделано только после регистрации)
document.body.appendChild(
  new MyVueElement({
    // начальные входные параметры (опционально)
  })
)
```

#### Жизненный цикл {#lifecycle}

- Пользовательский элемент Vue будет монтировать внутренний экземпляр компонента Vue внутри своего shadow root при первом вызове [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) на элементе.

- При вызове `disconnectedCallback` на элементе Vue будет проверять, отсоединён ли элемент от документа после microtask тика.

  - Если элемент будет всё ещё находиться в документе, то это считается перемещением и экземпляр компонента будет сохранён;

  - Если элемент будет отсоединён от документа, то это считается удалением и экземпляр компонента будет размонтирован.

#### Входные параметры {#props}

- Все входные параметры для пользовательского элемента, объявленные в опции `props`, будут определены в пользовательском элементе как свойства. Vue автоматически обработает соответствие между атрибутами / свойствами, где это необходимо.

  - Атрибуты всегда отражаются в соответствующих свойствах

  - Свойства с примитивными значениями (`string`, `boolean` or `number`) отражаются как атрибуты.

- Vue автоматически приведёт входные параметры, объявленные с типами `Boolean` или `Number`, к нужному типу, когда они устанавливаются в качестве атрибутов (которые всегда являются строками). К примеру, рассмотрим объявление входных параметров::

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Использование пользовательского элемента:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  В компоненте значение `selected` будет приведено к `true` (boolean), а `index` - к `1` (number).

#### События {#events}

События, генерируемые через `this.$emit` или setup `emit`,будут генерироваться на пользовательском элементе как нативные [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent). Дополнительные аргументы события (payload / данные передаваемые с событием) будут содержаться в объекте CustomEvent в свойстве `details` в виде массива.

#### Слоты {#slots}

Внутри компонента слоты могут указываться как обычно, с помощью элемента `<slot/>`. Но при получении результирующего элемента должен быть только [нативный синтаксис слотов](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Слоты с ограниченной областью видимости](/guide/components/slots#scoped-slots) не поддерживаются.

- При передаче именованных слотов используйте атрибут `slot` вместо директивы `v-slot`:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) и [его эквивалент в Composition API](/api/composition-api-dependency-injection#provide) также работают между пользовательскими элементами, определяемыми Vue. Однако обратите внимание, что это работает **только между пользовательскими элементами**. То есть пользовательский элемент, определяемый Vue, не сможет инжектировать свойства, предоставляемые компонентом Vue, не являющимся пользовательским элементом.

#### App Level Config <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

You can configure the app instance of a Vue custom element using the `configureApp` option:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### Однофайловые компоненты как пользовательские элементы {#sfc-as-custom-element}

Метод `defineCustomElement` также работает с однофайловыми компонентами Vue (SFC). Однако при стандартной настройке инструментов `<style>` внутри SFC все равно будут извлечены и объединены в один CSS-файл при production сборке. При использовании SFC в качестве пользовательского элемента часто более желательным вариантом будет внедрение тегов `<style>` в shadow root пользовательского элемента.

Официальные инструменты для однофайловых компонентов поддерживают их импорт в "режиме пользовательского элемента" (требуется `@vitejs/plugin-vue@^1.4.0` или `vue-loader@^16.5.0`). Однофайловый компонент, загруженный в режиме пользовательского элемента, вставляет свои теги `<style>` как строки CSS и раскрывает их в параметре компонента `styles`. Их использует `defineCustomElement` и при инициализации внедрено в shadow root элемента.

Для переключения в этот режим, требуется завершить имя файла компонента на `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* инлайн css */"]

// преобразование в конструктор пользовательского элемента
const ExampleElement = defineCustomElement(Example)

// регистрация
customElements.define('my-example', ExampleElement)
```

Если нужно настроить, какие файлы должны импортироваться в режиме пользовательских элементов (например, чтобы пользовательскими элементами считались _все_ однофайловые компоненты), можно передать параметр `customElement` соответствующим плагинам системы сборки:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Советы по созданию библиотеки пользовательских элементов на Vue {#tips-for-a-vue-custom-elements-library}

При создании пользовательских элементов с помощью Vue элементы будут опираться на среду выполнения Vue. В зависимости от количества используемых функций, базовый размер будет составлять ~16 кб. Это означает, что использование Vue не является идеальным, если вы поставляете один пользовательский элемент - возможно, вам лучше использовать ванильный JavaScript, [petite-vue](https://github.com/vuejs/petite-vue) или фреймворки, которые специализируются на небольшом размере среды выполнения. Но такой базовый размер более чем оправдан, если поставлять коллекцию пользовательских элементов со сложной логикой, так как Vue позволит создавать каждый компонент с гораздо меньшим количеством кода. Чем больше элементов будет поставляться, тем выгоднее окажется этот компромисс.

Если пользовательские элементы будут использоваться в приложении, которое также использует Vue, то можно настроить экстернализацию Vue, чтобы убрать его из итоговой сборки, а элементы стали использовать Vue из основного приложения.

Рекомендуется экспортировать отдельные конструкторы элементов, чтобы позволить их импортировать по необходимости или регистрировать с нужными именами тегов. Также можно экспортировать удобную функцию для автоматической регистрации всех элементов. Вот пример точки входа пользовательской библиотеки пользовательских элементов на Vue:

```js
// elements.js

import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// экспорт отдельных элементов
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

A consumer can use the elements in a Vue file,

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

or in any other framework such as one with JSX, and with custom names:

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ...>
      <some-bar ...></some-bar>
    </some-foo>
  </>
}
```

### Vue-based Web Components and TypeScript {#web-components-and-typescript}

When writing Vue SFC templates, you may want to [type check](/guide/scaling-up/tooling.html#typescript) your Vue components, including those that are defined as custom elements.

Custom elements are registered globally in browsers using their built-in APIs, and by default they won't have type inference when used in Vue templates. To provide type support for Vue components registered as custom elements, we can register global component typings by augmenting the [`GlobalComponents` interface](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) for type checking in Vue templates (JSX users can augment the [JSX.IntrinsicElements](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) type instead, which is not shown here).

Here is how to define the type for a custom element made with Vue:

```typescript
import { defineCustomElement } from 'vue'

// Import the Vue component.
import SomeComponent from './src/components/SomeComponent.ce.vue'

// Turn the Vue component into a Custom Element class.
export const SomeElement = defineCustomElement(SomeComponent)

// Remember to register the element class with the browser.
customElements.define('some-element', SomeElement)

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    // Be sure to pass in the Vue component type here (SomeComponent, *not* SomeElement).
    // Custom Elements require a hyphen in their name, so use the hyphenated element name here.
    'some-element': typeof SomeComponent
  }
}
```

## Non-Vue Web Components and TypeScript {#non-vue-web-components-and-typescript}

Here is the recommended way to enable type checking in SFC templates of Custom
Elements that are not built with Vue.

> [!Note]
> This approach is one possible way to do it, but it may vary depending on the
> framework being used to create the custom elements.

Suppose we have a custom element with some JS properties and events defined, and
it is shipped in a library called `some-lib`:

```ts
// file: some-lib/src/SomeElement.ts

// Define a class with typed JS properties.
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // This method should not be exposed to template types.
  someMethod() {
    /* ... */
  }

  // ... implementation details omitted ...
  // ... assume the element dispatches events named "apple-fell" ...
}

customElements.define('some-element', SomeElement)

// This is a list of properties of SomeElement that will be selected for type
// checking in framework templates (f.e. Vue SFC templates). Any other
// properties will not be exposed.
export type SomeElementAttributes = 'foo' | 'bar'

// Define the event types that SomeElement dispatches.
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... details omitted ... */
}
```

The implementation details have been omitted, but the important part is that we
have type definitions for two things: prop types and event types.

Let's create a type helper for easily registering custom element type
definitions in Vue:

```ts
// file: some-lib/src/DefineCustomElement.ts

// We can re-use this type helper per each element we need to define.
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // Use $props to define the properties exposed to template type checking. Vue
  // specifically reads prop definitions from the `$props` type. Note that we
  // combine the element's props with the global HTML props and Vue's special
  // props.
  /** @deprecated Do not use the $props property on a Custom Element ref, this is for template prop types only. */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // Use $emit to specifically define event types. Vue specifically reads event
  // types from the `$emit` type. Note that `$emit` expects a particular format
  // that we map `Events` to.
  /** @deprecated Do not use the $emit property on a Custom Element ref, this is for template prop types only. */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// This maps an EventMap to the format that Vue's $emit type expects.
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

> [!Note]
> We marked `$props` and `$emit` as deprecated so that when we get a `ref` to a
> custom element we will not be tempted to use these properties, as these
> properties are for type checking purposes only when it comes to custom elements.
> These properties do not actually exist on the custom element instances.

Using the type helper we can now select the JS properties that should be exposed
for type checking in Vue templates:

```ts
// file: some-lib/src/SomeElement.vue.ts

import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

Suppose that `some-lib` builds its source TypeScript files into a `dist/` folder. A user of
`some-lib` can then import `SomeElement` and use it in a Vue SFC like so:

```vue
<script setup lang="ts">
// This will create and register the element with the browser.
import 'some-lib/dist/SomeElement.js'

// A user that is using TypeScript and Vue should additionally import the
// Vue-specific type definition (users of other frameworks may import other
// framework-specific type definitions).
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // Do not use these props, they are `undefined` (IDE will show them crossed out):
  el.$props
  el.$emit
})
</script>

<template>
  <!-- Now we can use the element, with type checking: -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // The type of `event` is inferred here to be `AppleFellEvent`
      }
    "
  ></some-element>
</template>
```

If an element does not have type definitions, the types of the properties and events can be
defined in a more manual fashion:

```vue
<script setup lang="ts">
// Suppose that `some-lib` is plain JS without type definitions, and TypeScript
// cannot infer the types:
import { SomeElement } from 'some-lib'

// We'll use the same type helper as before.
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... same as before, use a reference to the element ...
</script>

<template>
  <!-- ... same as before, use the element in the template ... -->
</template>
```

Custom Element authors should not automatically export framework-specific custom
element type definitions from their libraries, for example they should not
export them from an `index.ts` file that also exports the rest of the library,
otherwise users will have unexpected module augmentation errors. Users should
import the framework-specific type definition file that they need.

## Веб-компоненты против Vue компонентов {#web-components-vs-vue-components}

Некоторые разработчики считают, что стоит избегать моделей компонентов проприетарных фреймворков, и что использование исключительно пользовательских элементов сделает приложение «готовым к будущему». Поэтому далее попытаемся объяснить своё мнение, почему считаем это слишком упрощённым взглядом на проблему.

Между пользовательскими элементами и компонентами Vue действительно есть некоторый уровень совпадающих функций: они оба позволяют определять многократно используемые компоненты с передачей данных, генерацией событий и управлением жизненным циклом. Но API веб-компонентов относительно низкоуровневое и «сырое». Для создания реального приложения часто требуется довольно много дополнительных возможностей, которые эта платформа не охватывает:

- Декларативная и эффективная система шаблонов;

- Реактивная система управления состоянием, которая облегчает извлечение и переиспользование логики между компонентами;

- Производительный способ отрисовки компонентов на сервере и гидратация на клиенте (SSR), что важно для SEO и [метрик Web Vitals, таких как LCP](https://web.dev/vitals/). Отрисовка на стороне сервера нативных пользовательских элементов обычно состоит из симулирования DOM в Node.js и последующую сериализацию изменённого DOM, в то время как SSR для Vue когда это возможно компилируется в конкатенацию строк, что гораздо эффективнее.

Компонентная модель Vue разработана как целостная система, с учётом этих потребностей.

При наличии компетентной команды инженеров, вероятно, возможно построить эквивалент всего этого поверх родных пользовательских элементов — но это значит, что берёте на себя долгосрочное бремя поддержки собственного фреймворка, теряя при этом преимущества зрелой экосистемы фреймворка Vue и его сообщества.

Существуют фреймворки, построенные с использованием пользовательских элементов в качестве основы своей компонентной модели, но всем им неизбежно требуется внедрять свои собственные решения проблем, перечисленных выше. Применение таких фреймворков подразумевает принятие их технических решений для решения озвученных проблем, но, несмотря на рекламу, не защищает автоматически от потенциальных будущих изменений.

Также есть некоторые области, в которых пользовательские элементы могут быть ограничивающим фактором:

- Нетерпеливая оценка слотов не позволяет компоновать компоненты. [Слоты с ограниченной областью видимости](/guide/components/slots.html#scoped-slots) во Vue - это мощный механизм для композиции компонентов, который не может поддерживаться пользовательскими элементами из-за нетерпеливой природы нативных слотов. Нетерпеливые слоты также означают, что принимающий компонент не может контролировать, когда и нужно ли выводить содержимое слота.

- Доставка пользовательских элементов с shadow DOM и локальным (scoped) CSS сейчас требует встраивания CSS в JavaScript, чтобы их можно было внедрить в shadow root в runtime. Это также приводит к дублированию стилей в разметке в сценариях с SSR. В этой области работают над новыми [возможностями платформы](https://github.com/whatwg/html/pull/4898/), но на данный момент они ещё не поддерживаются повсеместно, и всё ещё есть проблемы с производительностью в production и SSR, которые требуется решить. В тоже время, однофайловые компоненты Vue предоставляют [механизм локализации CSS](/api/sfc-css-features), который поддерживает извлечение стилей в обычные CSS-файлы.

Vue всегда будет идти в ногу с последними стандартами веб-платформ, и использовать всё, что предоставляет платформа, если это может облегчить работу. Но текущая цель — предоставлять решения, которые работают хорошо и работают уже сегодня. Это значит, что новые возможности платформы следует включать лишь критически поразмыслив — и это подразумевает заполнение пробелов, где стандарты ещё не соответствуют требованиям.
