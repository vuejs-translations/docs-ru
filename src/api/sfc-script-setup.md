# \<script setup> {#script-setup}

`<script setup>` - это синтаксический сахар, обрабатываемый на этапе компиляции, для использования Composition API внутри однофайловых компонентов (SFC). Это рекомендуемый синтаксис при использовании однофайловых компонентов и Composition API. Он предоставляет ряд преимуществ по сравнению с обычным синтаксисом `<script>`:

- Более лаконичный код с меньшим количеством boilerplate-кода.
- Возможность объявлять входные параметры и генерируемые события с использованием чистого TypeScript.
- Лучшая производительность во время выполнения (шаблон компилируется в render-функцию в той же области видимости, без промежуточной прокси).
- Лучшая производительность IDE при определении типов (меньше работы для языкового сервера по извлечению типов из кода).

## Базовый синтаксис {#basic-syntax}

Чтобы использовать синтаксис, добавьте атрибут `setup` в секцию `<script>`:

```vue
<script setup>
console.log('привет script setup')
</script>
```

Код внутри компилируется как содержимое функции компонента `setup()`. Это означает, что в отличие от обычного `<script>`, который выполняется только один раз при первом импорте компонента, код внутри `<script setup>` будет **выполняться каждый раз при создании экземпляра компонента**.

### Привязки верхнего уровня будут доступны в шаблоне {#top-level-bindings-are-exposed-to-template}

При использовании `<script setup>` все привязки верхнего уровня (включая переменные, объявления функций и импорт), объявленные внутри `<script setup>`, будут доступны напрямую в шаблоне:

