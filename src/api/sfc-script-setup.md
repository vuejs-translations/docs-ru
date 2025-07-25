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

Поскольку на компоненты ссылаются как на переменные, а не регистрируют их под строковыми ключами, то при использовании динамических компонентов внутри `<script setup>` следует использовать динамическую привязку с помощью `:is`:

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

  - В режиме разработки компилятор попытается вывести из типов соответствующую проверку во время выполнения. Например здесь `foo: String` выведется из `foo: string` типа. Если тип является ссылкой на импортированный тип, то выведенный результат будет равен `foo: null` (эквивалентно типу `any`), так как комплиятор ничего не знает о внешних файлах. 

  - В продакшене компилятор сгенерирует массив объявлений, дабы сократить размер итогового бандла (входные параметры в примере выше превратятся в `['foo', 'bar']`).

- В версии 3.2 и ниже дженерик для `defineProps()` был ограничен литератом типа или ссылкой на локальный интерфейс.

  Это ограничение было снято в версии 3.3. Последняя версия Vue поддерживает возможность ссылки на импортированные и ограниченный набор сложных типов в месте для использования типа. Однако, так как преобразование типов во время выполнения все еще основано на AST, некоторые сложные типы, требующие фактического анализа, например, условные типы, не поддерживаются. Вы можете использовать условные типы для типизации одного входного параметра, но не для цельного объекта входных параметров.  

### Реактивная деструктуризация входных параметров <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

Во Vue 3.5 и выше переменные, деструктурированные из возвращаемого значения `defineProps`, являются реактивными. Компилятор Vue автоматически добавляет префикс `props.`, когда код в одном и том же блоке `<script setup>` обращается к переменным, деструктурированным из `defineProps`:

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // выполняется только один раз до 3.5
  // повторно запускается при изменении входного параметра "foo" в 3.5+
  console.log(foo)
})
```

Все вышесказанное сводится к следующему эквиваленту:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` преобразуется компилятором в `props.foo`
  console.log(props.foo)
})
```

Кроме того, вы можете использовать нативный JavaScript синтаксис для значений по умолчанию, чтобы задекларировать значения по умолчанию для входных параметров. Это особенно полезно при использовании объявления входных параметров на основе типов:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### Значения входных параметров по умолчанию при использовании объявления типов <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

В версии 3.5 и выше значения по умолчанию могут быть объявлены естественным образом при использовании Reactive Props Destructure. Но в 3.4 и ниже Reactive Props Destructure не включена по умолчанию. Чтобы объявить входные параметры по умолчанию с помощью объявления на основе типов, необходим макрос компилятора `withDefaults`:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Это объявление будет преобразовано в эквивалентный аналог `default` как при объявлении входных параметров во время выполнения кода. Кроме того, макрос `withDefaults` предоставляет проверку типа для значений по умолчанию и гарантирует, что в возвращаемом типе `props` будут удалены флаги необязательных свойств (?) для свойств, у которых объявлены значения по умолчанию.

:::info
Обратите внимание, что значения по умолчанию для изменяемых ссылочных типов (например, массивов или объектов) следует оборачивать в функции при использовании `withDefaults`, чтобы избежать случайного изменения и внешних побочных эффектов. Это гарантирует, что каждый инстанс компонента получит свою собственную копию значения по умолчанию. Это **не** необходимо при использовании значений по умолчанию с деструктуризацией.
:::

## defineModel() {#definemodel}

- Доступно только в 3.4+

Этот макрос позволяет объявить двустороннее связывание для входного параметра, который может быть использовано внутри `v-model` из родительского компонента. Пример использования также рассматривает в руководстве [`v-model` на компоненте](/guide/components/v-model).

Под капотом этот макрос объявляет модель входного параметра и соответствующее событие для обновления значения. Если первый аргумент это литерат строки, то он будет являться название входного параметра; иначе имя входного параметра будет по умолчанию `"modelValue"`. В обоих случаях вы можете передать дополнительный объект, который может содержать дополнительные опции для входного параметра и параметры преобразования значения модели.

```js
// объявляет входной параметр "modelValue", который потребляется родителем через v-model
const model = defineModel()
// ИЛИ: объявляет входной параметр "modelValue" с дополнительными опциями
const model = defineModel({ type: String })

