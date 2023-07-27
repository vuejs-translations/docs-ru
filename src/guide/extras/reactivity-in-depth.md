---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Подробнее о реактивности {#reactivity-in-depth}

Одной из наиболее характерных особенностей Vue является ненавязчивая система реактивности. Состояние компонента состоит из реактивных JavaScript-объектов. Когда вы изменяете их, представление обновляется. Это делает управление состоянием простым и интуитивно понятным, но также важно понимать, как оно работает, чтобы избежать некоторых распространенных проблем. В этом разделе мы рассмотрим некоторые детали нижнего уровня системы реактивности Vue.

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

## Как работает реактивность в Vue {#how-reactivity-works-in-vue}

Мы не можем отслеживать чтение и запись локальных переменных, как в примере. В обычном JavaScript для этого просто нет механизма. Но что мы **можем** сделать, так это перехватить чтение и запись **свойств объекта**.

Существует два способа перехвата доступа к свойствам в JavaScript: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) и [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). В Vue 2 геттеры / сеттеры использовались исключительно из-за ограничений поддержки браузерами. В Vue 3 прокси используются для реактивных объектов, а геттеры / сеттеры - для ссылок. Вот псевдокод, иллюстрирующий их работу:

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

Это объясняет некоторые [ограничения реактивных объектов](/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive), о которых мы говорили в разделе "Основы":

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

API `ref()`, `computed()` и `watchEffect()` являются частью Composition API. Если до сих пор вы использовали в Vue только Options API, то вы заметите, что Composition API ближе к тому, как работает система реактивности Vue под капотом. Фактически, в Vue 3 Options API реализован поверх Composition API. Все обращения к свойствам экземпляра компонента (`this`) вызывают геттеры / сеттеры для отслеживания реактивности, а такие опции, как `watch` и `computed`, вызывают свои эквиваленты Composition API изнутри.

</div>

## Реактивность во время выполнения и во время компиляции {#runtime-vs-compile-time-reactivity}

Система реактивности Vue в основном основана на времени выполнения: отслеживание и срабатывание происходит во время выполнения кода непосредственно в браузере. Плюсы реактивности во время выполнения заключаются в том, что она может работать без шага сборки, а также в меньшем количестве крайних случаев. С другой стороны, это делает ее ограниченной синтаксическими ограничениями JavaScript.

Мы уже столкнулись с этим ограничением в предыдущем примере: JavaScript не предоставляет нам возможности перехватить чтение и запись локальных переменных, поэтому мы вынуждены всегда обращаться к реактивному состоянию как к свойствам объекта, используя либо реактивные объекты, либо рефссылки.

Мы экспериментировали с функцией [Reactivity Transform](/guide/extras/reactivity-transform.html) чтобы уменьшить многословность кода:

```js
let A0 = $ref(0)
let A1 = $ref(1)

// отслеживание переменной при чтении
const A2 = $computed(() => A0 + A1)

// срабатывание при записи в переменную
A0 = 2
```

Этот фрагмент компилируется в то, что мы написали бы без трансформации, автоматически добавляя `.value` после ссылок на переменные. С помощью Reactivity Transform система реактивности Vue становится гибридной.

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
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Попробовать в песочнице](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZUltbWVyIH0gZnJvbSAnLi9pbW1lci5qcydcbiAgXG5jb25zdCBbaXRlbXMsIHVwZGF0ZUl0ZW1zXSA9IHVzZUltbWVyKFtcbiAge1xuICAgICB0aXRsZTogXCJMZWFybiBWdWVcIixcbiAgICAgZG9uZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgIHRpdGxlOiBcIlVzZSBWdWUgd2l0aCBJbW1lclwiLFxuICAgICBkb25lOiBmYWxzZVxuICB9XG5dKVxuXG5mdW5jdGlvbiB0b2dnbGVJdGVtKGluZGV4KSB7XG4gIHVwZGF0ZUl0ZW1zKGl0ZW1zID0+IHtcbiAgICBpdGVtc1tpbmRleF0uZG9uZSA9ICFpdGVtc1tpbmRleF0uZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWZvcj1cIih7IHRpdGxlLCBkb25lIH0sIGluZGV4KSBpbiBpdGVtc1wiXG4gICAgICAgIDpjbGFzcz1cInsgZG9uZSB9XCJcbiAgICAgICAgQGNsaWNrPVwidG9nZ2xlSXRlbShpbmRleClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICA8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmRvbmUge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJpbW1lclwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2ltbWVyQDkuMC43L2Rpc3QvaW1tZXIuZXNtLmpzP21vZHVsZVwiXG4gIH1cbn0iLCJpbW1lci5qcyI6ImltcG9ydCBwcm9kdWNlIGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltbWVyKGJhc2VTdGF0ZSkge1xuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYoYmFzZVN0YXRlKVxuICBjb25zdCB1cGRhdGUgPSAodXBkYXRlcikgPT4ge1xuICAgIHN0YXRlLnZhbHVlID0gcHJvZHVjZShzdGF0ZS52YWx1ZSwgdXBkYXRlcilcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHVwZGF0ZV1cbn0ifQ==)

### State Machines {#state-machines}

[Конечные автоматы](https://en.wikipedia.org/wiki/Finite-state_machine)— это модель для описания всех возможных состояний, в которых может находиться приложение, и всех возможных способов перехода из одного состояния в другое. Хотя это может быть излишним для простых компонентов, это может помочь сделать сложные потоки состояний более надежными и управляемыми.

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

[Попробовать в песочнице](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICcuL21hY2hpbmUuanMnXG4gIFxuY29uc3QgW3N0YXRlLCBzZW5kXSA9IHVzZU1hY2hpbmUoe1xuICBpZDogJ3RvZ2dsZScsXG4gIGluaXRpYWw6ICdpbmFjdGl2ZScsXG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7IG9uOiB7IFRPR0dMRTogJ2FjdGl2ZScgfSB9LFxuICAgIGFjdGl2ZTogeyBvbjogeyBUT0dHTEU6ICdpbmFjdGl2ZScgfSB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cInNlbmQoJ1RPR0dMRScpXCI+XG4gICAge3sgc3RhdGUubWF0Y2hlcyhcImluYWN0aXZlXCIpID8gXCJPZmZcIiA6IFwiT25cIiB9fVxuICA8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ4c3RhdGVcIjogXCJodHRwczovL3VucGtnLmNvbS94c3RhdGVANC4yNy4wL2VzL2luZGV4LmpzP21vZHVsZVwiXG4gIH1cbn0iLCJtYWNoaW5lLmpzIjoiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgaW50ZXJwcmV0IH0gZnJvbSAneHN0YXRlJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1hY2hpbmUob3B0aW9ucykge1xuICBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShvcHRpb25zKVxuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYobWFjaGluZS5pbml0aWFsU3RhdGUpXG4gIGNvbnN0IHNlcnZpY2UgPSBpbnRlcnByZXQobWFjaGluZSlcbiAgICAub25UcmFuc2l0aW9uKChuZXdTdGF0ZSkgPT4gKHN0YXRlLnZhbHVlID0gbmV3U3RhdGUpKVxuICAgIC5zdGFydCgpXG4gIGNvbnN0IHNlbmQgPSAoZXZlbnQpID0+IHNlcnZpY2Uuc2VuZChldmVudClcblxuICByZXR1cm4gW3N0YXRlLCBzZW5kXVxufSJ9)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) - это библиотека для работы с асинхронными потоками событий. Библиотека [VueUse](https://vueuse.org/) предоставляет надстройку [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) для соединения потоков RxJS с системой реактивности Vue.
