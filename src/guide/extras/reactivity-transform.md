# Трансформация реактивности {#reactivity-transform}

:::warning Экспериментальная возможность
Преобразование реактивности была экспериментальной функцией и была удалена в последнем выпуске 3.4. Пожалуйста, прочитайте о [причинах здесь](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Если вы всё еще собираетесь использовать эту функцию, она теперь доступна через плагин [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Специфика для Composition API
Преобразование реактивности является специфической функцией Composition-API и требует шага сборки.
:::

## Refs и реактивные переменные {#refs-vs-reactive-variables}

С момента появления Composition API одним из основных нерешенных вопросов является использование ссылок по сравнению с реактивными объектами. При деструктуризации реактивных объектов легко потерять реактивность, в то время как при использовании refs может быть неудобно использовать `.value` везде. Кроме того, `.value` легко пропустить, если не использовать систему типов.

[Преобразование реактивности в Vue](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) - это преобразование на этапе компиляции, которое позволяет нам писать код, подобный этому:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Метод `$ref()` здесь является **макросом времени компиляции**: он не является реальным методом, который будет вызван во время выполнения. Вместо этого компилятор Vue использует его как подсказку, чтобы рассматривать результирующую переменную `count` как **реактивную переменную**.

К реактивным переменным можно обращаться и переназначать их так же, как и к обычным переменным, но эти операции компилируются в ссылки с `.value`. Например, часть `<script>` приведенного выше компонента компилируется в:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Каждое API реактивности, возвращающее refs, будет иметь эквивалент в виде макроса с `$`-префиксом. К таким API относятся:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Эти макросы доступны глобально и не требуют импорта при включении Reactivity Transform, но при желании можно импортировать их из `vue/macros`, если требуется более четкое описание:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Деструктуризация с помощью `$()` {#destructuring-with}

Обычно функция композиции возвращает объект refs, а для получения этих refs используется деструктуризация. Для этого в reactivity transform предусмотрен макрос **`$()`**:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Скомпилированный вывод:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Обратите внимание, что если `x` уже является ref, то `toRef(__temp, 'x')` просто вернет его как есть, и никакого дополнительного ref создано не будет. Если деструктурированное значение не является ref (например, функция), оно все равно будет работать - значение будет обернуто в ref, так что остальная часть кода будет работать как положено.

Деструктуризация `$()` работает как с реактивными объектами, **так и** с обычными объектами, содержащими refs.

## Преобразование существующих refs в реактивные переменные с помощью `$()` {#convert-existing-refs-to-reactive-variables-with}

В некоторых случаях мы можем иметь обернутые функции, которые также возвращают refs. Однако компилятор Vue не сможет заранее узнать, что функция будет возвращать ref. В таких случаях макрос `$()` также может быть использован для преобразования всех существующих refs в реактивные переменные:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Деструктуризация реактивных входных параметров {#reactive-props-destructure}

Существуют две болезненные точки с текущим использованием `defineProps()` в `<script setup>`:

1. Как и в случае с `.value`, для сохранения реактивности необходимо всегда обращаться к входным параметрам как `props.x`. Это означает, что нельзя деструктурировать `defineProps`, поскольку полученные в результате деструктуризации переменные не являются реактивными и не будут обновляться.

2. При использовании [объявления props только для типа](/api/sfc-script-setup#type-only-props-emit-declarations), нет простого способа объявить значения по умолчанию для props. Для этой цели мы ввели API `withDefaults()`, но он по-прежнему неудобен в использовании.

Мы можем решить эти проблемы, применив преобразование во время компиляции, когда `defineProps` используется с деструктуризацией, аналогично тому, что мы видели ранее с `$()`:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // работает значение по умолчанию
    count = 1,
    // локальные псевдонимы также работают здесь,
    // мы используем псевдоним `props.foo` для `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // будет регистрироваться при каждом изменении входного параметра
    console.log(msg, count, bar)
  })
</script>
```

Вышеприведенное будет скомпилировано в следующий эквивалент объявления времени выполнения:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Сохранение реактивности за границами функций {#retaining-reactivity-across-function-boundaries}

Хотя реактивные переменные избавляют нас от необходимости повсеместно использовать `.value`,  возникает проблема "потери реактивности" при передаче реактивных переменных через границы функций. Это может произойти в двух случаях:

### Передача в функцию в качестве аргумента {#passing-into-function-as-argument}

Дана функция, ожидающая в качестве аргумента ref, например:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x изменился!')
  })
}

let count = $ref(0)
trackChange(count) // не работает!
```

Приведенный выше случай не будет работать должным образом, поскольку он компилируется в:

```ts
let count = ref(0)
trackChange(count.value)
```

Здесь `count.value` передается как число, в то время как `trackChange` ожидает фактического ref. Это можно исправить, обернув `count` в `$$()` перед передачей:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Вышеприведенное компилируется в:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Как мы видим, `$$()` - это макрос, который служит **подскасказкой**: реактивным переменным внутри `$$()` не будет добавлено `.value`.

### Возврат внутри области видимости функции {#returning-inside-function-scope}

Реактивность также может быть потеряна, если реактивные переменные используются непосредственно в возвращаемом выражении:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // слушаем движение мыши...

  // не работает!
  return {
    x,
    y
  }
}
```

Приведенный выше оператор возврата компилируется в:

```ts
return {
  x: x.value,
  y: y.value
}
```

Для того чтобы сохранить реактивность, мы должны возвращать фактические refs, а не текущее значение в момент возврата.

И снова мы можем использовать `$$()` для решения этой проблемы. В этом случае `$$()` можно использовать непосредственно на возвращаемом объекте - любые ссылки на реактивные переменные внутри вызова `$$()` будут сохранять ссылки на их базовые refs:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // слушаем движение мыши...

  // исправлено
  return $$({
    x,
    y
  })
}
```

### Использование `$()` на деструктурированных входных параметрах {#using-on-destructured-props}

`$$()` работает для деструктурированных входных параметров, поскольку они также являются реактивными переменными. Для повышения эффективности компилятор преобразует ее с помощью `toRef`:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

компилируется в:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Интеграция TypeScript <sup class="vt-badge ts" /> {#typescript-integration}

В Vue предусмотрены типы для этих макросов (доступны глобально), и все типы будут работать так, как ожидается. Нет никаких несовместимостей со стандартной семантикой TypeScript, поэтому синтаксис будет работать со всеми существующими инструментами.

Это также означает, что макросы могут работать в любых файлах, где разрешен валидный JS / TS - не только внутри Vue SFC.

Поскольку макросы доступны глобально, на их типы необходимо явно ссылаться (например, в файле `env.d.ts`):

```ts
/// <reference types="vue/macros-global" />
```

При явном импорте макросов из `vue/macros` тип будет работать без объявления глобальных переменных.

## Явное включение {#explicit-opt-in}

:::danger No longer supported in core
The following only applies up to Vue version 3.3 and below. Support has been removed in Vue core 3.4 and above, and `@vitejs/plugin-vue` 5.0 and above. If you intend to continue using the transform, please migrate to [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) instead.
:::

### Vite {#vite}

- Требуется `@vitejs/plugin-vue@>=2.0.0`
- Применяется к SFC и файлам js(x)/ts(x). Перед применением преобразования выполняется быстрая проверка использования файлов, поэтому для файлов, не использующих макросы, не должно быть никаких потерь производительности.
- Обратите внимание, что `reactivityTransform` теперь является опцией корневого уровня плагина, а не вложенной в `script.refSugar`, поскольку она влияет не только на SFC.

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- В настоящее время влияет только на SFC
- Требуется `vue-loader@>=17.0.0`

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### Обычный `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- В настоящее время влияет только на SFC
- Требуется `vue-loader@>=17.0.0`

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