// генерирует пользовательское событие "update:modelValue", когда меняется значение
model.value = 'hello'

// объявляет входной параметр "count", который потребляется родителем через v-model:count
const count = defineModel('count')
// ИЛИ: объявляет входной параметр "count" с дополнительными настройками
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // генерирует пользовательское событие "update:count", когда меняется значение
  count.value++
}
```

:::warning Предупреждение
Если у вас есть значение `default` для свойства `defineModel`, и вы не предоставляете никакого значения для этого свойства из родительского компонента, это может привести к рассинхронизации между родительским и дочерним компонентами. В приведенном ниже примере родительский `myRef` не определен, а дочерний `model` равен 1:

```vue [Child.vue]
<script setup>
const model = defineModel({ default: 1 })
</script>
```

```vue [Parent.vue]
<script setup>
const myRef = ref()
</script>

<template>
  <Child v-model="myRef"></Child>
</template>
```
:::

### Модификаторы и дескрипторы get/set {#modifiers-and-transformers}

Чтобы получить доступ к модификатором `v-model` директивы, мы можем деструктурировать возвращамое значение `defineModel()` вот так:

```js
const [modelValue, modelModifiers] = defineModel()

// все равно что v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

Когда есть модификатор, нам, скорее всего, потребуется преобразовать значение при чтении или синхронизации с родителем. Для этого мы можем использовать дескрипторы `get` и `set`:

```js
const [modelValue, modelModifiers] = defineModel({
  // get() опущен, так как он здесь не нужен
  set(value) {
    // если используется модификатор .trim, возвращает изменённое значение
    if (modelModifiers.trim) {
      return value.trim()
    }
    // в противном случае возвращаем значение как есть
    return value
  }
})
```

### Использование вместе с TypeScript <sup class="vt-badge ts" /> {#usage-with-typescript}

Как `defineProps` и `defineEmits`, `defineModel` также может принимать типы аргументов, чтобы определить типы значения модели и модификаторов:

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// Значение по умолчанию с опцией, которая удаляет возможные undefined значения
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

Компоненты, использующие `<script setup>`, **по умолчанию закрытые** - т.е. публичный экземпляр компонента, получаемый через ссылку в шаблоне или цепочки `$parent`, **не** даёт доступа к каким-либо привязкам внутри `<script setup>`.

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

Когда родитель получает экземпляр этого компонента через ref в шаблоне, полученный экземпляр будет иметь вид `{ a: number, b: number }` (ref автоматически разворачиваются, как и для обычных экземпляров).

## defineOptions() {#defineoptions}

- Поддерживается только в 3.3+

Этот макрос может быть использован для объявления опций компонента прямо внутри `<script setup>` без создания отдельного `<script>` тега:

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

- Это макрос. Опции будут подняты в область видимости модуля и не смогут обращаться к локальным переменным внутри `<script setup>`, которые не являются литеральными константами.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- Поддерживается только в версиях 3.3+.

Это макрос может быть использован для создания подсказок типов в IDE для имен слотов и проверки типов входных параметров.

`defineSlots()` принимает аргументом только тип и никаких рантайм-значений. Параметр типа должен быть литералом типа, где ключ свойства - это имя слота, а тип значения - функция слота. Первый аргумент функции - это входной параметр, который слот ожидает получить, и его тип будет использоваться для входных параметров слота в шаблоне. Возвращаемый тип пока что игнорируется и может быть `any`, но в будущем мы можем использовать его для проверки содержимого слота.

Этот макрос также возвращает объект `slots`, что эквивалентно объекту `slots`, который выставляется в контексте setup или возвращаемому функцией `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```
## `useSlots()` и `useAttrs()` {#useslots-useattrs}

