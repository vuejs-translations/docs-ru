# Composition API: <br>Внедрение зависимостей {#composition-api-dependency-injection}

## provide() {#provide}

--- Provides a value that can be injected by descendant components.
+++ Предоставляет ```значение, которое может быть внедрено дочерними компонентами.

- **Тип:**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Подробности:**

  --- `provide()` takes two arguments: the key, which can be a string or a symbol, and the value to be injected.
  +++ `provide()` принимает два аргумента: ключ, который может быть строкой или символом, и ```значение для внедрения.

  --- When using TypeScript, the key can be a symbol casted as `InjectionKey` - a Vue provided utility type that extends `Symbol`, which can be used to sync the value type between `provide()` and `inject()`.
  +++ При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue тип утилиты, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.
  *** Vue предоставляет интерфейс InjectionKey — общий тип, расширяющий Symbol. Его можно использовать для синхронизации типа внедряемого значения между провайдером и получателем

  --- Similar to lifecycle hook registration APIs, `provide()` must be called synchronously during a component's `setup()` phase.
  +++ Подобно API регистрации хуков жизненного цикла, `provide()` должен вызываться синхронно во время фазы `setup()` компонента.

- **Пример:**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  --- // provide static value
  +++ // предоставить статическое значение
  provide('foo', 'bar')

  --- // provide reactive value
  +++ // предоставить реактивное значение
  const count = ref(0)
  provide('count', count)

  --- // provide with Symbol keys
  +++ // provide с ключами-символами
  provide(fooSymbol, count)
  </script>
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject.html)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api.html#typing-provide-inject)

## inject() {#inject}

Injects a value provided by an ancestor component or the application (via `app.provide()`).

- **Тип:**

  ```ts
  // without default value
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // with default value
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // with factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Подробности:**

  The first argument is the injection key. Vue will walk up the parent chain to locate a provided value with a matching key. If multiple components in the parent chain provides the same key, the one closest to the injecting component will "shadow" those higher up the chain. If no value with matching key was found, `inject()` returns `undefined` unless a default value is provided.

  The second argument is optional and is the default value to be used when no matching value was found. It can also be a factory function to return values that are expensive to create. If the default value is a function, then `false` must be passed as the third argument to indicate that the function should be used as the value instead of the factory.

  Similar to lifecycle hook registration APIs, `inject()` must be called synchronously during a component's `setup()` phase.

  When using TypeScript, the key can be of type of `InjectionKey` - a Vue-provided utility type that extends `Symbol`, which can be used to sync the value type between `provide()` and `inject()`.

- **Пример:**

  Assuming a parent component has provided values as shown in the previous `provide()` example:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // inject static value with default
  const foo = inject('foo')

  // inject reactive value
  const count = inject('count')

  // inject with Symbol keys
  const foo2 = inject(fooSymbol)

  // inject with default value
  const bar = inject('foo', 'default value')

  // inject with default value factory
  const baz = inject('foo', () => new Map())

  // inject with function default value, by passing the 3rd argument
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject.html)
  - [Guide - Typing Provide / Inject](/guide/typescript/composition-api.html#typing-provide-inject)
