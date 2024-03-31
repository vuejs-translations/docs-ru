# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip Совет
Этот раздел предполагает наличие базовых знаний о Composition API. Если вы изучали Vue только с помощью Options API, вы можете переключить предпочтение API на Composition API (с помощью переключателя в верхней части левой боковой панели) и перечитать главы [Основы реактивности](/guide/essentials/reactivity-fundamentals.html) и [Хуки жизненного цикла](/guide/essentials/lifecycle.html).
:::

## Что такое "Composable"? {#what-is-a-composable}

В контексте приложений Vue "composable" функция — это функция, использующая Composition API Vue для инкапсуляции и повторного использования **логики с отслеживанием состояния**.

При создании интерфейсных приложений нам часто приходится повторно использовать логику для общих задач. Например, нам может понадобиться отформатировать даты во многих местах, поэтому мы извлекаем для этого повторно используемую функцию. Эта функция форматирования инкапсулирует **логику без сохранения состояния**: она принимает некоторый ввод и немедленно возвращает ожидаемый результат. Существует множество библиотек для повторного использования логики без сохранения состояния, например [lodash](https://lodash.com/) и [date-fns](https://date-fns.org/), о которых вы, возможно, слышали.

Напротив, логика с отслеживанием состояния включает в себя управление состоянием, которое изменяется с течением времени. Простым примером может быть отслеживание текущей позиции мыши на странице. В реальных сценариях это также может быть более сложная логика, такая как сенсорные жесты или статус подключения к базе данных.

## Пример отслеживания мыши {#mouse-tracker-example}

Если бы мы реализовали функцию отслеживания мыши с помощью Composition API непосредственно внутри компонента, то это выглядело бы следующим образом:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Положение мыши: {{ x }}, {{ y }}</template>
```

Но что, если мы хотим повторно использовать одну и ту же логику в нескольких компонентах? Мы можем извлечь логику во внешний файл как компонуемую функцию:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// по соглашению имена composables функций начинаются с "use"
export function useMouse() {
  // состояние, инкапсулированное и управляемое composable
  const x = ref(0)
  const y = ref(0)

  // composable может обновлять своё управляемое состояние с течением времени.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // composable объект также может подключаться к жизненному циклу своего
  // компонента-владельца для настройки и удаления побочных эффектов.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // представлять управляемое состояние в качестве возвращаемого значения
  return { x, y }
}
```

И вот как его можно использовать в компонентах:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Положение мыши: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Положение мыши: {{ x }}, {{ y }}
</div>

[Попробовать в песочнице](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Как видим, основная логика остаётся идентичной — всё, что нам нужно было сделать, это перенести ее во внешнюю функцию и вернуть состояние, которое должно быть открыто. Как и внутри компонента, в composables можно использовать весь набор [функций Composition API](/api/#composition-api). Та же функция `useMouse()` теперь может быть использована в любом компоненте.

Но самое интересное в composables - это возможность их вложения: одна composable функция может вызывать одну или несколько других composable функций. Это позволяет нам компоновать сложную логику с помощью небольших изолированных блоков, подобно тому, как мы компонуем целое приложение с помощью компонентов. Собственно, именно поэтому мы решили назвать набор API, позволяющих реализовать этот паттерн, Composition API.

Например, мы можем выделить логику добавления и удаления слушателя событий DOM в отдельный компонент:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // если вы хотите, вы также можете сделать так, чтобы
  // это поддерживало строки селектора в качестве цели
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

И теперь наша композиция composable `useMouse()` может быть упрощена до:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip Совет
Каждый экземпляр компонента, вызывающий `useMouse()`, будет создавать собственные копии состояния `x` и `y`, чтобы они не мешали друг другу. Если вы хотите управлять общим состоянием компонентов, прочитайте главу [Управление состоянием](/guide/scaling-up/state-management.html).
:::

## Пример асинхронного состояния {#async-state-example}

`useMouse()` не принимает никаких аргументов, поэтому рассмотрим другой пример, в котором он используется. При выполнении асинхронной выборки данных нам часто требуется обрабатывать различные состояния: загрузку, успех и ошибку:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Упс! Возникла ошибка: {{ error.message }}</div>
  <div v-else-if="data">
    Данные загружены:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Загрузка...</div>
</template>
```

Было бы утомительно повторять этот паттерн в каждом компоненте, которому необходимо получить данные. Давайте выделим его в composable:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Теперь в нашем компоненте мы можем просто сделать:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Передача реактивного состояния {#accepting-reactive-state}

`useFetch()` принимает статическую URL строку в качестве входных данных, поэтому запрос выполняется только один раз и затем завершается. А если мы хотим выполнять повторные запросы каждый раз, когда URL изменяется? Для достижения этой цели нам нужно передавать реактивное состояние в composable функцию, и далее она должна использовать наблюдателя, который будет отслеживать изменения состояния и выполнять нужное действие.

Например, `useFetch()` должен иметь возможность принимать ref-ссылку:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// это должно вызывать повторный запрос
url.value = '/new-url'
```

Или передать геттер-функцию:

```js
// повторно выполнить запрос при изменении props.id
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Мы можем рефакторить нашу существующую реализацию с помощью API [`watchEffect()`](/api/reactivity-core.html#watcheffect) и [`toValue()`](/api/reactivity-utilities.html#tovalue):

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // сброс состояния перед выполнением запроса..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` - это API, добавленное в версии 3.3. Оно предназначено для нормализации ref-ссылок или геттеров в значения. Если аргумент - это ref-ссылка, оно возвращает его значение; если аргумент - это функция, она вызывает функцию и возвращает ее возвращаемое значение. В противном случае оно возвращает аргумент как есть. Оно работает аналогично [`unref()`](/api/reactivity-utilities.html#unref), но с особой обработкой для функций.

Обратите внимание, что `toValue(url)` вызывается внутри коллбэка `watchEffect`. Это гарантирует, что все реактивные зависимости, к которым обращается при нормализации `toValue()`, будут отслеживаться наблюдателем.

В данной версии `useFetch()` теперь принимает статические строки URL, ref-ссылки и геттеры, что делает его гораздо более гибким. Эффект наблюдателя будет запущен сразу и будет отслеживать любые зависимости, к которым произошло обращение во время выполнения `toValue(url)`. Если зависимости не отслеживаются (например, url уже является строкой), эффект выполнится всего один раз; в противном случае он будет повторно запускаться при изменении отслеживаемой зависимости.

Вот [обновленная версия `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), с искусственной задержкой и рандомизированной ошибкой в демонстрационных целях.

## Соглашения и лучшие практики {#conventions-and-best-practices}

### Именование {#naming}

По соглашению composable функции называются именами в camelCase, которые начинаются с "use".

### Входные аргументы {#input-arguments}

Composable может принимать ref-аргументы, даже если он не полагается на них для обеспечения реактивности. Если вы пишете composable, который может быть использован другими разработчиками, то неплохо было бы предусмотреть случай, когда входными аргументами являются не сырые значения, а refs. Для этого пригодится служебная функция [`unref()`](/api/reactivity-utilities#unref):

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // Если maybeRefOrGetter является ref-ссылкой или геттером,
  // будет возвращено его нормализованное значение.
  // В противном случае, будет возвращено "как есть".
  const value = toValue(maybeRefOrGetter)
}
```

Если ваш composable создает реактивные эффекты, когда на вход подается ref-ссылка или геттер, убедитесь, что вы либо явно следите за ref-ссылкой/геттером с помощью `watch()`, либо вызываете `toValue()` внутри `watchEffect()`, чтобы отслеживание выполнялось правильно.

Рассмотренная ранее реализация [useFetch()](#accepting-reactive-state) представляет собой конкретный пример composable, принимающего в качестве входного аргумента ref-ссылки, геттеры и простые значения.

### Возвращаемые значения {#return-values}

Вы, наверное, заметили, что в composables мы используем исключительно `ref()` а не `reactive()`. Рекомендуется, чтобы composables всегда возвращали обычный нереактивный объект, содержащий несколько ссылок. Это позволяет деструктурировать его в компонентах, сохраняя реактивность:

```js
// x и y являются refs
const { x, y } = useMouse()
```

Возврат реактивного объекта из composable приведет к тому, что такие деструктуры потеряют связь реактивности с состоянием внутри composable, а refs сохранят эту связь.

Если вы предпочитаете использовать возвращаемое состояние из composables в качестве свойств объекта, вы можете обернуть возвращаемый объект с помощью `reactive()` так, чтобы refs были развернуты. Например:

```js
const mouse = reactive(useMouse())
// mouse.x связан с оригинальным ref
console.log(mouse.x)
```

```vue-html
Положение мыши: {{ mouse.x }}, {{ mouse.y }}
```

### Побочные эффекты {#side-effects}

Выполнять побочные эффекты (например, добавлять слушателей событий DOM или получать данные) в composables можно, но при этом следует обратить внимание на следующие правила:

- Если вы работаете над приложением, использующим [отрисовку на стороне сервера](/guide/scaling-up/ssr.html) (SSR), обязательно выполняйте побочные эффекты, специфичные для DOM, в хуках жизненного цикла после монтирования, например, `onMounted()`. Эти хуки вызываются только в браузере, поэтому вы можете быть уверены, что код, находящийся в них, имеет доступ к DOM.

- Не забывайте очищать побочные эффекты в `onUnmounted()`. Например, если компонент устанавливает слушатель событий DOM, он должен удалить этот слушатель в `onUnmounted()`, как мы видели в примере `useMouse()`. Хорошей идеей может быть использование composable, который автоматически делает это за вас, как пример `useEventListener()`.

### Ограничения в использовании {#usage-restrictions}

Composables должны вызываться только **синхронно** в `<script setup>` или в хуке `setup()`. В некоторых случаях их можно также вызывать в хуках жизненного цикла, например `onMounted()`.

Эти ограничения важны, потому что именно в этих контекстах Vue может определить текущий активный экземпляр компонента. Доступ к активному экземпляру компонента необходим для того, чтобы:

1. На него могут быть зарегистрированы хуки жизненного цикла.

2. Вычисляемые свойства и наблюдатели могут быть связаны с ним, чтобы их можно было утилизировать при размонтировании экземпляра для предотвращения утечек памяти.

:::tip Совет
`<script setup>` это единственное место, где можно вызывать composables **после** использования `await`. Компилятор автоматически восстанавливает активный контекст экземпляра после выполнения операции async.
:::

## Извлечение Composables для организации кода {#extracting-composables-for-code-organization}

Composables можно извлекать не только для повторного использования, но и для организации кода. По мере роста сложности компонентов вы можете столкнуться с тем, что они станут слишком большими для навигации и рассуждений. Composition API предоставляет вам полную гибкость для организации кода компонента в более мелкие функции на основе логических соображений:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

В некоторой степени эти извлеченные composables можно рассматривать как компонентно-копируемые сервисы, которые могут взаимодействовать друг с другом.

## Использование Composables в Options API {#using-composables-in-options-api}

Если вы используете Options API, то composables должны вызываться внутри `setup()`, а возвращаемые привязки должны быть возвращены из `setup()`, чтобы они были доступны для `this` и шаблона:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // Открытые свойства setup() могут быть доступны в `this`
    console.log(this.x)
  }
  // ...другие опции
}
```

## Сравнение с другими методами {#comparisons-with-other-techniques}

### vs. Примеси {#vs-mixins}

Пользователи, пришедшие из Vue 2, могут быть знакомы с опцией [mixins](/api/options-composition#mixins), которая также позволяет извлекать логику компонентов в виде многократно используемых блоков. У миксинов есть три основных недостатка:

1. **Неясный источник свойств**: при использовании большого количества миксинов становится непонятно, какое свойство экземпляра инжектируется каким миксином, что затрудняет отслеживание реализации и понимание поведения компонента. Именно поэтому мы рекомендуем использовать паттерн refs + деструктуризация для composables: это делает источник свойств ясным в потребляющих компонентах.

2. **Коллизии в пространстве имён**: несколько миксинов от разных авторов могут регистрировать одни и те же ключи свойств, что приводит к коллизиям в пространстве имён. При использовании composables можно переименовать деструктурированные переменные, если имеются конфликтующие ключи из разных composables.

3. **Неявное взаимодействие между миксинами**: несколько миксинов, которым необходимо взаимодействовать друг с другом, должны опираться на общие ключи свойств, что делает их неявно связанными. С помощью composables, значения, возвращаемые одним composable, могут передаваться в другой в качестве аргументов, как и в обычных функциях.

По указанным выше причинам мы больше не рекомендуем использовать миксины во Vue 3. Эта возможность сохраняется только для миграции и ознакомления.

### vs. Renderless компоненты {#vs-renderless-components}

В главе, посвященной слотам компонентов, мы обсудили паттерн [Компонент без рендеринга](/guide/components/slots#renderless-components), основанный на слотах с ограниченной областью видимости. Мы даже реализовали тот же демонстрационный пример отслеживания мыши с использованием компонентов без рендеринга.

Основное преимущество composables перед компонентами без рендеринга заключается в том, что composables не несут дополнительных затрат на создание экземпляров компонентов. При использовании во всём приложении количество дополнительных экземпляров компонентов, создаваемых шаблоном компонентов без рендеринга, может стать заметным снижением производительности.

Рекомендуется использовать composables при повторном использовании чистой логики и компоненты при повторном использовании как логики, так и визуальной компоновки.

### vs. React хуки {#vs-react-hooks}

Если у вас есть опыт работы с React, вы можете заметить, что это очень похоже на пользовательские хуки React. Composition API был частично вдохновлен хуками React, и Vue composables действительно похожи на хуки React с точки зрения возможностей логической композиции. Однако, Vue composables основаны на мелкозернистой системе реактивности, которая принципиально отличается от модели выполнения хуков React. Более подробно этот вопрос рассматривается в [FAQ по Composition API](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Дополнительное чтение {#further-reading}

- [Реактивность в деталях](/guide/extras/reactivity-in-depth.html): для низкоуровневого понимания того, как работает система реактивности Vue.
- [Управление состоянием](/guide/scaling-up/state-management.html): для моделей управления состоянием, разделяемым несколькими компонентами.
- [Тестирование Composables](/guide/scaling-up/testing#testing-composables): советы по модульному тестированию composables.
- [VueUse](https://vueuse.org/): постоянно растущая коллекция composables элементов Vue. Исходный код также является отличным обучающим ресурсом.
