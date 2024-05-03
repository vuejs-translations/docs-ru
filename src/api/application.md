# Application API {#application-api}

## createApp() {#createapp}

Создаёт экземпляр приложения.

- **Тип**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Подробности**

  Первым аргументом является корневой компонент. Вторым необязательным аргументом являются входные параметры, которые должны быть переданы корневому компоненту.

- **Пример**

  Со встроенным корневым компонентом:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* параметры корневого компонента */
  })
  ```

  С импортируемым компонентом:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **См. также** [Руководство — Создание Vue приложения](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Создаёт экземпляр приложения в режиме [SSR Hydration](/guide/scaling-up/ssr#client-hydration). Используется точно так же, как `createApp()`.

## app.mount() {#app-mount}

Монтирует экземпляр приложения в элемент контейнера.

- **Тип**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Подробности**

  Аргумент может быть либо фактическим элементом DOM, либо селектором CSS (будет использоваться первый соответствующий элемент). Аргумент вернет корневой экземпляр компонента.

  Если для компонента определен шаблон или функция рендеринга, он заменит все существующие узлы DOM внутри контейнера. В противном случае, если доступен runtime компилятор, в качестве шаблона будет использоваться `innerHTML`.

  В режиме гидратации SSR гидратирует существующие узлы DOM внутри контейнера. Если имеются [несоответствия](/guide/scaling-up/ssr#hydration-mismatch), существующие узлы DOM будут изменены, чтобы соответствовать ожидаемому результату.

  Следует отметить, что для каждого экземпляра приложения `mount()` может быть вызван только один раз.

- **Пример**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Может также монтироваться к фактическому DOM элементу:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Размонтирует смонтированный экземпляр приложения, запуская хуки жизненного цикла размонтирования для всех компонентов в дереве компонентов приложения.

- **Тип**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.component() {#app-component}

Регистрирует глобальный компонент, если передается строка имени и определение компонента, или возвращает уже зарегистрированный компонент, если передается только имя.

- **Тип**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // регистрация с объектом настроек
  app.component('my-component', {
    /* ... */
  })

  // получение зарегистрированного компонента
  const MyComponent = app.component('my-component')
  ```

- **См. также** [Регистрация компонента](/guide/components/registration)

## app.directive() {#app-directive}

Регистрирует глобальную пользовательскую директиву, если передается строка имени и определение директивы, или извлекает уже зарегистрированную, если передается только имя.

- **Тип**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // регистрация (объект директивы)
  app.directive('my-directive', {
    /* хуки директивы */
  })

  // регистрация (определение директивы с помощью функции)
  app.directive('my-directive', () => {
    /* ... */
  })

  // получение зарегистрированной директивы
  const myDirective = app.directive('my-directive')
  ```

- **См. также** [Пользовательские директивы](/guide/reusability/custom-directives)

## app.use() {#app-use}

Установка [плагина](/guide/reusability/plugins).

- **Тип**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Подробности**

  В качестве первого аргумента ожидается плагин, а в качестве второго — необязательные параметры плагина.

  Плагин может быть как объектом с методом `install()`, так и просто функцией, которая будет использоваться в качестве метода `install()`. Параметры (второй аргумент `app.use()`) будут переданы методу `install()` плагина.

  Если `app.use()` вызывается для одного и того же плагина несколько раз, то плагин будет установлен только один раз.

- **Пример**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **См. также** [Плагины](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Применяет примесь (mixin) ко всей области приложения. Глобальный миксин применяет включенные в него опции к каждому экземпляру компонента в приложении.

:::warning Не рекомендуется
Миксины поддерживаются во Vue 3 в основном для обратной совместимости, что связано с их широким использованием в библиотеках экосистемы. Использование миксинов, особенно глобальных, следует избегать.

Для повторного использования логики предпочтите [Composables](/guide/reusability/composables).
:::

- **Тип**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Предоставляет данные, которые могут быть внедрены любыми компонентами-потомками приложения.

- **Тип**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Подробности**

Ожидает ключ внедрения в качестве первого аргумента и передаваемое значение в качестве второго. Возвращает экземпляр приложения.

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  Внутри компонента приложения:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **См. также**
  - [Provide / Inject](/guide/components/provide-inject)
  - [App-level Provide](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext()<sup class="vt-badge" data-text="3.3+" /> {#app-runwithcontext}

  Выполняет переданную функцию в контексте текущего экземпляра приложения.

- **Тип**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Подробности**

  Принимает коллбэк-функцию, которую сразу же выполняет. Так как вызов происходит синхронно, вызовы `inject()` могут внедрять значения, предоставленные в текущем приложении, даже при отсутствии активного экземпляра компонента. Возвращаемое значение коллбэка будет возвращено и этой функцией.

- **Пример**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Передаёт версию Vue, с которой был создан этот экземпляр приложения. Это может быть полезно при разработке [плагинов](/guide/reusability/plugins), где часть логики варьируется в зависимости от версии Vue.

- **Тип**

  ```ts
  interface App {
    version: string
  }
  ```

- **Пример**

  Выполнение проверки версии внутри плагина:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Для данного плагина требуется Vue 3')
      }
    }
  }
  ```

