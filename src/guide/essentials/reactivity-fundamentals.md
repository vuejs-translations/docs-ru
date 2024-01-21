---
outline: deep
---

# Основы реактивности {#reactivity-fundamentals}

:::tip Выбор API
Эта страница и многие другие главы в этом руководстве, содержат различный контент для Options API и Composition API. В настоящее время выбран <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Можно переключаться между двумя API с помощью переключателя "Выбрать API" в верхней части левой боковой панели.
:::

<div class="options-api">

## Объявление реактивного состояния {#declaring-reactive-state}

В Options API используется опция `data` для объявления реактивного состояния компонента. Значение опции должно быть функцией, которая возвращает объект. Vue будет вызывать функцию при создании нового экземпляра компонента и обернет возвращаемый объект в свою систему реактивности. Любые свойства верхнего уровня этого объекта проксируются на экземпляр компонента (`this` в методах и хуках жизненного цикла):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` это хук жизненного цикла Vue, который объясним позже
  mounted() {
    // `this` ссылается на экземпляр компонента
    console.log(this.count) // => 1

    // данные также могут быть мутированы
    this.count = 2
  }
}
```

[Попробовать в песочнице](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Эти свойства экземпляра добавляются только при первом создании экземпляра, поэтому необходимо убедиться, что все они присутствуют в объекте, возвращаемом функцией `data`. При необходимости используйте `null`, `undefined` или другое значение для свойств, где нужное значение еще недоступно.

Можно добавить новое свойство напрямую в `this`, не включая его в `data`. Однако свойства, добавленные таким образом, не будут реактивно обновляться.

Vue использует префикс `$`, когда предоставляет свои собственные встроенные API в экземпляре компонента. Vue также оставляет префикс `_` для внутренних свойств. Следует избегать использования имен для свойств верхнего уровня `data`, которые начинаются с любого из этих символов.

### Реактивный прокси и оригинальный объект \* {#reactive-proxy-vs-original}

В Vue 3 данные становятся реактивными благодаря использованию функционала [JavaScript Прокси](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Пользователи, перешедшие с Vue 2, должны знать о следующем поведении:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

При обращении к `this.someObject` после присвоения, значение является реактивным прокси, который оборачивает исходный `newObject`. **В отличие от Vue 2, исходный `newObject` остается нетронутым и не будет сделан реактивным: убедитесь, что всегда получаете доступ к реактивному состоянию как к свойству `this`.**.

</div>

<div class="composition-api">

## Declaring Reactive State \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

In Composition API, the recommended way to declare reactive state is using the [`ref()`](/api/reactivity-core#ref) function:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` takes the argument and returns it wrapped within a ref object with a `.value` property:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> См. также: [Типизированная реактивность](/guide/typescript/composition-api#typing-ref)) <sup class="vt-badge ts" />

Чтобы использовать реактивное состояние в шаблоне компонента, объявите и верните его из функции компонента `setup()`:

To access refs in a component's template, declare and return them from a component's `setup()` function:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` это специальный хук, предназначенный для Сomposition API.
  setup() {
    const count = ref(0)

    // передайте состояние шаблону
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Notice that we did **not** need to append `.value` when using the ref in the template. For convenience, refs are automatically unwrapped when used inside templates (with a few [caveats](#caveat-when-unwrapping-in-templates)).

You can also mutate a ref directly in event handlers:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

For more complex logic, we can declare functions that mutate refs in the same scope and expose them as methods alongside the state:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value is needed in JavaScript
      count.value++
    }

    // не забудьте также передать функцию.
    return {
      count,
      increment
    }
  }
}
```

Exposed methods can then be used as event handlers:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Here's the example live on [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), without using any build tools.

### `<script setup>` \*\* {#script-setup}

Manually exposing state and methods via `setup()` can be verbose. Luckily, it can be avoided when using [Single-File Components (SFCs)](/guide/scaling-up/sfc). We can simplify the usage with `<script setup>`:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Импорты верхнего уровня и переменные, объявленные в `<script setup>`, автоматически можно использовать в шаблоне того же компонента.

:::tip
For the rest of the guide, we will be primarily using SFC + `<script setup>` syntax for the Composition API code examples, as that is the most common usage for Vue developers.

If you are not using SFC, you can still use Composition API with the [`setup()`](/api/composition-api-setup) option.
:::

### Why Refs? \*\* {#why-refs}

You might be wondering why we need refs with the `.value` instead of plain variables. To explain that, we will need to briefly discuss how Vue's reactivity system works.

When you use a ref in a template, and change the ref's value later, Vue automatically detects the change and updates the DOM accordingly. This is made possible with a dependency-tracking based reactivity system. When a component is rendered for the first time, Vue **tracks** every ref that was used during the render. Later on, when a ref is mutated, it will **trigger** a re-render for components that are tracking it.

In standard JavaScript, there is no way to detect the access or mutation of plain variables. However, we can intercept the get and set operations of an object's properties using getter and setter methods.

The `.value` property gives Vue the opportunity to detect when a ref has been accessed or mutated. Under the hood, Vue performs the tracking in its getter, and performs triggering in its setter. Conceptually, you can think of a ref as an object that looks like this:

```js
// pseudo code, not actual implementation
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Another nice trait of refs is that unlike plain variables, you can pass refs into functions while retaining access to the latest value and the reactivity connection. This is particularly useful when refactoring complex logic into reusable code.

The reactivity system is discussed in more details in the [Reactivity in Depth](/guide/extras/reactivity-in-depth) section.
</div>

<div class="options-api">

## Объявление методов \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Free Vue.js Methods Lesson"/>

Для добавления методов к экземпляру компонента, используется опция `methods`. Это должен быть объект, содержащий нужные методы:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // методы могут быть вызваны из хуков жизненного цикла
    // или из других методов
    this.increment()
  }
}
```

Vue автоматически привязывает значение `this` для методов из объекта `methods` так, чтобы оно всегда ссылалось на экземпляр компонента. Это гарантирует, что метод сохраняет правильное значение `this`, если он используется в качестве слушателя событий или колбэк-функции. Следует избегать использования стрелочных функций при определении методов, поскольку это не позволит Vue привязать соответствующее значение `this`:

```js
export default {
  methods: {
    increment: () => {
      // ПЛОХО: доступа к `this` компонента не будет!
    }
  }
}
```

Как и все остальные свойства экземпляра компонента, методы из объекта `methods` доступны из шаблона компонента. Внутри шаблона они чаще всего используются в качестве слушателей событий:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

В примере выше, метод `increment` будет вызван при клике на `<button>`.

</div>

### Deep Reactivity {#deep-reactivity}

<div class="options-api">

В Vue состояние по умолчанию является глубоко реактивным. Это означает, что можно ожидать отслеживания изменений, даже если они затрагивают вложенные объекты или массивы:

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // будут работать так, как ожидается.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Refs can hold any value type, including deeply nested objects, arrays, or JavaScript built-in data structures like `Map`.

A ref will make its value deeply reactive. This means you can expect changes to be detected even when you mutate nested objects or arrays:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // these will work as expected.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Non-primitive values are turned into reactive proxies via [`reactive()`](#reactive), which is discussed below.

It is also possible to opt-out of deep reactivity with [shallow refs](/api/reactivity-advanced#shallowref). For shallow refs, only `.value` access is tracked for reactivity. Shallow refs can be used for optimizing performance by avoiding the observation cost of large objects, or in cases where the inner state is managed by an external library.

Further reading:

- [Reduce Reactivity Overhead for Large Immutable Structures](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integration with External State Systems](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM Update Timing {#dom-update-timing}

When you mutate reactive state, the DOM is updated automatically. However, it should be noted that the DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" in the update cycle to ensure that each component updates only once no matter how many state changes you have made.

To wait for the DOM update to complete after a state change, you can use the [nextTick()](/api/general#nexttick) global API:

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Now the DOM is updated
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // Now the DOM is updated
    }
  }
}
```

</div>

Также можно явно создать [неглубоко реактивные объекты](/api/reactivity-advanced#shallowreactive) где реактивность отслеживается только на корневом уровне, но они, как правило, нужны только в продвинутых случаях использования.

<div class="composition-api">

## `reactive()` \*\* {#reactive}

There is another way to declare reactive state, with the `reactive()` API. Unlike a ref which wraps the inner value in a special object, `reactive()` makes an object itself reactive:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> See also: [Typing Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Usage in template:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Reactive objects are [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and behave just like normal objects. The difference is that Vue is able to intercept the access and mutation of all properties of a reactive object for reactivity tracking and triggering.

`reactive()` converts the object deeply: nested objects are also wrapped with `reactive()` when accessed. It is also called by `ref()` internally when the ref value is an object. Similar to shallow refs, there is also the [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API for opting-out of deep reactivity.

### Reactive Proxy vs. Original \*\* {#reactive-proxy-vs-original-1}

Важно отметить, что возвращаемое значение от `reactive()` является [прокси](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) оригинального объекта, который не равен исходному объекту:

```js
const raw = {}
const proxy = reactive(raw)

// прокси НЕ РАВЕН оригиналу.
console.log(proxy === raw) // false
```

Только прокси является реактивным - изменение исходного объекта не вызовет обновлений. Поэтому лучшей практикой при работе с системой реактивности Vue является **исключительное использование проксированных версий состояния**.

Чтобы обеспечить последовательный доступ к прокси, вызов `reactive()` на одном и том же объекте будет всегда возвращать один и тот же прокси, а вызов `reactive()` на существующем прокси будет возвращать этот же прокси:

```js
// вызов reactive() на том же объекте, возвращает тот же прокси
console.log(reactive(raw) === proxy) // true

// вызов reactive() на прокси возвращает этот же прокси
console.log(reactive(proxy) === proxy) // true
```

Это правило распространяется и на вложенные объекты. Из-за глубокой реактивности, вложенные объекты внутри реактивного объекта также являются прокси:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Ограничения `reactive()` \*\* {#limitations-of-reactive}

API `reactive()` имеет два ограничения:

1. **Limited value types:** it only works for object types (objects, arrays, and [типы коллекций](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) such as `Map` and `Set`). It cannot hold [primitive types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) such as `string`, `number` or `boolean`.

2. **Cannot replace entire object:** since Vue's reactivity tracking works over property access, we must always keep the same reference to the reactive object. This means we can't easily "replace" a reactive object because the reactivity connection to the first reference is lost:

   ```js
   let state = reactive({ count: 0 })

   // вышеуказанная ссылка ({ count: 0 }) больше не отслеживается 
   // (реактивность потеряна!)
   state = reactive({ count: 1 })
   ```

3. **Not destructure-friendly:** when we destructure a reactive object's primitive type property into local variables, or when we pass that property into a function, we will lose the reactivity connection:

   ```js
   const state = reactive({ count: 0 })

   // count is disconnected from state.count when destructured.
   let { count } = state
   // не влияет на state.count
   count++

   // функция получает простое число и
   // не сможет отслеживать изменения в state.count
   // we have to pass the entire object in to retain reactivity
   callSomeFunction(state.count)
   ```

Due to these limitations, we recommend using `ref()` as the primary API for declaring reactive state.

## Additional Ref Unwrapping Details \*\* {#additional-ref-unwrapping-details}

### As Reactive Object Property \*\* {#ref-unwrapping-as-reactive-object-property}

A ref is automatically unwrapped when accessed or mutated as a property of a reactive object. In other words, it behaves like a normal property :

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Если новая ref-ссылка назначается свойству, связанному с существующей ref-ссылкой, она заменяет старую ref-ссылку:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// старая ref-ссылка теперь не влияет на state.count
console.log(count.value) // 1
```

Разворачивание ref-ссылки происходит только при вложении внутри глубокого реактивного объекта. Он не применяется, когда к нему обращаются как к свойству [неглубокого реактивного объекта](/api/reactivity-advanced#shallowreactive).

### Caveat in Arrays and Collections \*\* {#caveat-in-arrays-and-collections}

В отличие от реактивных объектов, **не** происходит разворачивания, когда ref-ссылка доступна как элемент реактивного массива или нативной коллекции, например `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// нужно обращаться к .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// нужно обращаться к .value
console.log(map.get('count').value)
```

### Caveat when Unwrapping in Templates \*\* {#caveat-when-unwrapping-in-templates}

Ref unwrapping in templates only applies if the ref is a top-level property in the template render context.

In the example below, `count` and `object` are top-level properties, but `object.id` is not:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Therefore, this expression works as expected:

```vue-html
{{ count + 1 }}
```

...while this one does **NOT**:

```vue-html
{{ object.id + 1 }}
```

The rendered result will be `[object Object]1` because `object.id` is not unwrapped when evaluating the expression and remains a ref object. To fix this, we can destructure `id` into a top-level property:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Now the render result will be `2`.

Another thing to note is that a ref does get unwrapped if it is the final evaluated value of a text interpolation (i.e. a <code v-pre>{{ }}</code> tag), so the following will render `1`:

```vue-html
{{ object.id }}
```

This is just a convenience feature of text interpolation and is equivalent to <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Методы с сохранением состояния \* {#stateful-methods}

В некоторых случаях может потребоваться динамически создать метод, например, создать обработчик отложенного события:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // декорирование при помощи debounce
    click: debounce(function () {
      // ... реагировать на нажатие ...
    }, 500)
  }
}
```

Однако такой подход проблематичен для компонентов, которые используются повторно, поскольку функция debounce **сохраняет некоторое внутреннее состояние** о прошедшем времени. Если несколько экземпляров компонента используют одну и ту же функцию, которая была декорирована при помощи функции debounce, то они будут мешать друг другу.

Чтобы исправить проблему описанную выше, можно использовать функцию debounce в хуке жизненного цикла `created`:

```js
export default {
  created() {
    // каждый экземпляр теперь имеет свою собственную копию
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // также хорошая идея отменять таймер
    // когда компонент удаляется
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... реагировать на нажатие ...
    }
  }
}
```

</div>
