# Provide / Inject {#provide-inject}

> Подразумевается, что вы уже изучили и разобрались с разделом [Основы компонентов](/guide/essentials/component-basics). Если нет — прочитайте его сначала.

## Пробрасывание входных параметров {#prop-drilling}

Обычно для передачи данных от родительского компонента в дочерний используются [входные параметры](/guide/components/props). Представьте структуру, в которой будет несколько глубоко вложенных компонентов и потребуется что-то от родительского компонента в глубоко вложенном дочернем. В таком случае необходимо передавать входные параметры вниз по всей цепочке компонентов, что может быть очень неудобным.

![Диаграмма пробрасывания входных параметров](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Обратите внимание, хотя компоненту `<Footer>` не нужны входные параметры, ему все равно необходимо объявить и передать их, чтобы `<DeepChild>` мог получить к ним доступ. Если есть более длинная родительская цепочка, по пути будет затронуто больше компонентов. Это называется "пробрасывание входных параметров", и с этим определенно не весело иметь дело.

В таких случаях можно использовать пару `provide` и `inject`. Родительские компоненты могут служить **провайдерами зависимостей** для всех своих потомков. Любой компонент в дереве-потомке, независимо от его глубины, может **внедрить** зависимости, предоставляемые компонентами, расположенными выше в его родительской цепочке.

![Схема provide/inject](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Чтобы предоставить данные потомкам компонента, используйте функцию [`provide()`](/api/composition-api-dependency-injection#provide):

```vue
<script setup>
import { provide } from 'vue'

provide(/* ключ */ 'message', /* значение */ 'привет!')
</script>
```

Если не используется `<script setup>`, убедитесь, что функция `provide()` вызывается синхронно внутри функции `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* ключ */ 'message', /* значение */ 'привет!')
  }
}
```

Функция `provide()` принимает два аргумента. Первый аргумент называется **ключом инъекции**, который может быть строкой или `Symbol`. Ключ инъекции используется компонентами-потомками для поиска нужного значения для инъекции. Один компонент может вызывать функцию `provide()` несколько раз с разными ключами инъекции для получения различных значений.

Вторым аргументом является предоставляемое значение. Значение может быть любого типа, включая реактивное состояние, такое как refs:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Предоставление реактивных значений позволяет компонентам-потомкам, использующим предоставленное значение, устанавливать реактивное соединение с компонентом-провайдером.

</div>

<div class="options-api">

Чтобы предоставить данные потомкам компонента, используйте опцию [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'привет!'
  }
}
```

Для каждого свойства в объекте `provide`, ключ используется дочерними компонентами для поиска нужного значения для инъекции, а значение — это то, что в итоге будет инъецировано.

Если нам нужно предоставить состояние для каждого экземпляра, например, данные, объявленные с помощью `data()`, тогда `provide` должен использовать значение функции:

```js{7-12}
export default {
  data() {
    return {
      message: 'привет!'
    }
  },
  provide() {
    // используйте синтаксис функции, чтобы получить доступ к `this`
    return {
      message: this.message
    }
  }
}
```

Однако следует иметь в виду, что это **не делает инъекцию реактивной**. О том, как [сделать инъекции реактивными](#working-with-reactivity) мы поговорим ниже.

</div>

## Предоставление на уровне приложения {#app-level-provide}

Помимо предоставления данных в компоненте, мы также можем предоставлять их на уровне приложения:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* ключ */ 'message', /* значение */ 'привет!')
```

Предоставление на уровне приложения доступно для всех компонентов, отображаемых в приложении. Это особенно полезно при написании [плагинов](/guide/reusability/plugins.html), поскольку плагины обычно не могут предоставлять значения с использованием компонентов.

## Inject {#inject}

<div class="composition-api">

Для инъекции данных, предоставляемых компонентом-предком, используйте функцию [`inject()`](/api/composition-api-dependency-injection#inject):

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Если предоставленное значение является ref, то оно будет внедрено как есть и **не будет автоматически разворачиваться**. Это позволяет компоненту-инжектору сохранять реактивную связь с компонентом-провайдером.

[Полный пример provide + inject с реактивностью](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Опять же, если не используется `<script setup>`, то `inject()` следует вызывать синхронно только внутри `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Для инъекции данных, предоставляемых компонентом-предком, используйте опцию [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // внедрённое значение
  }
}
```

Инъекции разрешаются **раньше**, чем собственное состояние компонента, поэтому к внедрённым свойствам можно обращаться в `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // исходные данные на основе внедрённого значения
      fullMessage: this.message
    }
  }
}
```

[Полный пример provide + inject](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Внедрение псевдонимов \* {#injection-aliasing}

При использовании синтаксиса массива для `inject`, внедряемые свойства отображаются в экземпляре компонента с использованием того же ключа. В приведенном примере свойство было предоставлено под ключом `"message"`, и внедряется как `this.message`. Локальный ключ совпадает с ключом инъекции.

Если мы хотим внедрить свойство с использованием другого локального ключа, то необходимо использовать объектный синтаксис для опции `inject`:

```js
export default {
  inject: {
    /* локальный ключ */ localMessage: {
      from: /* внедряемый ключ */ 'message'
    }
  }
}
```

Здесь компонент найдет свойство с ключом `"message"`, а затем выставит его как `this.localMessage`.

</div>

### Значения по умолчанию для инъекций {#injection-default-values}

По умолчанию, `inject` предполагает, что инжектируемый ключ предоставлен где-то в родительской цепочке. В случае, если ключ не предоставлен, будет выдано предупреждение.

Если мы хотим, чтобы инжектируемое свойство работало с необязательными провайдерами, нам необходимо объявить значение по умолчанию, аналогично входным параметрам:

<div class="composition-api">

```js
// `value` будет "значением по умолчанию"
// если данные, соответствующие "message", не были предоставлены
const value = inject('message', 'default value')
```

В некоторых случаях значение по умолчанию может потребоваться создать путем вызова функции или инстанцирования нового класса. Чтобы избежать лишних вычислений или побочных эффектов в случае, если необязательное значение не используется, мы можем использовать фабричную функцию для создания значения по умолчанию:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Третий параметр указывает, что значение по умолчанию должно рассматриваться как фабричная функция.

</div>

<div class="options-api">

```js
export default {
  // необходим синтаксис объекта
  // при объявлении значений по умолчанию для инъекций
  inject: {
    message: {
      from: 'message', // это необязательно, если для инъекций используется один и тот же ключ
      default: 'default value'
    },
    user: {
      // используйте фабричную функцию для непримитивных значений, которые дороги
      // для создания или те, которые должны быть уникальными для каждого экземпляра компонента.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Работа с реактивностью {#working-with-reactivity}

<div class="composition-api">

При использовании реактивных значений provide / inject, **рекомендуется по возможности хранить любые мутации реактивного состояния внутри _провайдера_**. Это гарантирует, что предоставляемое состояние и его возможные мутации будут находиться в одном компоненте, что облегчает их поддержку в будущем.

Бывают случаи, когда необходимо обновить данные из компонента-инжектора. В таких случаях рекомендуется предоставлять функцию, отвечающую за мутацию состояния:

```vue{7-9,13}
<!-- внутри компонента провайдер -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- в компоненте injector -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Наконец, вы можете обернуть предоставленное значение с помощью [`readonly()`](/api/reactivity-core#readonly), если хотите гарантировать, что данные, переданные через `provide`, не могут быть изменены инжектируемым компонентом.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Чтобы сделать инъекции реактивно связанными с провайдером, нам нужно предоставить вычисляемое свойство с помощью функции [computed()](/api/reactivity-core#computed):

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'привет!'
    }
  },
  provide() {
    return {
      // явно указываем вычисляемое свойство
      message: computed(() => this.message)
    }
  }
}
```

[Полный пример provide + inject с реактивностью](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

Функция `computed()` обычно используется в компонентах Composition API, но ее также можно использовать для дополнения определенных вариантов использования в Options API. Вы можете узнать больше о его использовании, прочитав [Основы реактивности](/guide/essentials/reactivity-fundamentals.html) и [Вычисляемые свойства](/guide/essentials/computed.html) с переключателем API Preference, установленным на Composition API.

</div>

## Работа с символьными ключами {#working-with-symbol-keys}

До сих пор в примерах мы использовали ключи инъекции строк. Если вы работаете в большом приложении с большим количеством поставщиков зависимостей или создаете компоненты, которые будут использоваться другими разработчиками, лучше всего использовать ключи инъекции символов, чтобы избежать возможных коллизий.

Рекомендуется экспортировать символы в отдельный файл:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// в компоненте provider
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* данные для предоставления */
})
```

```js
// в компоненте injector
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

См. также: [Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// в компоненте provider
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* данные для предоставления */
      }
    }
  }
}
```

```js
// в компоненте injector
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
