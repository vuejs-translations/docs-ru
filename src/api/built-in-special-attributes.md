# Built-in Special Attributes

## key

--- The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify vnodes when diffing the new list of nodes against the old list.
+++ Специальный атрибут `key` (ключ) в первую очередь используется как подсказка для алгоритма виртуального DOM Vue для идентификации VNode (виртуальных узлов) при вычислении разницы между обновленным списком узлов и старым. 

- **Ожидает:** `number | string | symbol`

- **Подробности:**

  --- Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed / destroyed.
  +++ Без ключей Vue использует алгоритм, который минимизирует перемещение элемента и пытается изменять/переиспользовать элементы одного типа как можно больше. При использовании ключей Vue переупорядочивает элементы на основании изменения ключей, а элементы с ключами, которые уже отсутствуют, будут всегда удаляться/уничтожаться. 

  --- Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.
  +++ Потомки одного и того же общего родителя должны иметь **уникальные ключи**. Дубликаты ключей будут приводить к ошибкам рендера.

  --- The most common use case is combined with `v-for`:
  +++ Чаще всего используется в сочетании с `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  --- It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:
  +++ Так же может использоваться для принудительной замены элемент/компонента вместо его переиспользования. Это может пригодиться, если вы хотите:

  --- - Properly trigger lifecycle hooks of a component
  +++ - Корректно вызвать хуки жизненного цикла компонента
  --- - Trigger transitions
  +++ - Запускать анимации перехода

  Например:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  --- When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.
  +++ При изменении значения `text`, элемент `<span>` будет всегда заменяться, вместо обновления содержимого, поэтому будет запущена анимация перехода.

- **См. также:** [Руководство - Рендер списка - Сохранение состояния с помощью `key`](/guide/essentials/list.html#maintaining-state-with-key)

## ref

Denotes a [template ref](/guide/essentials/template-refs.html).

- **Ожидает:** `string | Function`

- **Подробности:**

  `ref` is used to register a reference to an element or a child component.

  In Options API, the reference will be registered under the component's `this.$refs` object:

  ```vue-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  In Composition API, the reference will be stored in a ref with matching name:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be the child component instance.

  Alternatively `ref` can accept a function value which provides full control over where to store the reference:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you must wait until the component is mounted before accessing them.

  `this.$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **См. также:** [Template Refs](/guide/essentials/template-refs.html)

## is

Used for binding [dynamic components](/guide/essentials/component-basics.html#dynamic-components).

- **Ожидает:** `string | Component`

- **Использование на нативных элементах** <sup class="vt-badge">3.1+</sup>

  When the `is` attribute is used on a native HTML element, it will be interpreted as a [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which is a native web platform feature.

  There is, however, a use case where you may need Vue to replace a native element with a Vue component, as explained in [DOM Template Parsing Caveats](/guide/essentials/component-basics.html#dom-template-parsing-caveats). You can prefix the value of the `is` attribute with `vue:` so that Vue will render the element as a Vue component instead:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **См. также:**

  - [Built-in Special Element - `<component>`](/api/built-in-special-elements.html#component)
  - [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)
