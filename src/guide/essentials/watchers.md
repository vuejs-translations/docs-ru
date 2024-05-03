# Наблюдатели {#watchers}

## Простой пример {#basic-example}

Вычисляемые свойства позволяют нам декларативно вычислять производные значения. Однако бывают случаи, когда нам необходимо выполнить "побочные эффекты" в ответ на изменение состояния. Например, мутировать DOM или изменить другой фрагмент состояния на основе результата асинхронной операции.

<div class="options-api">

С помощью Options API мы можем использовать [`watch` опцию](/api/options-state#watch) для запуска функции при каждом изменении реактивного свойства:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Вопросы обычно заканчиваются вопросительным знаком. ;-)',
      loading: false
    }
  },
  watch: {
    // при каждом изменении `question` эта функция будет запускаться
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Думаю...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Ошибка! Нет доступа к API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Задайте вопрос, на который можно ответить «да» или «нет»:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

Опция `watch` также поддерживает путь, разделенный точками, в качестве ключа:

```js
export default {
  watch: {
    // Примечание: только простые пути. Выражения не поддерживаются.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

С Composition API мы можем использовать [функцию](/api/reactivity-core#watch) `watch` для запуска обратного вызова всякий раз, когда изменяется часть реактивного состояния:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Вопросы обычно заканчиваются вопросительным знаком. ;-)')
const loading = ref(false)

// watch работает прямо в ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Думаю...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Ошибка! Нет доступа к API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### Типы источников watch {#watch-source-types}

Первым аргументом `watch` могут быть различные типы реактивных "источников": это может быть ref (включая вычисляемые refs), реактивный объект, геттер-функция или массив из нескольких источников:

```js
const x = ref(0)
const y = ref(0)

// одиночный ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// геттер
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`сумма x + y равна: ${sum}`)
  }
)

// массив из нескольких источников
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x равен ${newX} и y равен ${newY}`)
})
```

Обратите внимание, что вы не можете наблюдать за свойством реактивного объекта таким образом:

```js
const obj = reactive({ count: 0 })

// это не сработает, потому что мы передаем число в watch()
watch(obj.count, (count) => {
  console.log(`count равен: ${count}`)
})
```

Вместо этого используйте геттер:

```js
// вместо этого используйте геттер:
watch(
  () => obj.count,
  (count) => {
    console.log(`count равен: ${count}`)
  }
)
```

</div>

## Глубокие наблюдатели {#deep-watchers}

<div class="options-api">

`watch` по умолчанию неглубокий. Обратный вызов сработает только тогда, когда отслеживаемому свойству будет присвоено новое значение. Он не сработает при изменении вложенного свойства. Если вы хотите, чтобы обратный вызов срабатывал на все вложенные мутации, вам нужно использовать глубокий watcher:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Примечание: `newValue` будет равно `oldValue` здесь
        // при вложенных мутациях до тех пор, пока сам объект
        // не будет заменен.
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Когда вы вызываете `watch()` непосредственно на реактивном объекте, он неявно создает глубокий наблюдатель - обратный вызов будет срабатывать на все вложенные мутации:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // срабатывает при мутациях вложенного свойства
  // Примечание: `newValue` будет равно `oldValue`
  // потому что они оба указывают на один и тот же объект!
})

obj.count++
```

Это следует отличать от геттера, который возвращает реактивный объект — в последующих случаях обратный вызов сработает только в том случае, если геттер вернет другой объект:

```js
watch(
  () => state.someObject,
  () => {
    // сработает только при замене state.someObject
  }
)
```

Однако вы можете принудительно преобразовать второй случай в глубокий watcher, явно используя опцию `deep`:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Примечание: `newValue` здесь будет равно `oldValue`
    // *если* state.someObject не был заменен
  },
  { deep: true }
)
```

</div>

:::warning Используйте с осторожностью
Глубокий наблюдатель требует обхода всех вложенных свойств в просматриваемом объекте и может быть дорогостоящим при использовании на больших структурах данных. Используйте его только в случае необходимости и помните о последствиях для производительности.
:::

## Eager Watchers {#eager-watchers}

