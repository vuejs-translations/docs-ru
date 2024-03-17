---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Подробнее о реактивности {#reactivity-in-depth}

Одной из наиболее характерных особенностей Vue является ненавязчивая система реактивности. Состояние компонента состоит из реактивных JavaScript-объектов. Когда вы изменяете их, представление обновляется. Это делает управление состоянием простым и интуитивно понятным, но также важно понимать, как оно работает, чтобы избежать некоторых распространённых проблем. В этом разделе мы рассмотрим некоторые детали нижнего уровня системы реактивности Vue.

## Что такое реактивность? {#what-is-reactivity}

Этот термин довольно часто встречается в программировании, но что люди имеют в виду, когда говорят о нем? Реактивность - это парадигма программирования, которая позволяет нам адаптироваться к изменениям в декларативной форме. Канонический пример, который обычно показывают, потому что это отличный пример - электронная таблица Excel:

<SpreadSheet />

Здесь ячейка A2 определяется формулой `= A0 + A1` (для просмотра или редактирования формулы можно щелкнуть на A2), поэтому электронная таблица выдает нам 3. Ничего удивительного. Но если вы обновите A0 или A1, то заметите, что A2 тоже автоматически обновится.

JavaScript обычно так не работает. Если бы мы написали нечто подобное на JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // До сих пор 3
```

Когда мы мутируем `A0`, `A2` не меняется автоматически.

Итак, как бы мы сделали это в JavaScript? Во-первых, чтобы перезапустить код, обновляющий `A2`, обернем его в функцию:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Далее необходимо определить несколько понятий:

- Функция `update()` производит **побочный эффект**, или сокращенно **эффект**, поскольку изменяет состояние программы.

- `A0` и `A1` считаются **зависимостями** эффекта, так как их значения используются для выполнения эффекта. Считается, что эффект является **подписчиком** своих зависимостей.

Нам нужна волшебная функция, которая может вызывать `update()` (**эффект**) при каждом изменении `A0` или `A1` (**зависимость**):

```js
whenDepsChange(update)
```

Эта функция `whenDepsChange()` выполняет следующие задачи:

1. Отслеживание момента чтения переменной. Например, при вычислении выражения `A0 + A1`, считываются и `A0` и `A1`.

2. Если переменная считывается в момент выполнения эффекта, то следует сделать этот эффект подписчиком на эту переменную. Например, поскольку `A0` и `A1` считываются во время выполнения `update()` то после первого вызова `update()` становится подписчиком и `A0` и `A1`.

3. Определить, когда переменная мутирует. Например, когда переменной `A0` присваивается новое значение, уведомить все ее эффекты-подписчики о необходимости повторного выполнения.

## Как работает реактивность во Vue {#how-reactivity-works-in-vue}

Мы не можем отслеживать чтение и запись локальных переменных, как в примере. В обычном JavaScript для этого просто нет механизма. Но что мы **можем** сделать, так это перехватить чтение и запись **свойств объекта**.

Существует два способа перехвата доступа к свойствам в JavaScript: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) и [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Во Vue 2 геттеры / сеттеры использовались исключительно из-за ограничений поддержки браузерами. Во Vue 3 прокси используются для реактивных объектов, а геттеры / сеттеры - для ссылок. Вот псевдокод, иллюстрирующий их работу:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip Совет
Приведенные здесь и далее фрагменты кода призваны объяснить основные понятия в максимально простой форме, поэтому многие детали опускаются, а крайние случаи игнорируются.
:::

Это объясняет некоторые [ограничения реактивных объектов](/guide/essentials/reactivity-fundamentals#limitations-of-reactive), о которых мы говорили в разделе "Основы":

- Когда вы присваиваете или деструктурируете свойство реактивного объекта локальной переменной, реактивность "отключается", поскольку доступ к локальной переменной больше не вызывает срабатывания прокси-ловушек get / set.

- Возвращенный прокси из `reactive()`, хотя и ведет себя так же, как и исходный, имеет другую идентичность, если мы сравним его с исходным с помощью оператора `===`.

Внутри функции `track()` мы проверяем, есть ли в данный момент работающий эффект. Если он есть, то мы просматриваем эффекты-подписчики (хранящиеся в Set) для отслеживаемого свойства и добавляем эффект в Set:

```js
// Он будет установлен непосредственно перед
// запуском эффекта. Мы разберемся с этим позже.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Подписки на эффекты хранятся в глобальной структуре данных `WeakMap<target, Map<key, Set<effect>>>`. Если для свойства (отслеживаемого впервые) не было найдено ни одного набора эффектов-подписчиков, то он будет создан. Вот что, вкратце, делает функция `getSubscribersForProperty()`. Для простоты мы опустим ее подробности.

Внутри `trigger()`, мы снова ищем эффекты подписчика для этого свойства. Но на этот раз мы вызываем их:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Вернемся теперь к функции `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Она оборачивает функцию `update` в эффект, который перед выполнением обновления устанавливает себя в качестве текущего активного эффекта. Это позволяет вызывать функцию `track()` во время обновления для определения местоположения текущего активного эффекта.

На данном этапе мы создали эффект, который автоматически отслеживает свои зависимости и запускается заново при изменении зависимости. Мы называем его **реактивным эффектом**.

Vue предоставляет API, позволяющий создавать реактивные эффекты: [`watchEffect()`](/api/reactivity-core.html#watcheffect). Возможно, вы заметили, что она работает аналогично магической функции `whenDepsChange()` в примере. Теперь мы можем переделать исходный пример, используя реальные API Vue:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // отслеживаются A0 и A1
  A2.value = A0.value + A1.value
})

// срабатывает эффект
A0.value = 2
```

Использование реактивного эффекта для мутации ссылки не самый интересный вариант использования - на самом деле, использование вычисляемого свойства делает его более декларативным:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Внутри `computed` управляет его аннулированием и повторным вычислением с помощью реактивного эффекта.

Итак, что же является примером распространенного и полезного реактивного эффекта? Ну, обновление DOM! Мы можем реализовать простой "реактивный рендеринг" следующим образом:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `подсчет равен: ${count.value}`
})

