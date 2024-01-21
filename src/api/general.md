# Глобальное API: Основное {#global-api-general}

## version {#version}

Возвращает текущую версию Vue.

- **Тип** `string`

- **Пример**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Утилита для ожидания следующего обновления DOM.

- **Тип**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Подробности**

  Когда вы изменяете реактивное состояние в Vue, обновления DOM не применяются синхронно. Вместо этого Vue буферизирует их до "следующего тика", чтобы гарантировать, что каждый компонент обновляется только один раз, независимо от того, сколько изменений состояния было сделано.

  `nextTick()` можно использовать сразу после изменения состояния, чтобы дождаться завершения обновления DOM. В качестве аргумента можно передать коллбэк или дождаться разрешения возвращаемого Promise.

- **Пример**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM еще не обновлен
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM обновился
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM еще не обновлен
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM обновился
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **См. также** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Утилита для типизации определения компонента Vue

- **Тип**

  ```ts
  // options syntax
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // function syntax (requires 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Тип упрощен для удобства чтения

- **Подробности**

  Первый аргумент ожидает объект параметров компонента. Возвращаемым значением будет тот же объект параметров, поскольку функция, по сути, является "пустышкой" во время выполнения и нужна только для определения типа.

  Обратите внимание, что тип возвращаемого значения немного особенный: это будет тип конструктора, тип экземпляра которого является выведенным типом экземпляра компонента на основе параметров. Это используется для определения типа, когда возвращаемый тип используется в качестве тега в TSX.

  Тип экземпляра компонента (эквивалентный типу `this` в его опциях) можно извлечь из возвращаемого типа `defineComponent()` следующим образом:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Function Signature <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` также имеет альтернативный синтаксис, для совместного использования Composition API и [рендер-функций или JSX](/guide/extras/render-function).

  Вместо объекта с опциями первым аргументом `defineComponent()` может принимать функцию. Эта функция выполняется точно так же, как и [`setup()`](/api/composition-api-setup#composition-api-setup) из Composition API, принимая props и context в качестве аргументов. Ожидается, что эта функция вернёт JSX или рендер-функцию с `h()` - оба варианта поддерживаются:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // код как в <script setup> Composition API
      const count = ref(0)

      return () => {
        // рендер-функция или JSX
        return h('div', count.value)
      }
    },
    // дополнительные параметры, например, описание входных данных и emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  Такой синтаксис удобен для написания компонентов с иcпользованием TypeScript (в частности с TSX), так как в нём можно использовать generic-типы:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // код как в <script setup> Composition API
      const count = ref(0)

      return () => {
        // рендер-функция или JSX
        return <div>{count.value}</div>
      }
    },
    // Описание входных данных в runtime всё ещё необходимо
    {
      props: ['msg', 'list']
    }
  )
  ```

  В будущем мы планируем добавить Babel-плагин, который автоматически внедрит описанные входные данные (как это делает `defineProps` in SFC-компонентах). Таким образом, описание входных данных можно будет опустить.

  ### Использование с webpack {#note-on-webpack-treeshaking}

  Поскольку `defineComponent()` является вызовом функции, это может выглядеть так, что вызовет побочные эффекты (на англ. side-effects) для некоторых инструментов сборки, например, webpack. Это позволит предотвратить встряхивание дерева (на англ. tree-shaking) компонента, даже если он никогда не используется.

  Чтобы сообщить webpack о том, что данный вызов функции безопасен для встряхивания дерева (на англ. tree-shaking), можно добавить специальный комментарий `/_#**PURE**_/` перед вызовом функции:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Обратите внимание, что это не требуется при использовании Vite, поскольку Rollup (базовый пакетный модуль, используемый Vite) достаточно умен, чтобы определить, что `defineComponent()` действительно не имеет побочных эффектов, без необходимости ручной аннотации.

- **См. также** [Руководство - Использование Vue с TypeScript](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Определяет асинхронный компонент, который отложенно загружается только во время отрисовки. Аргумент может быть либо функцией загрузчика, либо объектом параметров для более расширенного управления поведением загрузки.

- **Тип**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **См. также** [Руководство - Асинхронные компоненты](/guide/components/async)

## defineCustomElement() {#definecustomelement}

Этот метод принимает тот же аргумент, что и [`defineComponent`](#definecomponent), но вместо него возвращает нативный [Пользовательский элемент](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Тип**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Тип упрощен для удобства чтения.

- **Подробности**

  Помимо обычных параметров компонента, `defineCustomElement()` также поддерживает специальную опцию `styles`, которая должна быть массивом инлайновых CSS строк, для определения CSS, который следует вставить в теневой корень элемента.

  Возвращаемое значение - конструктор пользовательского элемента, который может быть зарегистрирован с помощью [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Пример**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* опции компонента */
  })

  // Регистрация пользовательского элемента
  customElements.define('my-vue-element', MyVueElement)
  ```

- **См. также**

  - [Руководство - Создание пользовательских элементов с помощью Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Также обратите внимание, что `defineCustomElement()` требует [специальной настройки](/guide/extras/web-components#sfc-as-custom-element) при использовании с однофайловыми компонентами (SFC).
