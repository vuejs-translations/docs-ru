# TypeScript с Options API {#typescript-with-options-api}

> На этой странице предполагается, что вы уже прочитали обзор по [использованию Vue с TypeScript](./overview).

:::tip Совет
Хотя Vue поддерживает использование TypeScript с помощью API Options, рекомендуется использовать Vue с TypeScript через API Composition, поскольку он предлагает более простой, эффективный и надежный вывод типов.
:::

## Типизация входных параметров компонента {#typing-component-props}

Вывод типов для входных параметров в API Options требует обертывания компонента с помощью `defineComponent()`. С ее помощью Vue может выводить типы для входных параметров на основе опции `props`, принимая во внимание дополнительные опции, такие как `required: true` и `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // включение вывода типа
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // тип: string | undefined
    this.id // тип: number | string | undefined
    this.msg // тип: string
    this.metadata // тип: any
  }
})
```

Однако runtime опция `props` поддерживает только использование функций конструктора в качестве типа входного параметра - нет возможности указать сложные типы, такие как объекты с вложенными свойствами или сигнатуры вызовов функций.

Для аннотирования сложных типов входных параметров можно использовать служебный тип `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // предостление более конкретного типа `Object`.
      type: Object as PropType<Book>,
      required: true
    },
    // также можно аннотировать функции
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: аргумент типа 'string' не может
    // быть присвоен параметру типа 'number'
    this.callback?.('123')
  }
})
```

### Предостережения {#caveats}

Если версия TypeScript меньше `4.7`, то следует быть осторожным при использовании значений функций для параметров `проверки` и параметров `по умолчанию` - обязательно используйте стрелочные функции:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Обязательно используйте стрелочные функции, если ваша версия TypeScript ниже 4.7.
      default: () => ({
        title: 'Выражение стрелочной функции'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Это избавляет TypeScript от необходимости выводить тип `this` внутри этих функций, что, к сожалению, может привести к неудачному выводу типа. Это было ограничение [предыдущего дизайна](https://github.com/microsoft/TypeScript/issues/38845), и теперь оно улучшено в [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7#improved-function-inference-in-objects-and-methods).


## Типизирование испукаемых событий компонента {#typing-component-emits}

Мы можем объявить ожидаемый тип полезной нагрузки для испускаемого события, используя объектный синтаксис опции `emits`. Кроме того, все необъявленные генерируемые события будут вызывать ошибку типа при вызове:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // выполнение проверки во время выполнения
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Ошибка типа!
      })

      this.$emit('non-declared-event') // Ошибка типа!
    }
  }
})
```

## Типизация вычисляемых свойств {#typing-computed-properties}

Вычисляемое свойство определяет свой тип на основе возвращаемого значения:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Привет!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // тип: string
  }
})
```

В некоторых случаях может потребоваться явная аннотация типа вычисляемого свойства, чтобы убедиться в корректности его реализации:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Привет!'
    }
  },
  computed: {
    // явно аннотировать возвращаемый тип
    greeting(): string {
      return this.message + '!'
    },

    // аннотирование вычисляемого свойства с возможностью записи
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Явные аннотации также могут потребоваться в некоторых случаях, когда TypeScript не может вывести тип вычисляемого свойства из-за циклических циклов вывода.

## Типизация обработчиков событий {#typing-event-handlers}

При работе с собственными событиями DOM может оказаться полезным правильно указывать аргумент, который мы передаем обработчику. Рассмотрим этот пример:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` неявно имеет тип` type
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Без аннотации типа аргумент `event` будет неявно иметь тип `any`. Это также приведет к ошибке TS, если в `tsconfig.json` используются значения `"strict": true` или `"noImplicitAny": true`. Поэтому рекомендуется явно аннотировать аргумент обработчиков событий. Кроме того, может потребоваться явное приведение свойств к `event`:


```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Расширение глобальных свойств {#augmenting-global-properties}

Некоторые плагины устанавливают глобально доступные свойства для всех экземпляров компонента через [`app.config.globalProperties`](/api/application#app-config-globalproperties). Например, мы можем установить `this.$http` для получения данных или `this.$translate` для интернационализации. Чтобы все это хорошо сочеталось с TypeScript, Vue предоставляет интерфейс `ComponentCustomProperties` предназначенный для дополнения с помощью [TypeScript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):


```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

См. также:

- [Модульные тесты TypeScript для расширений типов компонентов](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### Размещение расширяемого типа {#type-augmentation-placement}

Мы можем поместить это дополнение типа в файл `.ts` или в общепроектный файл `*.d.ts`. В любом случае убедитесь, что он включён в `tsconfig.json`. Для авторов библиотек / плагинов этот файл должен быть указан в свойстве `types` в `package.json`.

Для того чтобы воспользоваться преимуществами расширения модуля, необходимо убедиться, что расширение размещено в [модуле TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html). То есть файл должен содержать хотя бы один `import` или `export`, даже если это просто `export {}`. Если дополнение будет размещено вне модуля, то оно не дополнит исходные типы, а перезапишет их!

```ts
// Не работает, перезаписывает исходные типы.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Работает правильно
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Расширение пользовательских опций {#augmenting-custom-options}

Некоторые плагины, например `vue-router`, обеспечивают поддержку пользовательских параметров компонента, таких как `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Без соответствующего дополнения типов аргументы этого хука будут неявно иметь тип `any`. Мы можем дополнить интерфейс `ComponentCustomOptions` для поддержки этих пользовательских опций:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Теперь опция `beforeRouteEnter` будет правильно типизирована. Обратите внимание, что это всего лишь пример - хорошо типизированные библиотеки, такие как `vue-router` должны автоматически выполнять подобные дополнения в своих собственных определениях типов.

Размещение этого дополнения подчиняется [тем же ограничениям](#type-augmentation-placement), что и увеличение глобального свойства.

См. также:

- [Модульные тесты TypeScript для расширений типов компонентов](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)