// обноление DOM
count.value++
```

Фактически, это очень похоже на то, как компонент Vue поддерживает состояние и DOM в синхронизации - каждый экземпляр компонента создает реактивный эффект для рендеринга и обновления DOM. Конечно, компоненты Vue используют гораздо более эффективные способы обновления DOM, чем `innerHTML`. Это обсуждается в разделе [Механизм рендеринга](./rendering-mechanism).

<div class="options-api">

API `ref()`, `computed()` и `watchEffect()` являются частью Composition API. Если до сих пор вы использовали во Vue только Options API, то вы заметите, что Composition API ближе к тому, как работает система реактивности Vue под капотом. Фактически, во Vue 3 Options API реализован поверх Composition API. Все обращения к свойствам экземпляра компонента (`this`) вызывают геттеры / сеттеры для отслеживания реактивности, а такие опции, как `watch` и `computed`, вызывают свои эквиваленты Composition API изнутри.

</div>

## Реактивность во время выполнения и во время компиляции {#runtime-vs-compile-time-reactivity}

Система реактивности Vue в основном основана на времени выполнения: отслеживание и срабатывание происходит во время выполнения кода непосредственно в браузере. Плюсы реактивности во время выполнения заключаются в том, что она может работать без шага сборки, а также в меньшем количестве крайних случаев. С другой стороны, это делает ее ограниченной синтаксическими ограничениями JavaScript.

Некоторые фреймворки, например [Svelte](https://svelte.dev/), решают как преодолеть эти ограничения, реализуя реактивность во время компиляции. Он анализирует и преобразует код, чтобы имитировать реактивность. Этап компиляции позволяет фреймворку изменять семантику самого JavaScript - например, неявно внедрять код, выполняющий анализ зависимостей и срабатывание эффектов при доступе к локально определенным переменным. Недостатком является то, что такие преобразования требуют этапа сборки, а изменение семантики JavaScript - это, по сути, создание языка, который выглядит как JavaScript, но компилируется во что-то другое.

Команда Vue исследовала это направление с помощью экспериментальной функции под названием [Преобразование реактивности](/guide/extras/reactivity-transform), но в итоге мы решили, что она не подходит для проекта по причине [обоснование здесь](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Отладка реактивности {#reactivity-debugging}

Замечательно, что система реактивности Vue автоматически отслеживает зависимости, но в некоторых случаях мы можем захотеть выяснить, что именно отслеживается, или что вызывает повторный рендеринг компонента.

### Хуки для отладки компонентов {#component-debugging-hooks}

С помощью хуков жизненного цикла <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> и <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> можно отследить, какие зависимости используются при рендеринге компонента и какая зависимость вызывает обновление. Оба хука получают событие отладчика, содержащее информацию об используемой зависимости. Для интерактивной проверки зависимости рекомендуется поместить в обратные вызовы оператор `debugger`:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip Совет
Отладочные хуки компонентов работают только в режиме разработки.
:::

Объекты отладочных событий имеют следующий тип:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Отладка вычислений {#computed-debugging}

<!-- TODO options API equivalent -->

Мы можем отладить вычисляемые свойства, передав `computed()`второй объект параметров с обратными вызовами `onTrack` и `onTrigger`:

- `onTrack` вызывается, когда реактивное свойство или ссылка отслеживается как зависимость.
- `onTrigger` будет вызван, когда обратный вызов наблюдателя будет вызван мутацией зависимости.

Оба обратных вызова будут получать события отладчика [в том же формате](#debugger-event), что и отладочные хуки компонентов:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // срабатывает, когда count.value отслеживается как зависимость
    debugger
  },
  onTrigger(e) {
    // срабатывает при изменении значения count.value
    debugger
  }
})

// доступ plusOne, должен сработать onTrack
console.log(plusOne.value)

// мутация count.value, должна сработать onTrigger
count.value++
```

