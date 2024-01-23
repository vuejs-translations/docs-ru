# API рендер-функции {#render-function-apis}

## h() {#h}

Создает узлы виртуального DOM (vnodes).

- **Тип**

  ```ts
  // полная сигнатура
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // без входных параметров
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Типы упрощены для удобства чтения.

- **Подробности**

  Первым аргументом может быть либо строка (для нативных элементов), либо определение компонента Vue. Второй аргумент - передаваемые входные параметры, а третий - дочерние элементы.

  При создании vnode компонента дочерние компоненты должны быть переданы в виде слот-функций. Можно передать одну слот-функцию, если компонент ожидает только слот по умолчанию. В противном случае слоты должны быть переданы в виде объекта слот-функций.

  Для удобства аргумент для передачи входных параметров может быть опущен, если дочерние объекты не являются объектами слотов.

- **Пример**

  Создание нативных элементов:

  ```js
  import { h } from 'vue'

  // все аргументы, кроме типа, являются необязательными
  h('div')
  h('div', { id: 'foo' })

  // в качестве входных параметров могут использоваться как атрибуты, так и свойства
  // Vue автоматически выбирает правильный способ назначения
  h('div', { class: 'bar', innerHTML: 'hello' })

  // класс и стиль имеют такое формат объект / массив
  // как и в шаблонах
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // обработчики событий должны передаваться через onXxx
  h('div', { onClick: () => {} })

  // дочерние элементы могут быть строкой
  h('div', { id: 'foo' }, 'hello')

  // входные параметры могут быть опущены при их отсутствии
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // массив дочерних элементов может содержать смешанные vnodes и строки
  h('div', ['hello', h('span', 'hello')])
  ```

  Создание компонентов:

  ```js
  import Foo from './Foo.vue'

  // передача входных параметров
  h(Foo, {
    // эквивалент some-prop="hello"
    someProp: 'hello',
    // эквивалент @update="() => {}"
    onUpdate: () => {}
  })

  // передача одного слота по умолчанию
  h(Foo, () => 'default slot')

  // передача именованных слотов
  // обратите внимание, что `null` требуется для того,
  // чтобы объект слотов не рассматривался как входные параметры
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **См. также** [Руководство — Render-функции - Создание Vnodes](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Слияние нескольких объектов входных параметров со специальной обработкой для некоторых из них.

- **Тип**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Подробности**

  `mergeProps()` поддерживает объединение нескольких объектов входных параметров со специальной обработкой для следующих входных параметров:

  - `class`
  - `style`
  - `onXxx` обработчики событий - несколько обработчиков с одинаковыми именами будут объединены в массив.

  Если вам не нужно поведение слияния и требуется простая перезапись, то вместо этого можно использовать нативный spread объектов.

- **Пример**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Клонирование vnode.

- **Тип**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Подробности**

  Возвращает клонированный vnode, опционально с дополнительными входными параметрами для объединения с оригиналом.

  Vnodes следует считать иммутабельными после их создания, и не следует изменять входные параметры существующего vnode. Вместо этого следует клонировать его с другими / дополнительными входными параметрами.

  Vnodes обладают особыми внутренними свойствами, поэтому их клонирование не так просто, как spread объекта. Функция `cloneVNode()` обрабатывает большую часть внутренней логики.

- **Пример**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Проверяет, является ли значение vnode.

- **Тип**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Для ручного разрешения зарегистрированного компонента по имени.

- **Тип**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Подробности**

  **Примечание: не требуется, если вы можете импортировать компонент напрямую.**

  `resolveComponent()` должен быть вызван внутри<span class="composition-api"> `setup()`, либо внутри</span> render-функции для того, чтобы разрешение происходило из правильного контекста компонента.

  Если компонент не найден, то выдается runtime предупреждение и вернется название компонента в виде строки.

- **Пример**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **См. также** [Руководство — Render-функции - Компоненты](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Для ручного разрешения зарегистрированной директивы по имени.

- **Тип**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Подробности**

  **Примечание: не требуется, если вы можете импортировать компонент напрямую.**

  `resolveDirective()` должна быть вызвана внутри<span class="composition-api"> `setup()`, либо внутри</span> render-функции, чтобы разрешение производилось из правильного контекста компонента.

  Если директива не найдена, то выдается runtime предупреждение, а функция вернёт значение `undefined`.

- **См. также** [Руководство — Render-функции - Пользовательские директивы](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Добавления пользовательских директив к vnodes.

- **Тип**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Директива, значение, аргумент, модификаторы]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Подробности**

  Обертывает существующий vnode пользовательскими директивами. Вторым аргументом является массив пользовательских директив. Каждая пользовательская директива также представляется в виде массива в форме `[Директива, значение, аргумент, модификаторы]`. Последние элементы массива могут быть опущены, если они не нужны.

- **Пример**

  ```js
  import { h, withDirectives } from 'vue'

  // пользовательская директива
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **См. также** [Руководство — Render-функции - Пользовательские директивы](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Добавление встроенных модификаторов [`v-on`](/guide/essentials/event-handling#event-modifiers) в функцию-обработчик события.


- **Тип**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **Пример**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {

    // эквивалент v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **См. также** [Руководство — Render-функции - Модификаторы cобытий](/guide/extras/render-function#event-modifiers)
