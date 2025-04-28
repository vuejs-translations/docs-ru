# Ссылки на элементы шаблона {#template-refs}

Хотя декларативная модель рендеринга Vue абстрагирует от большинства прямых операций с DOM, все же могут быть случаи, когда нужен прямой доступ к базовым элементам DOM. Для этого можно использовать специальный атрибут `ref`:

```vue-html
<input ref="input">
```

`ref` - специальный атрибут, аналогичный атрибуту `key`, о котором говорилось в главе `v-for`. Он позволяет получить прямую ссылку на определенный элемент DOM или экземпляр дочернего компонента после его монтирования. Это может быть полезно, когда нужно, например, программно выставить фокус на поле ввода при монтировании компонента или инициализировать стороннюю библиотеку на элементе.

## Доступ к ссылкам {#accessing-the-refs}

<div class="composition-api">

Чтобы получить ссылку с помощью Composition API, мы можем использовать [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" /> хэлпер.

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// первый аргумент должен совпадать с значением ref в шаблоне
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

При использовании Typescript, поддержка Vue IDE и `vue-tsc` автоматически определят тип `input.value`, основываясь для какого элемента или компонента используется соответствующий `ref` атрибут.

<details>
<summary>Использование до версии 3.5</summary>

В версиях до 3.5, где не был введен `useTemplateRef()`, нужно было объявлять `ref` c именем, соответствующим значению атрибута `ref`

```vue
<script setup>
import { ref, onMounted } from 'vue'

// объявляем ref-ссылку на элемент
// имя должно совпадать со значением ref в шаблоне
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Если не используется `<script setup>`, не забудьте также вернуть ссылку из `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

Полученная ссылка доступна через `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Обратите внимание, что вы можете получить доступ к ссылке только **после того, как компонент был смонтирован**. Если вы попытаетесь получить доступ к <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> в шаблоне, при первом рендеринге она будет равна <span class="options-api">`undefined`</span><span class="composition-api">`null`</span>. Это происходит потому, что элемент не существует до завершения первого рендеринга!

<div class="composition-api">

Если попытаться следить за изменениями ссылки на элемент шаблона, обязательно учитывать случай, когда ссылка имеет значение `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // еще не смонтирован, или элемент был демонтирован (например: v-if)
  }
})
```

См. также: [Типизированные ссылки на элементы шаблона](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Ref в компоненте {#ref-on-component}

> Этот раздел предполагает знание [Компонентов](/guide/essentials/component-basics). Не стесняйтесь пропустить его и вернуться позже.

`ref` можно также использовать для дочернего компонента. В этом случае ссылка будет принадлежать экземпляру компонента:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value будет содержать объект <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Использование до версии 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value будет содержать экземпляр <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child будет содержать экземпляр <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Если дочерний компонент использует Options API или не использует `<script setup>`, то экземпляр </span> <span class="options-api">Экземпляр</span> ссылки будет идентичен экземпляру дочернего компонента `this`, что означает, что родительский компонент будет иметь полный доступ к каждому свойству и методу дочернего компонента. Это позволяет легко создавать тесно связанные детали реализации между родительским и дочерним компонентами, поэтому ссылки на компонент следует использовать только в случае крайней необходимости - в большинстве случаев необходимо попытаться реализовать взаимодействие родителя и ребенка, используя стандартные интерфейсы props и emit.

<div class="composition-api">

Исключением здесь является то, что компоненты, использующие `<script setup>`, являются **приватными по умолчанию**: родительский компонент, ссылающийся на дочерний компонент, использующий `<script setup>`, не сможет получить доступ ни к чему, пока дочерний компонент не решит раскрыть публичный интерфейс с помощью макроса `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Макросы компилятора, такие как defineExpose, не нужно импортировать
defineExpose({
  a,
  b
})
</script>
```

Когда родитель получает экземпляр этого компонента через ссылки шаблона, полученный экземпляр будет иметь вид `{ a: number, b: number }` (ссылки автоматически разворачиваются, как и для обычных экземпляров).

Обратите внимание, что defineExpose должен вызываться перед любой операцией await. В противном случае свойства и методы, раскрытые после операции await, будут недоступны.

См. также: [Типизированные ссылки на шаблоны компонентов](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Опция `expose` может быть использована для ограничения доступа к дочернему экземпляру:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

В приведенном выше примере родитель, ссылающийся на этот компонент через ссылку, сможет получить доступ только к `publicData` и `publicMethod`.

</div>

## Refs inside `v-for` {#refs-inside-v-for}

> Requires v3.5 or above

<div class="composition-api">

When `ref` is used inside `v-for`, the corresponding ref should contain an Array value, which will be populated with the elements after mount:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Usage before 3.5</summary>

In versions before 3.5 where `useTemplateRef()` was not introduced, we need to declare a ref with a name that matches the template ref attribute's value. The ref should also contain an array value:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

When `ref` is used inside `v-for`, the resulting ref value will be an array containing the corresponding elements:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

It should be noted that the ref array does **not** guarantee the same order as the source array.

## Function Refs {#function-refs}

Instead of a string key, the `ref` attribute can also be bound to a function, which will be called on each component update and gives you full flexibility on where to store the element reference. The function receives the element reference as the first argument:

```vue-html
<input :ref="(el) => { /* assign el to a property or ref */ }">
```

Note we are using a dynamic `:ref` binding so we can pass it a function instead of a ref name string. When the element is unmounted, the argument will be `null`. You can, of course, use a method instead of an inline function.