:::tip Совет
Вычисляемые параметры `onTrack` и `onTrigger` работают только в режиме разработки.
:::

### Отладка наблюдателя {#watcher-debugging}

<!-- TODO options API equivalent -->

Подобно `computed()`, наблюдатели также поддерживают опции `onTrack` и `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip Совет
Опции наблюдателя `onTrack` и `onTrigger` работают только в режиме разработки.
:::

## Интеграция с внешними системами состояний {#integration-with-external-state-systems}

Система реактивности Vue работает за счет глубокого преобразования обычных JavaScript-объектов в реактивные прокси. Глубокое преобразование может быть излишним, а иногда и нежелательным при интеграции с внешними системами управления состоянием (например, если внешнее решение также использует прокси).

Общая идея интеграции системы реактивности Vue с внешним решением по управлению состоянием заключается в том, чтобы хранить внешнее состояние в [`shallowRef`](/api/reactivity-advanced.html#shallowref). Неглубокий ref является реактивным только при обращении к его свойству `.value` - внутреннее значение остается нетронутым. Когда внешнее состояние изменяется, замените значение ref, чтобы вызвать обновление.

### Неизменяемые данные {#immutable-data}

Если вы реализуете функцию отмены/повтора, то, скорее всего, захотите делать снимок состояния приложения при каждом изменении пользователем. Однако мутабельная система реактивности Vue не очень хорошо подходит для этого, если дерево состояний велико, поскольку сериализация всего объекта состояния при каждом обновлении может быть дорогостоящей как с точки зрения затрат процессора, так и памяти.

[Неизменяемые структуры данных](https://en.wikipedia.org/wiki/Persistent_data_structure) решают эту проблему тем, что никогда не мутируют объекты состояния - вместо этого создаются новые объекты, которые имеют общие неизменяемые части со старыми. Существуют различные способы использования неизменяемых данных в JavaScript, но мы рекомендуем использовать [Immer](https://immerjs.github.io/immer/) вместе с Vue, поскольку он позволяет использовать неизменяемые данные, сохраняя при этом более эргономичный синтаксис с возможностью изменения.

Мы можем интегрировать Immer с Vue с помощью простой композиции:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### Конечные автоматы {#state-machines}

[Конечные автоматы](https://ru.wikipedia.org/wiki/Конечный_автомат) — это модель для описания всех возможных состояний, в которых может находиться приложение, и всех возможных способов перехода из одного состояния в другое. Хотя это может быть излишним для простых компонентов, это может помочь сделать сложные потоки состояний более надежными и управляемыми.

Одной из самых популярных реализаций конечного автомата в JavaScript является [XState](https://xstate.js.org/). Вот composable, интегрирующийся с ним:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) - это библиотека для работы с асинхронными потоками событий. Библиотека [VueUse](https://vueuse.org/) предоставляет надстройку [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) для соединения потоков RxJS с системой реактивности Vue.

## Подключение к сигналам {#connection-to-signals}

Довольно много других фреймворков внедрили реактивные примитивы, аналогичные ref-ссылкам из Composition API Vue, используя термин "сигналы":

- [Solid Сигналы](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Сигналы](https://angular.io/guide/signals)
- [Preact Сигналы](https://preactjs.com/guide/v10/signals/)
- [Qwik Сигналы](https://qwik.builder.io/docs/components/state/#usesignal)

По сути, сигналы представляют собой тот же реактивные примитивы, что и ref-ссылки во Vue. Это контейнер для значений, который обеспечивает отслеживание зависимостей при доступе и вызов побочных эффектов при изменении. Парадигма, основанная на таких реактивных примитивах, не является новым концептом в мире фронтенда: она уходит корнями на десятки лет назад в такие реализации, как [Knockout observables](https://knockoutjs.com/documentation/observables.html) и [Meteor Tracker](https://docs.meteor.com/api/tracker.html). Options API Vue и библиотека управления состоянием React [MobX](https://mobx.js.org/) также основаны на таких же принципах, но скрывают примитивы за свойствами объектов.

Хотя это не является обязательным свойством для того, чтобы что-то квалифицировалось как сигналы, сегодня эта концепция часто обсуждается в контексте модели рендеринга, где обновления выполняются через детальные подписки. Из-за использования виртуального DOM в настоящее время Vue [полагается на компиляторы для достижения подобных оптимизаций](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Тем не менее, мы также исследуем новую стратегию компиляции, вдохновленную Solid (режим Vapor), которая не зависит от виртуального DOM и более полно использует встроенную реактивную систему Vue.

### Компромисы дизайнов API {#api-design-trade-offs}

Дизайн сигналов в Preact и Qwik очень схож с [shallowRef](/api/reactivity-advanced#shallowref) во Vue: все три предоставляют изменяемый интерфейс через свойство `.value`. В данном контексте мы сосредоточимся на обсуждении сигналов в Solid и Angular.

#### Сигналы Solid {#solid-signals}

Дизайн API `createSignal()` в библиотеке Solid подчеркивает разделение операций чтения и записи. Сигналы представлены в виде доступа только для чтения через метод-геттер и отдельного метода для установки значений:

```js
const [count, setCount] = createSignal(0)