Использование `slots` и `attrs` внутри `<script setup>` должно встречаться крайне редко, поскольку в шаблоне прямой доступ к ним можно получить через `$slots` и `$attrs`. В редких случаях, когда они всё же нужны, используйте вспомогательные методы `useSlots` и `useAttrs` соответственно:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` и `useAttrs` - это рантайм-функции, которые возвращают эквивалент `setupContext.slots` и `setupContext.attrs`. Они могут использоваться и в обычных функциях Composition API.

## Использование вместе с обычной секцией `<script>` {#usage-alongside-normal-script}

`<script setup>` может использоваться вместе с обычной секцией `<script>`. Обычный `<script>` может понадобиться в случаях, когда необходимо:

- Объявление опций, которые не могут быть выражены в `<script setup>`, например, `inheritAttrs` или пользовательские опции, добавляемые плагинами.
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

Поддержка для совмещения `<script setup>` и `<script>` в одном компоненте ограничена в сценариях, описанных ниже. В частности: 

- **Не используйте** отдельный `<script>` тег для опций, который уже объявлены при помощи `<script setup>`, такие как `props` и `emits`.
- Переменные, созданные внутри `<script setup>`, не добавляются как свойства инстанса компонента, делая их невозможными к получению из Options API. Смешивать API таким образом категорически не рекомендуется.

Если вы оказались в одном из сценариев, которые не поддерживаются, то вам следует рассмотреть возможность перехода на явную функцию [`setup()`](/api/composition-api-setup) вместо использования `<script setup>`.

## Верхнеуровневый `await` {#top-level-await}

`await` верхнего уровня может быть использован внутри `<script setup>`. Полученный код будет скомпилирован как `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Кроме того, ожидаемое выражение будет автоматически скомпилировано в формат, сохраняющий контекст текущего экземпляра компонента после `await`.

:::warning Примечание
`async setup()` должен использоваться в сочетании с [`Suspense`](/guide/built-ins/suspense.html), который в настоящее время является экспериментальной функцией. Мы планируем доработать и задокументировать его в одном из будущих релизов - но если вам интересно, то вы можете посмотреть его [тесты](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts), чтобы увидеть, как он работает.
:::

## Import Statements {#imports-statements}

Import statements in vue follow [ECMAScript module specification](https://nodejs.org/api/esm.html).
In addition, you can use aliases defined in your build tool configuration:

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## Дженерики <sup class="vt-badge ts" /> {#generics}

Дженерики могут быть объявлены с помощью атрибута `generic` в теге `<script>`:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

Значение `generic` работает точно также, как список параметров между `<...>` в TypeScript. Например, вы можете использовать множество параметров, `extends` для ограничений, устанавливать типы по умолчанию и ссылаться на импортированные типы:

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

You can use `@vue-generic` the directive to pass in explicit types, for when the type cannot be inferred:

```vue
<template>
  <!-- @vue-generic {import('@/api').Actor} -->
  <ApiSelect v-model="peopleIds" endpoint="/api/actors" id-prop="actorId" />

  <!-- @vue-generic {import('@/api').Genre} -->
  <ApiSelect v-model="genreIds" endpoint="/api/genres" id-prop="genreId" />
</template>
```

In order to use a reference to a generic component in a `ref` you need to use the [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) library as `InstanceType` won't work.

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

// Works for a component without generics
ref<InstanceType<typeof componentWithoutGenerics>>();

ref<ComponentExposed<typeof genericComponent>>();
```

## Restrictions {#restrictions}

- Из-за разницы в семантике выполнения модулей код внутри `<script setup>` полагается на контекст SFC. Если перенести их во внешние файлы `.js` или `.ts`, это может привести к путанице как для разработчиков, так и для инструментов. Поэтому **`<script setup>`** нельзя использовать с атрибутом `src`.
- `<script setup>` не поддерживает шаблон корневого компонента In-DOM. ([Связанные обсуждения](https://github.com/vuejs/core/issues/8391))
