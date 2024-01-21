# Опции: Композиция {#options-composition}

## provide {#provide}

Предоставляет значения, которые могут быть внедрены компонентами-потомками.

- **Тип**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Подробности**

  `provide` и [`inject`](#inject) используются вместе для того, чтобы компонент-предок мог служить инжектором зависимостей для всех своих потомков, независимо от глубины иерархии компонентов, при условии, что они находятся в одной родительской цепочке.

  Опция `provide` должна быть либо объектом, либо функцией, возвращающей объект. Этот объект содержит свойства, доступные для внедрения в его потомков. В качестве ключей в этом объекте можно использовать Symbols.

- **Пример**

  Базовое использование:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Использование функции для предоставления состояния каждому компоненту:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Обратите внимание, что в приведенном примере предоставленное для внедрения свойство `msg` НЕ будет реактивным. Подробнее об этом см. в разделе [Работа с реактивностью](/guide/components/provide-inject#working-with-reactivity).

- **См. также** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Объявление свойств для внедрения в текущий компонент, которые описаны через provide в компонентах-предках.

- **Тип**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Подробности**

  Опция `inject` должна быть:

  - Массивом строк, или
  - Объект, ключами которого являются имена локальных свойств для привязки, а значениями:
    - Ключ (строка или символ) для поиска в доступных внедрениях, или
    - Обьектом, в котором:
      - Свойство `from` - это ключ (строка или символ) для поиска в доступных внедрениях, и
      - В качестве запасного значения используется свойство `default`. Аналогично значениям по умолчанию для входных параметров, для типов объектов необходима функцию-фабрику, чтобы избежать совместного использования значений несколькими экземплярами компонентов.

  Внедряемое свойство будет иметь значение `undefined`, если не было предоставлено для внедрения ни соответствующего свойства, ни значения по умолчанию.

  Обратите внимание, что внедряемые зависимости НЕ являются реактивными. Это сделано намеренно. Однако если внедряемое значение является реактивным объектом, то свойства этого объекта остаются реактивными. Подробнее об этом см. в разделе [Работа с реактивностью](/guide/components/provide-inject#working-with-reactivity).

- **Пример**

  Основное использование:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Использование внедренного значения в качестве значения по умолчанию для входного параметра:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Использование инжектированного значения в качестве свойства data:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Внедренные значения могут быть необязательными со значением по умолчанию:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Если его необходимо внедрить из свойства с другим именем, используйте `from` для обозначения свойства-источника:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Аналогично значению по умолчанию в входных параметрах, для непримитивных значений необходимо использовать функцию-фабрику:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **См. также** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Массив опций, которые будут подмешаны в текущий компонент.

- **Тип**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Подробности**

  Опция `mixins` принимает массив объектов примесей. Эти объекты примесей могут содержать опции экземпляра, как и обычные объекты экземпляра, и они будут объединены с конечными опциями, используя определенную логику объединения опций. Например, если ваш миксин содержит хук `created`, а сам компонент также имеет такой хук, то будут вызваны обе функции.

  Хуки миксинов вызываются в том порядке, в котором они были предоставлены, и вызываются перед собственными хуками компонента.

  :::warning Больше не рекомендуется
  Во Vue 2 миксины были основным механизмом для создания многократно используемых фрагментов логики компонентов. Хотя миксины продолжают поддерживаться в Vue 3, [Composition API](/guide/reusability/composables) теперь является предпочтительным подходом для повторного использования кода между компонентами.
  :::

- **Пример**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Расширение для компонента "базового класса".

- **Тип**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Подробности**

  Позволяет одному компоненту расширять другой, наследуя его опции.

  С точки зрения реализации, `extends` практически идентичен `mixins`. Компонент, указанный `extends`, будет рассматриваться так же, как если бы он был первым миксином.

  Однако `extends` и `mixins` выражают разные цели. Опция `mixins` используется в основном для компоновки функциональных блоков, в то время как `extends` в основном связана с наследованием.

  Как и в случае с `mixins`, любые варианты (кроме `setup()`) будут объединены с использованием соответствующей стратегии слияния.

- **Пример**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Not Recommended for Composition API
  `extends` is designed for Options API and does not handle the merging of the `setup()` hook.

  In Composition API, the preferred mental model for logic reuse is "compose" over "inheritance". If you have logic from a component that needs to be reused in another one, consider extracting the relevant logic into a [Composable](/guide/reusability/composables#composables).

  If you still intend to "extend" a component using Composition API, you can call the base component's `setup()` in the extending component's `setup()`:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // local bindings
      }
    }
  }
  ```
  :::