count() // доступ к значению
setCount(1) // изменение значения
```

Обратите внимание, что сигнал `count` может быть передан вниз без предоставления сеттера. Это гарантирует, что состояние никогда не может быть изменено, если сеттер также явно не предоставлен. Оправдывает ли эта гарантия безопасности более многословный синтаксис - вопрос, который может зависеть от требований проекта и личных предпочтений. Однако, если вам нравится такой стиль API, вы легко можете воссоздать его во Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Попробовать в песочнице](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Сигналы Angular {#angular-signals}

Angular проходит через некоторые фундаментальные изменения, отказываясь от механизма грязной проверки (dirty-checking) и вводя собственную реализацию реактивного примитива. API сигналов в Angular выглядит следующим образом:

```js
const count = signal(0)

count() // доступ к значению
count.set(1) // установка нового значения
count.update((v) => v + 1) // изменение значение, основанное на предыдущем
```

Опять же, мы можем легко повторить такое API во Vue:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Попробовать в песочнице](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

По сравнению с refs-ссылками во Vue, стиль API с использованием геттеров в Solid и Angular предоставляет интересные компромиссы при использовании в компонентах Vue:

- `()` менее понятнее, чем `.value`, но обновление является более понятным.
- Отсутствует автоматическое разворачивание ref-ссылок: доступ к значениям всегда требует использования `()`. Это обеспечивает последовательность доступа к значениям во всех местах. Также это означает, что вы можете передавать напрямую сигналы в чистом виде в качестве свойств компонента.

Вопрос о том, подходят ли вам эти стили API, в некотором смысле субъективен. Наша цель здесь - продемонстрировать основные сходства и компромиссы между разными дизайнами API. Мы также хотим показать, что Vue гибок: вы не привязаны к существующим API. Если это необходимо, вы можете создать свой собственный API для реактивности, чтобы лучше соответствовать конкретным потребностям.
