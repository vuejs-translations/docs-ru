# TypeScript с Composition API {#typescript-with-composition-api}

> На этой странице предполагается, что вы уже прочитали обзор по [использованию Vue с TypeScript](./overview).

## Типизация входных параметров компонента {#typing-component-props}

### Использование `<script setup>` {#using-script-setup}

При использовании `<script setup>`, макрос `defineProps()` поддерживает вывод типов входных параметров на основе своего аргумента:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Это называется "объявлением в рантайме", поскольку аргумент, переданный в `defineProps()` будет использоваться в качестве параметра `props` во время выполнения.

Однако обычно проще определять входные параметры с чистыми типами с помощью аргумента дженерик-типа:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Это называется "объявление на основе типа". Компилятор постарается сделать все возможное, чтобы вывести эквивалентные параметры времени выполнения на основе аргумента типа. В данном случае второй пример компилируется с точно такими же параметрами времени выполнения, как и первый.

Вы можете использовать либо объявление на основе типов, либо объявление во время выполнения, но не можете использовать оба варианта одновременно.

Мы также можем вынести типы входных параметров в отдельный интерфейс:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Это также работает, если `Props` импортируется из внешнего файла. Эта функция требует, чтобы TypeScript был зависимостью от Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Ограничения Синтаксиса {#syntax-limitations}

В версии 3.2 и ниже параметр дженерика для `defineProps()` был ограничен литеральным типом или ссылкой на интерфейс в этом же файле.

Это ограничение было устранено в версии 3.3. Последняя версия Vue поддерживает ссылки на импортируемые и ограниченный набор сложных типов в позиции параметра типа. Однако, поскольку преобразование типов во время выполнения все еще основано на AST, некоторые сложные типы, требующие фактического анализа типов, например условные типы, не поддерживаются. Вы можете использовать условные типы для типа отдельного входного параметра, но не всего объекта входных параметров.

### Значения по умолчанию входных параметров {#props-default-values}

При использовании объявления на основе типов мы теряем возможность объявлять значения по умолчанию для входных параметров. Это можно решить с помощью макроса компилятора `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'привет',
  labels: () => ['один', 'два']
})
```

Это будет скомпилировано во время выполнения в эквивалентные параметры `по умолчанию`. Кроме того, помощник `withDefaults` обеспечивает проверку типов для значений по умолчанию и гарантирует, что в возвращаемом типе `props` будут удалены необязательные флаги для свойств, для которых объявлены значения по умолчанию.

### Без `<script setup>` {#without-script-setup}

Если не используется `<script setup>`, то для включения функции определения типа входного параметра необходимо использовать `defineComponent()`. Тип объекта входного параметра, переданного в `setup()` выводится из параметра `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- тип: string
  }
})
```

### Сложные типы входных параметров {#complex-prop-types}

При объявлении на основе типов входных параметров может использоваться сложный тип так же, как и любой другой тип:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Для объявления в рантайме мы можем использовать утилити тип `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Это работает точно так же, как если бы мы указывали опцию `props` напрямую:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```
Опция `props` чаще всего используется в Options API, поэтому более подробные примеры вы найдете в руководстве [TypeScript с Options API](/guide/typescript/options-api#typing-component-props). Приемы, показанные в этих примерах, также применимы к объявлениям в рантайме с помощью `defineProps()`.

## Типизация испукаемых событий компонента {#typing-component-emits}

В `<script setup>`, функция `emit` также может быть типизирована с помощью определения в рантайме, либо определения через тип:

```vue
<script setup lang="ts">
// в рантайме
const emit = defineEmits(['change', 'update'])

// основанный на опциях
const emit = defineEmits({
  change: (id: number) => {
    // верните `true` или `false` чтобы обозначить
    // валидация пройдена / провалена
  },
  update: (value: string) => {
    // верните `true` или `false` чтобы обозначить
    // валидация пройдена / провалена
  }
})

// основанный на типах
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: альтернатива с более лаконичным синтаксисом
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Аргумент для определения через тип может быть одним из следующих:

1. Типами функций, но записанный как литерал типа с [сигнатурой вызова](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Он будет использоваться в качестве типа возвращаемой функции `emit`.
2. Литеральный тип, где ключами являются имена событий, а значениями - типы массивово / кортежей, представляющие дополнительные принимаемые параметры для события. В приведенном примере используются именованные кортежи, поэтому каждый аргумент может иметь явное имя.

Как мы видим, объявление типа дает нам гораздо более тонкий контроль над ограничениями типов для пользовательских событий.

Если не используется `<script setup>`, то `defineComponent()` способен вывести разрешенные события для функции `emit`, выставленной в контексте setup:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- проверка типа / автодополнение
  }
})
```

## Типизация `ref()` {#typing-ref}

Ссылки выводят тип из начального значения:

```ts
import { ref } from 'vue'

// выводимый тип: Ref<number>
const year = ref(2020)

// => TS Error: Тип 'string' не может быть присвоен типу 'number'.
year.value = '2020'
```

Иногда возникает необходимость указать сложные типы для внутреннего значения ссылки. Для этого можно использовать тип `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ок!
```

Или, передав общий аргумент при вызове `ref()` переопределить вывод по умолчанию:

```ts
// итоговый тип: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ок!
```

Если указать аргумент типа generic, но опустить начальное значение, то результирующим типом будет тип union, включающий `undefined`:

```ts
// предполагаемый тип: Ref<number | undefined>
const n = ref<number>()
```

## Типизация `reactive()` {#typing-reactive}

`reactive()` также неявно выводит тип из своего аргумента:

```ts
import { reactive } from 'vue'

// предполагаемый тип: { title: string }
const book = reactive({ title: 'Руководство по Vue 3' })
```

Чтобы явно ввести свойство `reactive`, мы можем использовать интерфейсы:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Руководство по Vue 3' })
```

:::tip Совет
Не рекомендуется использовать аргумент для дженерика `reactive()` поскольку возвращаемый тип, который обрабатывает разворачивание вложенных ссылок, отличается от типа аргумента дженерика.
:::

## Типизация `computed()` {#typing-computed}

`computed()` определяет его тип на основе возвращаемого значения геттера:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// предполагаемый тип: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Свойство 'split' не существует для типа 'number'
const result = double.value.split('')
```

Вы также можете указать явный тип через аргумент дженерика:

```ts
const double = computed<number>(() => {
  // ошибка типа, если это не возвращает число
})
```

## Типизация обработчиков событий {#typing-event-handlers}

При работе с собственными событиями DOM может быть полезно правильно ввести аргумент, который мы передаем обработчику. Давайте посмотрим на этот пример:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` неявно имеет тип `any`.
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Без аннотации типа аргумент `event` будет неявно иметь тип `any`. Это также приведет к ошибке, если в `tsconfig.json` используются значения `"strict": true` или `"noImplicitAny": true`. Поэтому рекомендуется явно аннотировать аргумент обработчиков событий. Кроме того, может потребоваться явное приведение свойств к `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Типизация Provide / Inject {#typing-provide-inject}

Provide и inject обычно выполняются в отдельных компонентах. Для правильной типизации внедряемых значений Vue предоставляет интерфейс `InjectionKey`, который представляет собой общий тип, расширяющий `Symbol`. Он может быть использован для синхронизации типа внедряемого значения между провайдером и потребителем:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // предоставление нестрокового значения приведет к ошибке

const foo = inject(key) // тип foo: string | undefined
```

Рекомендуется помещать ключ инъекции в отдельный файл, чтобы его можно было импортировать в несколько компонентов.

При использовании строковых ключей инъекции тип инжектируемого значения будет `unknown` и должен быть явно объявлен через аргумент generic type:

```ts
const foo = inject<string>('foo') // тип: string | undefined
```

Обратите внимание, что инжектируемое значение может быть `undefined`, поскольку нет никакой гарантии, что провайдер предоставит это значение во время выполнения.

Тип `undefined` может быть удалён путём предоставления значения по умолчанию:

```ts
const foo = inject<string>('foo', 'bar') // тип: string
```

Если вы уверены, что значение всегда будет предоставлено, вы можете также принудительно привести значение:

```ts
const foo = inject('foo') as string
```

## Типизация ссылок на шаблоны {#typing-template-refs}

Шаблонные ссылки должны создаваться с явным аргументом типа generic и начальным значением `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

Чтобы получить правильный интерфейс DOM, вы можете посмотреть такие страницы, как [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary).

Обратите внимание, что для обеспечения строгой безопасности типов при обращении к `el.value` необходимо использовать опциональную цепочку или защиту типов. Это связано с тем, что начальное значение ref является `null` до тех пор, пока компонент не будет монтирован, а также может быть установлено в `null`, если ссылаемый элемент будет размонтирован с помощью `v-if`.

## Типизация ссылок на шаблоны компонентов {#typing-component-template-refs}

Иногда для вызова публичного метода дочернего компонента требуется определить ссылку на шаблон. Например, у нас есть дочерний компонент `MyModal` с методом, открывающим модальное окно:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

Для того чтобы получить тип экземпляра `MyModal`, необходимо сначала получить его тип через `typeof`, а затем использовать встроенную в TypeScript утилиту `InstanceType` для извлечения типа экземпляра:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

В случаях, когда точный тип компонента недоступен или не важен, вместо него можно использовать `ComponentPublicInstance`. В этом случае будут указаны только те свойства, которые являются общими для всех компонентов, например `$el`:

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```
