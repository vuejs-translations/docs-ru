# v-model {#component-v-model}

## Базовое использование {#basic-usage}

`v-model` можно использовать в компоненте для реализации двустороннего связывания.

<div class="composition-api">

Начиная с Vue 3.4, для достижения этих целей рекомендуется использовать макрос [`defineModel()`](/api/sfc-script-setup#definemodel):

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Родительский связанный v-model - это: {{ model }}</div>
  <button @click="update">Увеличение</button>
</template>
```

Далее родитель может связать значение с помощью `v-model`:

```vue-html
<!-- Parent.vue -->
<Child v-model="countModel" />
```

Значение, возвращаемое функцией `defineModel()`, представляет собой `ref`. К ней можно получить доступ и изменить так же, как и любую другую `ref`, за исключением того, что она действует как двустороннее связывание между родительским значением и локальным значением:

- Значение `.value` синхронизировано со значением, связанным с родительским `v-model`;
- Когда оно изменяется дочерним элементом, это приводит к обновлению значения, связанного с родителем.

Это означает, что вы также можете связать этот `ref` к нативному полю ввода с помощью `v-model`, что делает оборачивание элементов ввода простым и обеспечивает аналогичное использование `v-model`:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### Под капотом {#under-the-hood}

`defineModel` - это удобный макрос. Компилятор раскрывает его в следующее:

- Свойство с именем `modelValue`, значение которого синхронизировано со значением локальной `ref`;
- Событие с именем `update:modelValue`, которое возникает при изменении значения локальной `ref`.

Вот как вы бы реализовали тот же дочерний компонент, который был показан выше до версии 3.4:

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

Затем `v-model="foo"` в родительском компоненте будет скомпилирован в:

```vue-html
<!-- Parent.vue -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

Как вы можете видеть, это требует чуть больше кода. Тем не менее полезно знать, что происходит под капотом.

Поскольку `defineModel` объявляет входные параметры, вы можете также объявить входные параметры основного свойства, передав его в `defineModel`:

```js
// делает v-model обязательным
const model = defineModel({ required: true })

// установка значения по умолчанию
const model = defineModel({ default: 0 })
```

:::warning Предупреждение
Если у вас есть значение `default` для свойства `defineModel`, и вы не предоставляете никакого значения для этого свойства из родительского компонента, это может привести к рассинхронизации между родительским и дочерним компонентами. В приведенном ниже примере родительский `myRef` не определен, а дочерний `model` равен 1:

```js
// дочерний компонент:
const model = defineModel({ default: 1 })

// родительский компонент:
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

</div>

<div class="options-api">

Давайте сначала рассмотрим, как `v-model` используется в нативном элементе:

```vue-html
<input v-model="searchText" />
```
Под капотом компилятор шаблонов расширяет `v-model` до более подробного эквивалента для нас. Таким образом, приведенный выше код выполняет то же самое, что и следующий:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

При использовании на компоненте `v-model` расширяется до следующего:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

Для того чтобы это действительно работало, компонент `<CustomInput>` должен выполнить две вещи:

1. Привязать атрибут `value` элемента `<input>` к свойству `modelValue`
2. При срабатывании события `input` элемента `<input>` генерировать событие `update:modelValue` с новым значением

Вот это в действии:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Теперь `v-model` должен отлично работать с этим компонентом:

```vue-html
<CustomInput v-model="searchText" />
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

Другой способ реализации `v-model` в этом компоненте - использовать вычисляемое свойство `computed` с геттером и сеттером. Метод `get` должен возвращать свойство `modelValue`, а метод `set` должен вызывать соответствующее событие:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## Аргументы `v-model` {#v-model-arguments}

`v-model` может принимать аргумент:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

В дочернем компоненте мы можем поддерживать соответствующий аргумент, передав строку в `defineModel()` в качестве его первого аргумента:

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFU9tu2zAM/RVBKOAWyGIM25PhFbugDxuwC7a+VX3wEiZ1K0uCRHkuDP/7SKlxk16BILbIQ/KcQ3mUn5xb9hFkJeuw8q3DU2XazlmP4vvtF0tvBgyKjbedKJblXozLCmWUgSHB17BpokYxKiPEaocKlRgPOk0Lzq8bbI5PMlYIDxi92Z2E+GvtzXmLGipR9G86uwYtGr+NHTeAoemc5tEMnfhBf/Sry1kBHRAI1SDQSYj66u3pON73FdNUlxRLuX12d9MqZNQHJecKJUVJ8Lqc+8qFfODGgYlPueK8dWTIRZHaF5fJCuhadumiiI5cgTy6uHxVUmtcxGwC3jomizCgkjlU9Y2OKZjZ5+jHVETRI556fDhyIY6gZylIXgMp4g4nufSxdgwrazbtdnkdrCHlSaCSvPhWg//psLUmKEn7z7OVbLS2/76lGPoISX2quYLVzRPx6zBwTMlfHgL4nmTMucwxp8/+/EjK5yTtMLLoF5K/IVgdmWOGfY5mTbT3cInt1/QptGZ7Hs4GBBN2ophounoJryStn+/Cc9Lv6b5bvt9dWTn9B6F1Lrs=)

Если необходимо передать входные параметры, то их следует передавать после имени модели:

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>Использование до версии 3.4</summary>

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

В этом случае, вместо стандартного свойства `modelValue` и события `update:modelValue`, дочерний компонент должен ожидать свойство `title` и генерировать событие `update:title` для обновления значения в родительском компоненте:

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## Множественные привязки `v-model` {#multiple-v-model-bindings}

Используя возможность указывать конкретное свойство и событие, как мы узнали ранее с [аргументами `v-model`](#v-model-arguments), теперь мы можем создать несколько `v-model` на одном экземпляре компонента.

Каждый `v-model` будет синхронизироваться с разным свойством, без необходимости в дополнительных параметрах в компоненте:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>Использование до версии 3.4</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## Работа с модификаторами `v-model` {#handling-v-model-modifiers}

Когда мы изучали привязки ввода формы, мы видели, что `v-model` имеет [встроенные модификаторы](/guide/essentials/forms#modifiers) - `.trim`, `.number` и `.lazy`. В некоторых случаях вам также может потребоваться, чтобы `v-model` в вашем компоненте ввода поддерживал пользовательские модификаторы.

Давайте создадим пример пользовательского модификатора `capitalize`, который преобразует в верхний регистр первую букву строки, предоставленной привязкой `v-model`:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

Модификаторы, добавленные в компонент `v-model`, могут быть доступны в дочернем компоненте с помощью деструктуризации возвращаемого значения `defineModel()` следующим образом:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

Чтобы условно настроить чтение / запись значения на основе модификаторов, мы можем передать опции `get` и `set` в `defineModel()`. Эти две опции получают значение при получении / установке `ref` на модель и должны возвращать преобразованное значение. Вот как мы можем использовать `set` для реализации модификатора `capitalize`:

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

<details>
<summary>Использование до версии 3.4</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

Модификаторы, добавленные в компонент `v-model`, будут предоставляться компоненту через свойство `modelModifiers`. В приведенном ниже примере мы создали компонент, содержащий свойство `modelModifiers`, которое по умолчанию содержит пустой объект:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Обратите внимание, что свойство компонента `modelModifiers` содержит `capitalize` и его значение - `true`, потому что оно установлено в связке `v-model` как `v-model.capitalize="myText"`.

Теперь, когда у нас есть настроенное свойство, мы можем проверить ключи объекта `modelModifiers` и написать обработчик для изменения переданного значения. В следующем коде мы преобразуем строку в верхний регистр при каждом срабатывании события `input` элемента `<input />`:

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### Модификаторы с аргументами для `v-model` {#modifiers-for-v-model-with-arguments}

<div class="options-api">

Для привязок `v-model` с аргументами и модификаторами, сгенерированное имя входного параметра будет `arg + "Modifiers"`. Например:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

Соответствующие объявления должны быть следующими:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

Вот еще один пример использования модификаторов с несколькими `v-model` и с разными аргументами:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

<details>
<summary>Использование до версии 3.4</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true }
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true }
  }
}
</script>
```

</div>