```vue
<script setup>
// переменная
const msg = 'Hello!'

// функция
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Импортированные функции раскрываются аналогичным образом. Это означает, что можно напрямую использовать импортированную вспомогательную функцию в выражениях шаблона, без необходимости объявлять её через опцию `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Реактивность {#reactivity}

Реактивное состояние должно быть явно создано с помощью [API реактивности](./reactivity-core). Аналогично значениям, возвращаемым функцией `setup()`, ref автоматически разворачиваются при обращении к ним в шаблонах:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Использование компонентов {#using-components}

Значения в области видимости `<script setup>` также могут быть использованы непосредственно в качестве имён тегов пользовательских компонентов:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Считайте, что на `MyComponent` ссылаются как на переменную. Если вы использовали JSX, то ментальная модель здесь аналогична. Эквивалент kebab-case `<my-component>` работает и в шаблоне — однако для согласованности настоятельно рекомендуется использовать теги компонентов в PascalCase. Это также помогает отличить их от нативных пользовательских элементов.

### Динамические компоненты {#dynamic-components}

Поскольку на компоненты ссылаются на переменные, а не регистрируют их под строковыми ключами, то при использовании динамических компонентов внутри `<script setup>` следует использовать динамическую привязку с помощью `:is`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Обратите внимание, как компоненты могут использоваться в качестве переменных в тернарном выражении.

### Рекурсивные компоненты {#recursive-components}

Однофайловые компоненты могут неявно ссылаться сами на себя с помощью имени файла. Например, файл с именем `FooBar.vue` может ссылаться на себя как `<FooBar/>` в своём шаблоне.

Обратите внимание, что это имеет более низкий приоритет, чем у импортированных компонентов. Если есть именованный импорт, который конфликтует с предполагаемым именем компонента от имени файла, то можно задать псевдоним для импортируемого:

```js
import { FooBar as FooBarChild } from './components'
```

### Компоненты с пространством имён {#namespaced-components}

Можно использовать теги компонентов с точками, например `<Foo.Bar>`, чтобы ссылаться на компоненты, вложенные в свойства объекта. Это полезно при импорте нескольких компонентов из одного файла:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Использование пользовательских директив {#using-custom-directives}

Пользовательские директивы, зарегистрированные глобально, работают как обычно. Локальные пользовательские директивы не нуждаются в явной регистрации в `<script setup>`, но они должны следовать схеме именования `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // сделать что-нибудь с элементом
  }
}
</script>
<template>
  <h1 v-my-directive>Какой-то заголовок</h1>
</template>
```

Если вы импортируете директиву из другого места, она может быть переименована в соответствии с требуемой схемой именования:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() и defineEmits() {#defineprops-defineemits}

Чтобы объявить `props` и `emits` с полной поддержкой вывода типов можно использовать API `defineProps` и `defineEmits`, которые автоматически доступны внутри `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// код setup
</script>
```

- `defineProps` и `defineEmits` - **макросы компилятора**, используемые только внутри `<script setup>`. Их не нужно импортировать и они будут компилироваться при обработке `<script setup>`.

- `defineProps` принимает то же значение, что и опция `props`, а `defineEmits` принимает то же значение, что и опция `emits`.

- `defineProps` и `defineEmits` предоставляют правильный вывод типов на основе переданных опций.

- Опции, передаваемые в `defineProps` и `defineEmits`, будут подняты из setup в область видимости модуля. Поэтому опции не могут ссылаться на локальные переменные, объявленные в области видимости setup. Это приведет к ошибке компиляции. Однако они _могут_ ссылаться на импортированные привязки, поскольку они также находятся в области видимости модуля.

### Объявление входных параметров/пользовательских событий только при помощи типов<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Входные параметры и пользовательские события также можно объявить, используя только типы, передав литерал типа как аргумент в `defineProps` или `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: альтернатива, более лаконичный синтаксис
const emit = defineEmits<{
  change: [id: number] // синтаксис именованных кортежей
  update: [value: string]
}>()
```

- `defineProps` или `defineEmits` могут использовать либо объявление только при помощи типов, либо объявление во время исполнения кода. Использование двух типов объявления вместе приведёт к ошибке компиляции.

- При использовании объявления при помощи типов эквивалентное объявление во время исполнения кода автоматические генерируется на основе статического анализа, что устраняет необходимость в двойном объявлении и обеспечивает корректное поведение во время выполнения кода. 

  - В режиме разработки компилятор попытается вывести из типов соответствующую проверку во время выполнения. Например здесь `foo: String` выведится из `foo: string` типа. Если тип является ссылкой на импортированный тип, то выведенный результат будет равен `foo: null` (эквивалентно типу `any`), так как комплиятор ничего не знает о внешних файлах. 

  - В продакшене компилятор сгенерирует массив объявлений, дабы сократить размер итогового бандла (входные параметры в примере выше превратятся в `['foo', 'bar']`).

- В версии 3.2 и ниже дженерик для `defineProps()` был ограничен литератом типа или ссылкой на локальный интерфейс.

  Это ограничение было снято в версии 3.3. Последняя версия Vue поддерживает возможность ссылки на импортированные и ограниченный набор сложных типов в месте для использования типа. Однако, так как преобразование типов во время выполнения все еще основано на AST, некоторые сложные типы, требующие фактического анализа, например, условные типы, не поддерживаются. Вы можете использовать условные типы для типизации одного входного параметра, но не для цельного объекта входных параметров.  

### Значения по умолчанию во входных параметрах при объявлении с помощью типов {#default-props-values-when-using-type-declaration}

Один недостаток объявления `defineProps` только при помощи типов - нет возможности задать значениям по умолчанию для входных параметров. Чтобы решить эту проблему, предоставляется макрос компилятора `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Это объявление будет преобразовано в эквивалентный аналог `default` как при объявлении входных параметров во время выполнения кода. Кроме того, макрос `withDefaults` предоставляет проверку типа для значений по умолчанию и гарантирует, что в возвращаемом типе `props` будут удалены флаги необязательных свойств (?) для свойств, у которых объявлены значения по умолчанию.

## defineModel() <sup class="vt-badge" data-text="3.4+" /> {#definemodel}

This macro can be used to declare a two-way binding prop that can be consumed via `v-model` from the parent component. Example usage is also discussed in the [Component `v-model`](/guide/components/v-model) guide.

Under the hood, this macro declares a model prop and a corresponding value update event. If the first argument is a literal string, it will be used as the prop name; Otherwise the prop name will default to `"modelValue"`. In both cases, you can also pass an additional object which can include the prop's options and the model ref's value transform options.

```js
// declares "modelValue" prop, consumed by parent via v-model
const model = defineModel()
// OR: declares "modelValue" prop with options
const model = defineModel({ type: String })

// emits "update:modelValue" when mutated
model.value = 'hello'

// declares "count" prop, consumed by parent via v-model:count
const count = defineModel('count')
// OR: declares "count" prop with options
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // emits "update:count" when mutated
  count.value++
}
```

### Modifiers and Transformers {#modifiers-and-transformers}

To access modifiers used with the `v-model` directive, we can destructure the return value of `defineModel()` like this:

```js
const [modelValue, modelModifiers] = defineModel()

// corresponds to v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

When a modifier is present, we likely need to transform the value when reading or syncing it back to the parent. We can achieve this by using the `get` and `set` transformer options:

```js
const [modelValue, modelModifiers] = defineModel({
  // get() omitted as it is not needed here
  set(value) {
    // if the .trim modifier is used, return trimmed value
    if (modelModifiers.trim) {
      return value.trim()
    }
    // otherwise, return the value as-is
    return value
  }
})
```

### Usage with TypeScript <sup class="vt-badge ts" /> {#usage-with-typescript}

Like `defineProps` and `defineEmits`, `defineModel` can also receive type arguments to specify the types of the model value and the modifiers:

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// default model with options, required removes possible undefined values
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

Компоненты, использующие `<script setup>`, **по умолчанию закрытые** - т.е. публичный экземпляр компонента, получаемый через ссылку в шаблоне или цепочки `$parent`, **не** объявляет доступа к каким-либо привязкам внутри `<script setup>`.

Для явного объявления свойств в компоненте `<script setup>` используйте макрос компилятора `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Когда родитель получает экземпляр этого компонента через ссылку в шаблоне, полученный экземпляр будет иметь вид `{ a: number, b: number }` (ref-ссылки автоматически разворачиваются, как и для обычных экземпляров).

## defineOptions() <sup class="vt-badge" data-text="3.3+" /> {#defineoptions}

This macro can be used to declare component options directly inside `<script setup>` without having to use a separate `<script>` block:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Only supported in 3.3+.
- This is a macro. The options will be hoisted to module scope and cannot access local variables in `<script setup>` that are not literal constants.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

This macro can be used to provide type hints to IDEs for slot name and props type checking.

`defineSlots()` only accepts a type parameter and no runtime arguments. The type parameter should be a type literal where the property key is the slot name, and the value type is the slot function. The first argument of the function is the props the slot expects to receive, and its type will be used for slot props in the template. The return type is currently ignored and can be `any`, but we may leverage it for slot content checking in the future.

It also returns the `slots` object, which is equivalent to the `slots` object exposed on the setup context or returned by `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

- Only supported in 3.3+.

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

Использование `slots` и `attrs` внутри `<script setup>` должно встречаться крайне редко, поскольку в шаблоне прямой доступ к ним можно получить через `$slots` и `$attrs`. В редких случаях, когда они всё же нужны, используйте вспомогательные методы `useSlots` и `useAttrs` соответственно:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` и `useAttrs` - это runtime-функции, которые возвращают эквивалент `setupContext.slots` и `setupContext.attrs`. Они могут использоваться и в обычных функциях composition API.

## Использование вместе с обычной секцией `<script>` {#usage-alongside-normal-script}

`<script setup>` может использоваться вместе с обычной секцией `<script>`. Обычный `<script>` может понадобиться в случаях, когда необходимо:

- бъявление опций, которые не могут быть выражены в `<script setup>`, например `inheritAttrs` или пользовательские опции, добавляемые плагинами.
- Объявление именованных экспортов.
- Запуск side-эффектов или создание объектов, которые должны выполняться только один раз.

```vue
<script>
// обычный <script>, выполняется в области видимости модуля (только один раз)
runSideEffectOnce()

// объявление дополнительных опций
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// выполняется в области видимости setup() (для каждого экземпляра)
</script>
```

Support for combining `<script setup>` and `<script>` in the same component is limited to the scenarios described above. Specifically:

- Do **NOT** use a separate `<script>` section for options that can already be defined using `<script setup>`, such as `props` and `emits`.
- Variables created inside `<script setup>` are not added as properties to the component instance, making them inaccessible from the Options API. Mixing APIs in this way is strongly discouraged.

If you find yourself in one of the scenarios that is not supported then you should consider switching to an explicit [`setup()`](/api/composition-api-setup) function, instead of using `<script setup>`.

## Top-level `await` {#top-level-await}

`await` верхнего уровня может быть использован внутри `<script setup>`. Полученный код будет скомпилирован как `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Кроме того, ожидаемое выражение будет автоматически скомпилировано в формат, сохраняющий контекст текущего экземпляра компонента после `await`.

:::warning Примечание
`async setup()` должен использоваться в сочетании с `Suspense`, который в настоящее время является экспериментальной функцией. Мы планируем доработать и задокументировать его в одном из будущих релизов - но если вам интересно, то вы можете посмотреть его [тесты](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts), чтобы увидеть, как он работает.
:::

## Generics <sup class="vt-badge ts" /> {#generics}

Generic type parameters can be declared using the `generic` attribute on the `<script>` tag:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

The value of `generic` works exactly the same as the parameter list between `<...>` in TypeScript. For example, you can use multiple parameters, `extends` constraints, default types, and reference imported types:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

- Due to the difference in module execution semantics, code inside `<script setup>` relies on the context of an SFC. When moved into external `.js` or `.ts` files, it may lead to confusion for both developers and tools. Therefore, **`<script setup>`** cannot be used with the `src` attribute.
- `<script setup>` does not support In-DOM Root Component Template.([Related Discussion](https://github.com/vuejs/core/issues/8391))
