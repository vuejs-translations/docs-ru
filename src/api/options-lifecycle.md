# Опции: Жизненный цикл {#options-lifecycle}

:::info См. также
Чтобы узнать о совместном использовании хуков жизненного цикла, прочтите [Руководство — Хуки жизненного цикла](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Вызывается при инициализации экземпляра.

- **Тип**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Вызывается сразу после инициализации экземпляра и разрешения реквизитов.

  Затем входные параметры будут определены как реактивные свойства и будет установлено состояние, такое как `data()` или `computed`.

  Обратите внимание, что хук `setup()` API Composition вызывается раньше всех хуков API Options, даже `beforeCreate()`.

## created {#created}

Вызывается после того, как экземпляр завершил обработку всех опций, связанных с состоянием.

- **Тип**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  При вызове этого хука уже настроены: реактивные данные, вычисляемые свойства, методы и наблюдатели. Однако этап монтирования еще не начался, и свойство `$el` пока не будет доступно.

## beforeMount {#beforemount}

Вызывается непосредственно перед монтированием компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Когда вызывается этот хук, компонент завершил установку своего реактивного состояния, но ни один из узлов DOM еще не был создан. Он собирается впервые выполнить свой эффект рендеринга DOM.

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

## mounted {#mounted}

Вызывается после того, как компонент был смонтирован.

- **Тип**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Компонент считается смонтированным после:

  - Все его синхронные дочерние компоненты были смонтированы (не включая асинхронные компоненты или компоненты внутри деревьев `<Suspense>`).

  - Его собственное DOM-дерево было создано и вставлено в родительский контейнер. Обратите внимание, что DOM-дерево компонента находится в документе только в том случае, если корневой контейнер приложения также находится в документе.

  Этот хук обычно используется для выполнения сайд эффектов, требующих доступа к отрисованному DOM дереву компонента, или для ограничения кода, связанного с DOM, на клиенте в [server-rendered application](/guide/scaling-up/ssr).

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

## beforeUpdate {#beforeupdate}

Вызывается непосредственно перед тем, как компонент собирается обновить своё DOM-дерево в результате изменения реактивного состояния.

- **Тип**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Этот хук можно использовать для доступа к состоянию DOM до того, как Vue обновит DOM. Также, изменять состояние компонента внутри этого хука безопасно.

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

## updated {#updated}

Вызывается после того, как компонент обновил своё DOM-дерево в результате изменения реактивного состояния.

- **Тип**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Хук updated родительского компонента вызывается после обновления дочерних компонентов.

  Этот хук вызывается после любого обновления DOM компонента, которое может быть вызвано различными изменениями состояния. Если вам необходимо получить доступ к обновленному DOM после конкретного изменения состояния, используйте вместо этого [nextTick()](/api/general#nexttick).

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

  :::warning Предупреждение
  Не изменяйте состояние компонента в хуке updated - это может привести к бесконечному циклу обновления!
  :::

## beforeUnmount {#beforeunmount}

Вызывается непосредственно перед тем, как экземпляр компонента должен быть размонтирован.

- **Тип**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  При вызове этого хука экземпляр компонента остается полностью работоспособным.

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

## unmounted {#unmounted}

Вызывается после того, как компонент был размонтирован.

- **Тип**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Подробности**

  Компонент считается размонтированным после того, как:

  - Все его дочерние компоненты были размонтированы.

  - Все связанные с ним реактивные эффекты (эффект отрисовки и эффекты вычисляемых свойств / наблюдателей, созданные в процессе `setup()`) были остановлены.

  Используйте этот хук для очистки созданных вручную сайд эффектов, таких как: таймеры, слушатели DOM событий, соединения с сервером.

  **Этот хук не вызывается во время отрисовки на стороне сервера.**

## errorCaptured {#errorcaptured}

Вызывается, если была перехвачена ошибка, распространяющаяся от компонента-потомка.

- **Тип**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
  ```

- **Подробности**

  Ошибки могут быть получены из следующих источников:

  - Отрисовка компонента
  - Слушатели событий
  - Хуки жизненного цикла
  - функция `setup()`
  - Наблюдатели
  - Хуки пользовательских директив
  - Хуки transition

  Хук получает три аргумента: ошибку, экземпляр компонента, вызвавшего ошибку, и информационную строку, указывающую тип источника ошибки.

  :::tip Совет
  В продакшене 3-й аргумент (`info`) будет представлять собой сокращённый код вместо полной информационной строки. Сопоставление кода и строки можно найти в разделе [Руководстве по кодам ошибок](/error-reference/#runtime-errors).
  :::

  Для отображения состояния ошибки пользователю можно модифицировать состояние компонента в `errorCaptured()`. Однако важно, чтобы в состоянии ошибки не отображалось исходное содержимое, вызвавшее ошибку, иначе компонент будет брошен в бесконечный цикл отрисовки.

  Хук может возвращать `false`, чтобы остановить дальнейшее распространение ошибки. Подробнее о распространении ошибок см. ниже.

  **Правила распространения ошибок**

  - По умолчанию все ошибки по-прежнему отправляются на уровень приложения [`app.config.errorHandler`](/api/application#app-config-errorhandler), если он определен, так что эти ошибки по-прежнему могут быть сообщены аналитическому сервису в одном месте.

  - Если в цепочке наследования или родительской цепочке компонента существует несколько хуков `errorCaptured`, то все они будут вызваны при одной и той же ошибке в порядке снизу вверх. Это похоже на механизм "всплытия" (от англ. bubbling) нативных событий DOM.

  - Если сам хук `errorCaptured` выбрасывает ошибку и эта ошибка, и исходная захваченная отправляются в `app.config.errorHandler`.

  - Хук `errorCaptured` может возвращать значение `false`, чтобы предотвратить дальнейшее распространение ошибки. По сути, это означает, что "эта ошибка была обработана и должна быть проигнорирована". Это предотвратит вызов дополнительных хуков `errorCaptured` или `app.config.errorHandler` для этой ошибки.

  **Error Capturing Caveats**
  
  - In components with async `setup()` function (with top-level `await`) Vue **will always** try to render component template, even if `setup()` throwed error. This will likely cause more errors because during render component's template might try to access non-existing properties of failed `setup()` context. When capturing errors in such components, be ready to handle errors from both failed async `setup()` (they will always come first) and failed render process.

  - <sup class="vt-badge" data-text="SSR only"></sup> Replacing errored child component in parent component deep inside `<Suspense>` will cause hydration mismatches in SSR. Instead, try to separate logic that can possibly throw from child `setup()` into separate function and execute it in the parent component's `setup()`, where you can safely `try/catch` the execution process and make replacement if needed before rendering the actual child component.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Вызывается, когда реактивная зависимость была отслежена эффектом отрисовки компонента.

**Этот хук предназначен только для разработки и не вызывается при рендеринге на стороне сервера.**

- **Тип**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **См. также** [Подробнее о реактивности](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Вызывается, когда реактивная зависимость вызывает повторный запуск эффекта рендеринга компонента.

**Этот хук предназначен только для разработки и не вызывается при рендеринге на стороне сервера.**

- **Тип**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **См. также** [Подробнее о реактивности](/guide/extras/reactivity-in-depth)

## activated {#activated}

Вызывается после вставки экземпляра компонента в DOM как части дерева, кэшируемого при помощи [`<KeepAlive>`](/api/built-in-components#keepalive).

**Этот хук не вызывается во время отрисовки на стороне сервера.**

- **Тип**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **См. также** [Руководство — Жизненный цикл кэшированного экземпляра](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Вызывается после удаления экземпляра компонента из DOM как части дерева, кэшируемого при помощи [`<KeepAlive>`](/api/built-in-components#keepalive).

**Этот хук не вызывается во время отрисовки на стороне сервера.**

- **Тип**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **См. также** [Руководство — Жизненный цикл кэшированного экземпляра](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Асинхронная функция, которая должна быть разрешена перед отрисовкой экземпляра компонента на сервере.

- **Тип**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Подробности**

  Если хук возвращает Promise, то серверный рендерер будет ждать разрешения Promise перед отрисовкой компонента.

  Этот хук вызывается только во время отрисовки на стороне сервера и может быть использован получения данных только на стороне сервера.

  Этот хук вызывается только во время рендеринга на стороне сервера и может использоваться для выборки данных только на сервере.

- **Пример**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // компонент отображается как часть первоначального запроса
      // предварительное получение данных на сервере происходит быстрее, чем на клиенте
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // если при монтировании данные равны null, это означает, что компонент
        // динамически отображается на клиенте. Вместо этого выполните
        // получение данных на стороне клиента.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **См. также** [Отрисовка на стороне сервера](/guide/scaling-up/ssr)
