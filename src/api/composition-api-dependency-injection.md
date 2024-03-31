# Composition API: <br>Внедрение зависимостей {#composition-api-dependency-injection}

## provide() {#provide}

Предоставляет значение, которое может быть внедрено дочерними компонентами.

- **Тип**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Подробности**

  `provide()` принимает два аргумента: ключ, который может быть строкой или символом, и значение для внедрения.

  При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue вспомогательный тип, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

  Подобно API регистрации хуков жизненного цикла, `provide()` должен вызываться синхронно во время фазы `setup()` компонента.

- **Пример**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // предоставление статического значения
  provide('path', '/project/')

  // предоставление реактивного значения
  const count = ref(0)
  provide('count', count)

  // предоставление по ключу Symbol
  provide(countSymbol, count)
  </script>
  ```

- **См. также**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Внедряет значение, предоставленное родительским компонентом или приложением (через `app.provide()`).

- **Тип**

  ```ts
  // без значения по умолчанию
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // со значением по умолчанию
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // с функцией-фабрикой
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Подробности**

  Первым аргументом является ключ внедрения. Vue пройдёт по родительской цепочке вверх, чтобы найти предоставленное значение с соответствующим ключом. Если несколько компонентов в родительской цепочке предоставляют один и тот же ключ, то ближайший к внедряющему компоненту будет "затенять" те, которые находятся выше по цепочке. Если значение с подходящим ключом не найдено, `inject()` возвращает значение `undefined`, если не указано значение по умолчанию.

  Второй аргумент является необязательным и представляет собой значение по умолчанию, которое будет использовано, если соответствующее значение не найдено.

  Второй аргумент также может быть функцией-фабрикой, которая возвращает дорогостоящие для создания значения. В таком случае третьим аргументом должно быть передано `true`, чтобы указать, что функция должна использоваться как фабрика вместо самого значения.

  Подобно API регистрации хуков жизненного цикла, `inject()` должен вызываться синхронно во время фазы `setup()` компонента.

  При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue вспомогательным тип, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

- **Пример**

  Предположим, что родительский компонент предоставил значения, как показано в предыдущем примере `provide()`.

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // внедрение статического значения без значения по умолчанию
  const path = inject('path')

  // внедрение реактивного значения
  const count = inject('count')

  // внедрение по ключу Symbol
  const count2 = inject(countSymbol)

  // внедрение со значением по умолчанию
  const bar = inject('path', '/default-path')

  // внедрение функции со значением по умолчанию
  const fn = inject('function', () => {})

  // внедрение функции-фабрики, предоставляющей значения по умолчанию
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```
  
- **See also**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() <sup class="vt-badge" data-text="3.3+" /> {#has-injection-context}

Возвращает `true`, если [inject()](#inject) можно использовать без предупреждения о вызове в неправильном месте (например, вне `setup()`). Этот метод предназначен для библиотек, которые хотят использовать `inject()` внутри себя без предупреждения для конечного пользователя.

- **Тип**

  ```ts
  function hasInjectionContext(): boolean
  ```