- **См. также** [Глобальное API - version](/api/general#version)

## app.config {#app-config}

Каждый экземпляр приложения предоставляет объект `config`, содержащий конфигурацию приложения. Перед монтированием приложения можно изменить его свойства (описанные ниже).

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Назначает глобальный обработчик для не перехваченных ошибок, возникающих в приложении.

- **Тип**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` - это специфическая для Vue информация об ошибке,
      // например, в каком хуке жизненного цикла возникла ошибка
      info: string
    ) => void
  }
  ```

- **Подробности**

  Обработчик ошибки получает три аргумента: ошибку, экземпляр компонента, в котором произошла ошибка, и строку, определяющую тип источника ошибки.

  Он может фиксировать ошибки от следующих источников:

  - Отрисовка компонентов
  - Слушатели событий
  - Хуки жизненного цикла
  - функция `setup()`
  - Наблюдатели
  - Хуки пользовательских директив
  - Хуки анимаций

  :::tip Совет
  
  В production, третий аргумент (`info`) будет содержать код вместо полного названия источника. Соответствие кода и названия можно найти в [Руководстве по кодам ошибок](/error-reference/#runtime-errors).
  :::

- **Пример**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // обработка ошибки, например, передать в сервис логирования
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Назначение пользовательского обработчика предупреждений, возникающих во время выполнения Vue.

- **Тип**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Подробности**

  В качестве первого аргумента обработчик предупреждения получает сообщение о предупреждении, в качестве второго — экземпляр исходного компонента, в качестве третьего - trace строку компонента.

  С его помощью можно отфильтровать конкретные предупреждения, чтобы уменьшить количество сообщений в консоли. Все предупреждения Vue должны быть устранены в процессе разработки, поэтому этот фильтр рекомендуется использовать только в сеансах отладки, чтобы сосредоточиться на конкретных предупреждениях из множества, и должен быть удалён по окончании отладки.

  :::tip Совет
  Предупреждения работают только во время разработки, поэтому в рабочем режиме эта конфигурация игнорируется.
  :::

- **Пример**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` - трассировка иерархии компонентов
  }
  ```

## app.config.performance {#app-config-performance}

Установите значение `true`, чтобы включить отслеживание производительности компонентов при инициализации, компиляции, отрисовке и исправлениях в devtool панели браузера perfomance/timeline. Работает только в режиме разработки и в браузерах, поддерживающих API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Тип** `boolean`

- **См. также** [Руководство — Производительность](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Настройка параметров runtime компилятора. Значения, установленные для этого объекта, будут передаваться компилятору шаблонов в браузере и влиять на каждый компонент сконфигурированного приложения. Обратите внимание, что вы также можете переопределить эти параметры для каждого компонента, используя опцию [`compilerOptions`](/api/options-rendering#compileroptions)

:::warning Важно
Эта опция конфигурации учитывается только при использовании полной сборки (т.е. автономной `vue.js`, которая может компилировать шаблоны в браузере). Если вы используете сборку только во время выполнения с настройкой сборки, опции компилятора должны передаваться в `@vue/compiler-dom` через конфигурации инструмента сборки.

- Для `vue-loader`: [передайте лоадеру параметр `compilerOptions`](https://vue-loader.vuejs.org/options#compileroptions). См. также [как настроить в `vue-cli`](https://cli.vuejs.org/guide/webpack#modifying-options-of-a-loader).

- Для `vite`: [передайте параметр `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Определяет метод проверки для распознавания нативных пользовательских элементов.

- **Тип** `(tag: string) => boolean`

- **Подробности**

  Должен возвращать `true`, если тег должен рассматриваться как нативный пользовательский элемент. Для совпавшего тега Vue отобразит его как пользовательский элемент, а не попытается разрешить его как компонент Vue.

  Нативные HTML и SVG теги в этой функции указывать не нужно — парсер Vue распознаёт их автоматически.

- **Пример**

  ```js
  // рассматривать все теги, начинающиеся с 'ion-', как пользовательские элементы
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **См. также** [Vue и Веб-компоненты](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Настраивает поведение обработки символов пробела в шаблоне.

- **Тип** `'condense' | 'preserve'`

- **По умолчанию** `'condense'`

- **Подробности**

  Vue удаляет / сжимает пробельные символы в шаблонах для получения более эффективного компилированного вывода. По умолчанию используется стратегия "condense" со следующим поведением:

  1. Начальные/конечные пробельные символы внутри элемента сжимает в один пробел.
  2. Пробельные символы между элементами, содержащими новые строки, удаляются.
  3. Последовательные пробельные символы в текстовых узлах сжимаются в один пробел.

  Установка этого параметра в значение `'preserve'` отключает (2) и (3).

- **Пример**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Настраивает разделители, используемые для интерполяции текста в шаблоне.

- **Тип** `[string, string]`

- **По умолчанию** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Подробности**

  Обычно это используется для того, чтобы избежать конфликта с серверными фреймворками, которые также используют синтаксис mustache (синтаксиса из двойных фигурных скобок).

- **Пример**

  ```js
  // Разделители изменены на шаблонный стиль строки ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Настройка обработки HTML-комментариев в шаблонах.

- **Тип** `boolean`

- **По умолчанию** `false`

- **Подробности**

  По умолчанию Vue будет удалять комментарии в production сборке. Установка этого значения в `true` заставит Vue сохранять комментарии даже в продакшене. Во время разработки комментарии всегда сохраняются. Эта опция обычно используется, когда Vue используется с другими библиотеками, которые полагаются на HTML-комментарии.

- **Пример**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Объект, который может использоваться для регистрации глобальных свойств, доступ к которым может быть получен для любого экземпляра компонента внутри приложения.

- **Тип**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Подробности**

  Это замена `Vue.prototype` из Vue 2, которой больше нет во Vue 3. Как и всё глобальное, его следует использовать осторожно.

  Если глобальное свойство конфликтует с собственным свойством компонента, то собственное свойство компонента будет иметь более высокий приоритет.

- **Использование**

  ```js
  app.config.globalProperties.msg = 'привет'
  ```

  Это делает `msg` доступным внутри любого шаблона компонента в приложении, а также на `this` любого экземпляра компонента:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'привет'
    }
  }
  ```

- **См. также** [Руководство — Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Объект для определения стратегий объединения для пользовательских опций компонентов.

- **Тип**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Подробности**

  Некоторые плагины/библиотеки добавляют поддержку пользовательских опций компонентов (путём инъекции глобальных миксинов). Для таких опций может потребоваться специальная логика объединения, когда одна и та же опция должна быть "смержена" из нескольких источников (например, миксинов или наследования компонентов).

  Функцию стратегии слияния можно зарегистрировать для пользовательской опции, назначив ее в объекте `app.config.optionMergeStrategies`, используя в качестве ключа имя опции.

  Функция стратегии слияния получает в качестве первого и второго аргументов значение этой опции, определенной для родительского и дочернего экземпляров соответственно.

- **Пример**

  ```js
  const app = createApp({
    // собственная опция
    msg: 'Vue',
    // опция из примеси (mixin)
    mixins: [
      {
        msg: 'Привет '
      }
    ],
    mounted() {
      // объединенные опции, доступные в this.$options
      console.log(this.$options.msg)
    }
  })

  // определение пользовательской стратегии слияния для `msg`.
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // logs 'Привет Vue'
  ```

- **См. также** [Экземпляр компонента - `$options`](/api/component-instance#options)
