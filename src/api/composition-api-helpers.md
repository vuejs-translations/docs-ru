# Composition API: Хэлперы {#composition-api-helpers}

## useAttrs() {#useattrs}

Возвращает из [Setup контекста](/api/composition-api-setup#setup-context) объект `attrs`, который включает в себя [обычные атрибуты](/guide/components/attrs#fallthrough-attributes) переданные текущему компоненту. Это предназначено для использования в `<script setup>`, где объект Setup контекст недоступен.

- **Тип**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Возвращает из [Setup контекста](/api/composition-api-setup#setup-context) объект `slots`, включаещий переданные родителю слоты в виде вызываемых функции, возвращающих виртуальные узлы DOM. Это предназначено для использования в `<script setup>`, где объект Setup контекст недоступен.

При использовании TypeScript, вместо этого следует использовать [`defineSlots()`](/api/sfc-script-setup#defineslots).

- **Тип**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

Это базовый хэлпер, который обеспечивает работу [`defineModel()`](/api/sfc-script-setup#definemodel). Если вы используете `<script setup>`, вместо него следует предпочесть `defineModel()`.

- Доступно только в версиях 3.4+

- **Тип**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Пример**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Подробности**

  `useModel()` может использоваться в компонентах, не относящихся к SFC, например, при использовании необработанной функции `setup()`. В качестве первого аргумента она принимает объект `props`, а в качестве второго - имя модели. Необязательный третий аргумент может быть использован для объявления пользовательских геттеров и сеттеров для получившейся ref модели. Обратите внимание, что в отличие от `defineModel()`, вы сами должны объявить входные параметры(`props`) и эмиттеры.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Возвращает неглубокую ref ссылку, значение которой будет синхронизировано с  `<template>` элементом или компонентом с соответствующим атрибутом ref.

- **Тип**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Пример**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **См. также**
  - [Руководство - Ссылки на элементы шаблона](/guide/essentials/template-refs)
  - [Руководство - Типизация ссылок на шаблоны](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Руководство - Типизация ссылок на шаблоны компонентов](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Используется для генерации уникальных для каждого приложения идентификаторов для атрибутов доступности или элементов формы.

- **Тип**

  ```ts
  function useId(): string
  ```

- **Пример**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Подробности**

  Идентификаторы, генерируемые с помощью `useId()`, уникальны для каждого приложения. Этот хэлпер можно использовать для генерации идентификаторов для элементов формы и атрибутов доступности. Несколько вызовов в одном и том же компоненте будут генерировать разные идентификаторы, несколько экземпляров одного и того же компонента, вызывающих `useId()`, также будут иметь разные идентификаторы.

  Идентификаторы, сгенерированные с помощью `useId()`, также гарантированно стабильны и для серверного и для клиентского рендеринга, поэтому их использование в SSR приложениях не приведёт к несоответствию гидратации.

  Если у вас есть несколько экземпляров Vue-приложения для одной и той же страницы, вы можете избежать конфликтов идентификаторов, задав каждому приложению свой ID-префикс через [`app.config.idPrefix`](/api/application#app-config-idprefix).
