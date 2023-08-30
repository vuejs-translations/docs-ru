# Composition API: setup() {#composition-api-setup}

:::info Примечание
Эта страница описывает использование опции компонента `setup`. При использовании Composition API с однофайловыми компонентами рекомендуется использовать [`<script setup>`](/api/sfc-script-setup.html), который отличается более лаконичным и эргономичным синтаксисом.
:::

Хук `setup()` служит точкой входа для использования Composition API в компонентах в следующих случаях:

1. Использование Composition API без шага сборки;
2. Интеграция с кодом на основе Composition API в компоненте с синтаксисом Options API.

## Базовое использование {#basic-usage}

Мы можем объявить реактивное состояние с помощью [Reactivity APIs](./reactivity-core.html) и передать его шаблону, вернув объект из `setup()`. Свойства возвращаемого объекта также будут доступны для экземпляра компонента (если используются другие опции):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // сделать доступным для шаблонов и других хуков options API
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core.html#ref), возвращаемые из `setup`, [автоматически "разворачиваются"](/guide/essentials/reactivity-fundamentals.html#deep-reactivity) при обращении к ним в шаблоне, поэтому при обращении к ним не нужно использовать `.value`. Аналогичным образом они "разворачиваются" при обращении к `this`.

Сама функция `setup()` не имеет доступа к экземпляру компонента - `this` будет иметь значение `undefined` внутри `setup()`. Вы можете получить доступ к значениям, предоставленным Composition API, из Options API, но не наоборот.

`setup()` должен возвращать объект _синхронно_. Единственный случай, когда можно использовать `async setup()`, это когда компонент является потомком компонента [Suspense](../guide/built-ins/suspense.html).

## Доступ к входным параметрам {#accessing-props}

Первым аргументом функции `setup` является `props`. Как и полагается в стандартном компоненте, `props` внутри функции `setup` являются реактивными и будут обновляться при передаче новых входных параметров.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Обратите внимание, что при деструктуризации объекта `props` деструктурированные переменные теряют реактивность. Поэтому рекомендуется всегда обращаться к входным параметрам через `props.xxx`.

Если вам действительно необходимо деструктурировать входные параметры или передать их во внешнюю функцию, сохранив при этом реактивность, вы можете сделать это с помощью утилит [toRefs()](./reactivity-utilities.html#torefs) и [toRef()](/api/reactivity-utilities.html#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // преобразовать `props` в объект refs, затем деструктурировать
    const { title } = toRefs(props)
    // `title` - это ссылка, которая отслеживает `props.title`.
    console.log(title.value)

    // ИЛИ, преобразовать единственное свойство `props` в ref
    const title = toRef(props, 'title')
  }
}
```

## Setup контекст {#setup-context}

Вторым аргументом функции `setup`, является объект **Setup контекст**. Объект контекста предоставляет другие значения, которые могут быть полезны внутри `setup`:

```js
export default {
  setup(props, context) {
    // Атрибуты (нереактивный объект, эквивалентный $attrs)
    console.log(context.attrs)

    // Слоты (нереактивный объект, эквивалентный $slots)
    console.log(context.slots)

    // Генерация события (Функция, эквивалентная $emit)
    console.log(context.emit)

    // Предоставить публичные свойства (функция)
    console.log(context.expose)
  }
}
```

Объект контекста не является реактивным и может быть безопасно деструктурирован:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` и `slots` - это объекты с состоянием, которое всегда обновляется при обновлении самого компонента. Это означает, что следует избегать их деструктуризации и всегда ссылаться на свойства через `attrs.x` или `slots.x`. Также следует отметить, что, в отличие от `props`, свойства `attrs` и `slots` не являются **не** реактивными. Если вы собираетесь применять побочные эффекты (англ. side effects), основанные на изменениях `attrs` или `slots`, то это следует делать внутри хука жизненного цикла `onBeforeUpdate`.

### Предоставление публичных свойства {#exposing-public-properties}

`expose` - это функция, которая может быть использована для явного ограничения свойств, доступ к которым можно получить из родительского компонента через [ссылки на компоненты (ref)](/guide/essentials/template-refs.html#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // сделать экземпляр "закрытым".
    // т.е. не предоставлять ничего родительскому компоненту
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // выборочно предоставить локальное состояние
    expose({ count: publicCount })
  }
}
```

## Использование с Render-функциями {#usage-with-render-functions}

`setup` также может возвращать [render-функцию](/guide/extras/render-function.html), которая может напрямую использовать реактивное состояние, объявленное в той же области видимости:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Возврат render-функции не позволяет нам вернуть что-либо еще. Внутренне это не должно вызывать проблем, но это может быть проблематично, если мы хотим передать методы этого компонента родительскому компоненту через ссылки на шаблоны (ref).

Решить эту проблему можно, вызвав [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

В этому случае метод `increment` будет доступен в родительском компоненте через ссылку на шаблон (ref).