`watch` по умолчанию ленив: обратный вызов не будет вызван, пока не изменится отслеживаемый источник. Но в некоторых случаях мы можем захотеть, чтобы логика обратного вызова выполнялась немедленно - например, мы можем захотеть получить некоторые исходные данные, а затем повторно извлекать данные всякий раз, когда изменяется соответствующее состояние.

<div class="options-api">

Мы можем заставить обратный вызов наблюдателя выполниться немедленно, объявив его с помощью объекта с функцией `handler` и параметром `immediate: true`:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // будет запущено сразу при создания компонента
      },
      // принудительное выполнение немедленного обратного вызова
      immediate: true
    }
  }
  // ...
}
```

Начальное выполнение функции-обработчика произойдет непосредственно перед `created` хуком. Vue уже обработает параметры `data`, `computed`, и `methods`, поэтому эти свойства будут доступны при первом вызове.

</div>

<div class="composition-api">

Мы можем принудительно выполнить обратный вызов наблюдателя немедленно, передав параметр `immediate: true`:

```js
watch(
  source,
  (newValue, oldValue) => {
    // выполнится немедленно, и затем при изменении `источника`
  },
  { immediate: true }
)
```

</div>

## Once Watchers <sup class="vt-badge" data-text="3.4+" /> {#once-watchers}

Обратный вызов наблюдателя будет выполняться всякий раз, когда изменяется отслеживаемый источник. Если вы хотите, чтобы обратный вызов запускался только один раз при изменении источника, используйте параметр `once: true`.

<div class="options-api">
  
```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // когда `источник` изменяется, срабатывает только один раз
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // когда `источник` изменяется, срабатывает только один раз
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

`watch()` является ленивым: обратный вызов не будет вызван до тех пор, пока наблюдаемый источник не изменится. Но в некоторых случаях мы можем захотеть, чтобы та же логика обратного вызова выполнялась немедленно. Например, мы можем захотеть получить некоторые начальные данные, а затем повторно получить их при каждом изменении состояния. Мы можем столкнуться с такой задачей:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

В частности, обратите внимание, что watcher использует `todoId` дважды, один раз в качестве источника, а затем снова внутри обратного вызова.

