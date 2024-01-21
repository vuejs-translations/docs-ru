# Composition API: <br>Внедрение зависимостей {#composition-api-dependency-injection}

## provide() {#provide}

Предоставляет значение, которое может быть внедрено дочерними компонентами.

- **Тип:**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Подробности:**

  `provide()` принимает два аргумента: ключ, который может быть строкой или символом, и значение для внедрения.

  При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue вспомогательный тип, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

  Подобно API регистрации хуков жизненного цикла, `provide()` должен вызываться синхронно во время фазы `setup()` компонента.

- **Пример:**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // provide со статическим значением
  provide('path', '/project/')

  // provide с реактивным значением
  const count = ref(0)
  provide('count', count)

  // provide с ключами-символами
  provide(countSymbol, count)
  </script>
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Внедряет значение, предоставленное родительским компонентом или приложением (через `app.provide()`).

- **Тип:**

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

- **Подробности:**

  Первым аргументом является ключ внедрения. Vue пройдет по родительской цепочке вверх, чтобы найти предоставленное значение с соответствующим ключом. Если несколько компонентов в родительской цепочке предоставляют один и тот же ключ, то ближайший к внедряющему компоненту будет "затенять" те, которые находятся выше по цепочке. Если значение с подходящим ключом не найдено, `inject()` возвращает значение `undefined`, если не указано значение по умолчанию.

  The second argument is optional and is the default value to be used when no matching value was found.

  The second argument can also be a factory function that returns values that are expensive to create. In this case, `true` must be passed as the third argument to indicate that the function should be used as a factory instead of the value itself.

  Подобно API регистрации хуков жизненного цикла, `inject()` должен вызываться синхронно во время фазы `setup()` компонента.

  При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue вспомогательным тип, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

- **Пример:**

  Предположим, что родительский компонент предоставил значения, как показано в предыдущем примере `provide()`.

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // inject co статическим значением
  const path = inject('path')

  // inject с реактивным значением
  const count = inject('count')

  // inject с ключами-символами
  const count2 = inject(countSymbol)

  // inject со значением по умолчанию
  const bar = inject('path', '/default-path')

  // inject with function default value
  const fn = inject('function', () => {})

  // inject with default value factory
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```

## hasInjectionContext() <sup class="vt-badge" data-text="3.3+" /> {#has-injection-context}

Returns true if [inject()](#inject) can be used without warning about being called in the wrong place (e.g. outside of `setup()`). This method is designed to be used by libraries that want to use `inject()` internally without triggering a warning to the end user.

- **Type**

  ```ts
  function hasInjectionContext(): boolean
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />
