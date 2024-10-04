# Реактивность: Основное {#reactivity-api-core}

:::info См. также
Чтобы лучше понять основы реактивности, рекомендуется прочитать следующие разделы руководства:

- [Основы реактивности](/guide/essentials/reactivity-fundamentals) (с предпочтением API, установленным на Composition API)
- [Подробнее о реактивности](/guide/extras/reactivity-in-depth)
:::

## ref() {#ref}

Принимает внутреннее значение и возвращает реактивный и мутабельный ref-объект, который имеет единственное свойство `.value`, указывающее на внутреннее значение.

- **Тип**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Подробности**

  ref-объект является мутабельным, т.е. ему можно присваивать новые значения `.value`. Он также является реактивным, это значит, что любые операции чтения `.value` отслеживаются, а операции записи вызывают соответствующие эффекты.

  Если в качестве значения ref-объекта передается объект, то он становится глубоко реактивным с помощью функции [reactive()](#reactive). Это также означает, что если объект содержит вложенные ссылки, то они будут глубоко развернуты.

  Чтобы избежать глубокой реактивности, используйте вместо этого [`shallowRef()`](./reactivity-advanced#shallowref)

- **Пример**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **См. также**
  - [Руководство — Реактивные переменные `ref()`](/guide/essentials/reactivity-fundamentals#reactive-variables-with-ref)
  - [Руководство — Типизация `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />


## computed() {#computed}

Принимает [геттер функцию](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) и возвращает иммутабельный (доступен только для чтения) реактивный [ref-объект](#ref) для возвращаемого значения из геттера. Также можно вернуть объект, используя функции `get` и `set` для создания ref-объекта с возможностью записи.

- **Тип**

  ```ts
  // только для чтения
  function computed<T>(

    getter: (oldValue: T | undefined) => T,
    // см. ссылку "Отладка вычисляемых свойств" ниже
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // с возможностью записи
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Пример**

  Создание вычисляемого ref-объекта только для чтения:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // ошибка
  ```

  Создание вычисляемого ref-объекта с возможностью записи:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Отладка:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **См. также**
  - [Руководство — Вычисляемые свойства](/guide/essentials/computed)
  - [Руководство — Отладка вычисляемых свойств](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Руководство — Типизация `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [Руководство — Производительность — Стабильность у computed свойств](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Возвращает реактивную копию объекта.

- **Тип**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Подробности**

  Реактивное преобразование является "глубоким": оно влияет на все вложенные свойства. Реактивный объект также глубоко развертывает любые свойства, которые являются [ref-объектами](#ref), сохраняя реактивность.

  Следует также отметить, что развертывание ref-объекта не выполняется, когда к нему обращаются как к элементу реактивного массива или нативной коллекции, например `Map`.

  Чтобы избежать глубокого преобразования и сохранить реактивность только на корневом уровне, используйте вместо этого [shallowReactive()](./reactivity-advanced#shallowreactive).

  Возвращаемый объект и его вложенные объекты обёрнуты в [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) и **не** равны исходным объектам. Рекомендуется работать исключительно с реактивным прокси объектом и не полагаться на исходный объект.

- **Пример**

  Создание реактивного объекта:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Развертывание ref-объекта:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref-объект будет развернут
  console.log(obj.count === count.value) // true

  // это также обновит `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // это также обновит ref-объект count
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Обратите внимание, что рефссылки **не** разворачиваются при обращении к ним как к элементам массива или коллекции:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // здесь необходимо обращаться через .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // здесь необходимо обращаться через .value
  console.log(map.get('count').value)
  ```

  При назначении [ref](#ref) свойству `reactive` эта ссылка также будет автоматически развернута:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **См. также**
  - [Руководство — Основы реактивности](/guide/essentials/reactivity-fundamentals)
  - [Руководство — Типизация `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Принимает объект (реактивный или обычный) или [ref-объект](#ref) и возвращает доступную только для чтения прокси к оригиналу.

- **Тип**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Подробности**

  Прокси readonly является глубоким: все вложенные свойства, к которым осуществляется доступ, также будут доступны только для чтения. Он также имеет такое же поведение при разворачивании, как и `reactive()`, за исключением того, что разворачиваемые значения также становятся доступны только для чтения.

  Чтобы избежать глубокого разворачивания, используйте вместо этого [shallowReadonly()](./reactivity-advanced#shallowreadonly).

- **Пример**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // работает для отслеживания реактивности
    console.log(copy.count)
  })

  // изменения оригинала приведет к срабатыванию наблюдателей, полагающихся на копию
  original.count++

  // изменение копии завершится неудачей и выдаст предупреждение
  copy.count++ // предупреждение!
  ```

## watchEffect() {#watcheffect}

Немедленно запускает функцию, отслеживая её зависимости с помощью системы реактивности, а затем повторно вызывает лишь при изменении этих зависимостей.

- **Тип**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // по умолчанию: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // callable, same as `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Подробности**

  Первый аргумент - функция эффекта, которую вы хотите запустить. Функция эффекта это функция, которую можно использовать для регистрации обратного вызова очистки. Обратный вызов очистки будет вызван непосредственно перед следующим повторным запуском эффекта и может использоваться для очистки недействительных сайд эффектов, например, ожидаемый асинхронный запрос (см. пример ниже).

  Второй аргумент - необязательный объект параметров, который может быть использован для настройки времени срабатывания эффекта или для отладки зависимостей эффекта.

  По умолчанию наблюдатели запускаются непосредственно перед рендерингом компонента. Установка значения `flush: 'post'` отложит выполнение наблюдателя до окончания рендеринга компонента. Более подробная информация приведена в разделе [Время срабатывания](/guide/essentials/watchers#callback-flush-timing). В редких случаях может потребоваться немедленный запуск наблюдателя при изменении реактивной зависимости, например, при инвалидации кэша. Этого можно добиться, используя `flush: 'sync'`. Однако эту настройку следует использовать с осторожностью, поскольку она может привести к проблемам с производительностью и согласованностью данных при одновременном обновлении нескольких свойств.

  Возвращаемое значение является функцией обработчика, которую можно вызвать, чтобы остановить повторный запуск эффекта.

- **Пример**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> выведет 0

  count.value++
  // -> выведет 1
  ```

  Остановка наблюдателя:

  ```js
  const stop = watchEffect(() => {})

  // когда наблюдатель больше не нужен:
  stop()
  ```

  Пауза / продолжение наблюдения: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // временно поставить наблюдатель на паузу
  pause()

  // возобновить наблюдение
  resume()

  // остановить наблюдатель
  stop()
  ```

  Очистка сайд эффекта:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван при изменении `id`, отменит
    // предыдущий запрос, если он еще не был выполнен
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Очистка сайд эффекта в версии 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
   // `cancel` будет вызван при изменении `id`, отменит
    // предыдущий запрос, если он еще не был выполнен
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Параметры:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **См. также**
  - [Руководство — Наблюдатели](/guide/essentials/watchers)
  - [Руководство — Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Псевдоним для [`watchEffect()`](#watcheffect) с параметром `flush: 'post'`.

## watchSyncEffect() {#watchsynceffect}

Псевдоним для [`watchEffect()`](#watcheffect) с параметром `flush: 'sync'`.

## watch() {#watch}

Наблюдает за одним или несколькими реактивными источниками данных и вызывает функцию обратного вызова при их изменении.

- **Тип**

  ```ts
  // отслеживание одного источника
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // отслеживание нескольких источников
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // геттер
    | (T extends object ? T : never) // реактивный объект

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // по умолчанию: false
    deep?: boolean | number // по умолчанию: false
    flush?: 'pre' | 'post' | 'sync' // по умолчанию: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // по умолчанию: false (3.4+)
  }

  interface WatchHandle {
    (): void // callable, same as `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Типы упрощены для удобства чтения.

- **Подробности**

  По умолчанию `watch()` является отложенным (англ. lazy) - т.е. обратный вызов вызывается только тогда, когда наблюдаемый источник изменился.

  Первым аргументом является **источник** наблюдателя. Источник может быть одним из следующих:

  - Геттер, возвращающий значение
  - ref-объект
  - Реактивный объект
  - ...или массив из перечисленных выше.

  Второй аргумент - обратный вызов, который будет вызван при изменении источника. Обратный вызов получает три аргумента: новое значение, старое значение и функцию для регистрации обратного вызова очистки сайд эффектов. Обратный вызов очистки будет вызван непосредственно перед следующим повторным запуском эффекта и может быть использован для очистки устаревших сайд эффектов, например, отложенного async-запроса.

  При просмотре нескольких источников обратный вызов получает два массива, содержащих новые/старые значения, соответствующие массиву источника.

  Третий необязательный аргумент представляет собой объект параметров, поддерживающий следующие настройки:

  - **`immediate`**: запуск обратного вызова сразу при создании наблюдателя. При первом вызове старое значение будет `undefined`.
  - **`deep`**: принудительный глубокий обход источника, если он является объектом, чтобы обратный вызов срабатывал при глубоких изменениях. В версии 3.5+ это также может быть число, указывающее максимальную глубину обхода. См. раздел [Глубокие наблюдатели](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: настройка времени срабатывания обратного вызова. Смотрите [Время срабатывания](/guide/essentials/watchers#callback-flush-timing) и [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: отладка зависимостей наблюдателя. См. раздел [Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`**: (3.4+) запустить обратный вызов только один раз. Наблюдатель автоматически останавливается после первого выполнения обратного вызова. <sup class="vt-badge" data-text="3.4+" />

  По сравнению с [`watchEffect()`](#watcheffect), `watch()` позволяет нам:

  - Выполнять сайд эффект отложено;
  - Более точно определить, какое состояние должно вызывать повторный запуск наблюдателя;
  - Получить доступ как к предыдущему, так и к текущему значению наблюдаемого состояния.

- **Пример**

  Отслеживание геттера

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Отслеживание ref-объекта:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  При просмотре нескольких источников обратный вызов получает массивы, содержащие новые/старые значения, соответствующие массиву источника:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  При использовании в качестве источника геттер, наблюдатель срабатывает только в случае изменения возвращаемого значения геттера. Если вы хотите, чтобы обратный вызов срабатывал даже при глубоких изменениях, необходимо явно перевести наблюдатель в режим глубокого отслеживания с помощью `{ deep: true }`. Обратите внимание, что в этом режиме новое значение и старое будут одним и тем же объектом, если обратный вызов был вызван глубоким изменением:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  При прямом наблюдении за реактивным объектом наблюдатель автоматически переходит в режим глубокого отслеживания:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* срабатывает при глубоком изменении состояния */
  })
  ```

  `watch()` имеет общие с [`watchEffect()`](#watcheffect) параметры времени срабатывания и отладки:

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Остановка наблюдателя:

  ```js
  const stop = watch(source, callback)

  // когда наблюдатель больше не нужен:
  stop()
  ```

  Пауза / продолжение наблюдения: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // временно поставить наблюдатель на паузу
  pause()

  // возобновить наблюдение
  resume()

  // остановить наблюдатель
  stop()
  ```

  Очистка сайд эффекта:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван при изменении `id`, отменит
    // предыдущий запрос, если он еще не был выполнен
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Очистка сайд эффекта в версии 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **См. также**

  - [Руководство — Наблюдатели](/guide/essentials/watchers)
  - [Руководство — Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging)


## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Регистрирует функцию очистки, которая будет выполняться, когда текущий наблюдатель собирается повторно запуститься. Может вызываться только во время синхронного выполнения функции эффекта `watchEffect` или функции обратного вызова `watch` (т.е. не может быть вызван после оператора `await` в асинхронной функции).

- **Тип**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Пример**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван при изменении `id`, отменит
    // предыдущий запрос, если он еще не был выполнен
    onWatcherCleanup(cancel)
  })
  ```