Это можно упростить с помощью функции [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` позволяет нам немедленно выполнить побочный эффект, автоматически отслеживая реактивные зависимости. Приведенный выше пример можно переписать следующим образом:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Здесь обратный вызов будет запущен немедленно, нет необходимости указывать `immediate: true`. Во время его выполнения он будет автоматически отслеживать `todoId.value` как зависимость (аналогично вычисляемым свойствам). Всякий раз, когда `todoId.value` изменяется, обратный вызов будет запущен снова. С помощью `watchEffect()` нам больше не нужно явно передавать `todoId` в качестве источника.

Вы можете посмотреть [этот пример](/examples/#fetching-data) с `watchEffect` и реактивной загрузкой данных в action.

Для примеров с одной зависимостью преимущество `watchEffect()` относительно невелико. Но для наблюдателей, у которых есть несколько зависимостей, использование `watchEffect()` избавляет от необходимости вести список зависимостей вручную. Кроме того, если вам нужно просмотреть несколько свойств во вложенной структуре данных, `watchEffect()` может оказаться более эффективным, чем глубокий наблюдатель, поскольку он будет отслеживать только те свойства, которые используются в обратном вызове, а не рекурсивно отслеживать их все.

:::tip Совет
`watchEffect` отслеживает зависимости только во время **синхронного** выполнения. При использовании его с асинхронным обратным вызовом будут отслеживаться только свойства, доступные до первого тика `await`.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` и `watchEffect` оба позволяют нам реактивно выполнять побочные эффекты. Их основное различие заключается в том, как они отслеживают свои реактивные зависимости:

- `watch` отслеживает только явно указанный источник. Он не будет отслеживать ничего, к чему обращаются внутри обратного вызова. Кроме того, обратный вызов срабатывает только тогда, когда источник действительно изменился. `watch` отделяет отслеживание зависимости от побочного эффекта, давая нам более точный контроль над тем, когда должен сработать обратный вызов.

- `watchEffect`, с другой стороны, объединяет отслеживание зависимостей и побочный эффект в одну фазу. Он автоматически отслеживает каждое реактивное свойство, доступ к которому осуществляется во время его синхронного выполнения. Это более удобно и обычно приводит к более лаконичному коду, но делает его реактивные зависимости менее явными.

</div>

## Время обратного вызова {#callback-flush-timing}

Когда вы изменяете реактивное состояние, это может вызвать как обновления компонентов Vue, так и обратные вызовы наблюдателя, созданные вами.

Подобно обновлению компонентов, созданные пользователем обратные вызовы наблюдателей обрабатываются пакетно, чтобы избежать дублирования. Например, мы, вероятно, не хотим, чтобы наблюдатель запускался тысячу раз, если мы синхронно помещаем тысячу элементов в отслеживаемый массив.

По умолчанию, созданные пользователем обратные вызовы наблюдателей вызываются **до** обновления компонентов Vue. Это означает, что если вы попытаетесь получить доступ к DOM внутри обратного вызова наблюдателя, DOM будет находиться в состоянии до того, как Vue применит какие-либо обновления.

### Post Watchers {#post-watchers}

Если вы хотите получить доступ к DOM в обратном вызове наблюдателя **после того**, как Vue обновит его,  вам нужно указать опцию `flush: 'post'`:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` также имеет удобный псевдоним, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* выполняется после обновлений Vue */
})
```

</div>

### Sync watchers {#sync-watchers}

Также можно создать наблюдатель, который будет срабатывать синхронно, перед любыми обновлениями, управляемыми Vue:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

У синхронных `watchEffect()` также есть удобный псевдоним, `watchSyncEffect()`:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* выполняется синхронно при изменении реактивных данных */
})
```

</div>

:::warning Используйте с осторожностью
Синхронные наблюдатели не имеют пакетной обработки и срабатывают каждый раз, когда обнаруживается реактивная мутация. Их можно использовать для наблюдения за простыми булевыми значениями, но избегайте их использования для источников данных, которые могут синхронно изменены много раз, например, массивов.
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Также можно императивно создавать наблюдатели, используя [`$watch()` метод экземпляра](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Это полезно, когда вам нужно вызвать watcher по условию или наблюдать за чем-то только в ответ на взаимодействие пользователя. Это также позволяет остановить наблюдателя раньше времени.

</div>

## Остановка наблюдателя {#stopping-a-watcher}

<div class="options-api">

Наблюдатели, объявленные с помощью опции `watch` или экземпляра `$watch()`, автоматически останавливаются при размонтировании компонента. Поэтому в большинстве случаев вам не нужно беспокоиться о том, чтобы остановить наблюдателя самостоятельно.

В редких случаях, когда вам нужно остановить наблюдателя до того, как компонент размонтируется, API `$watch()` предоставляет функцию для этого:

```js
const unwatch = this.$watch('foo', callback)

// ...когда наблюдатель больше не нужен:
unwatch()
```

</div>

<div class="composition-api">

Наблюдатели, объявленные синхронно внутри `setup()` или `<script setup>`, привязываются к экземпляру компонента-владельца и автоматически останавливаются, когда компонент-владелец размонтируется. В большинстве случаев вам не нужно беспокоиться о том, чтобы остановить наблюдателя самостоятельно.

Ключевым моментом здесь является то, что наблюдатель должен быть создан **синхронно**. Если наблюдатель будет создан в асинхронном обратном вызове, он не будет привязан к компоненту-владельцу и должен быть остановлен вручную, чтобы избежать утечки памяти. Вот пример:

```vue
<script setup>
import { watchEffect } from 'vue'

// будет автоматически остановлено
watchEffect(() => {})

// ...это - нет!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Чтобы вручную остановить watcher, используйте функцию возврата. Это работает как для `watch`, так и для `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...позже, когда уже не нужно
unwatch()
```

Обратите внимание, что случаев, когда вам нужно создавать наблюдатели асинхронно, должно быть очень мало, и по возможности лучше предпочесть синхронное создание. Если вам нужно дождаться асинхронных данных, вы можете сделать логику работы наблюдателя условной:

```js
// данные, загружаемые асинхронно
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // делать что-то при загрузке данных
  }
})
```

</div>
