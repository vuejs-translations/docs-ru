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
  import { fooSymbol } from './injectionSymbols'

  // provide со статическим значением
  provide('foo', 'bar')

  // provide с реактивным значением
  const count = ref(0)
  provide('count', count)

  // provide с ключами-символами
  provide(fooSymbol, count)
  </script>
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject.html)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api.html#typing-provide-inject)

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

  Второй аргумент является необязательным и представляет собой значение по умолчанию, которое будет использоваться, если не было найдено ни одного подходящего значения. Это также может быть фабричная функция для возврата значений, которые дорого создавать. Если значением по умолчанию является функция, то в качестве третьего аргумента необходимо передать `false`, чтобы указать, что в качестве значения должна использоваться функция, а не фабрика.

  Подобно API регистрации хуков жизненного цикла, `inject()` должен вызываться синхронно во время фазы `setup()` компонента.

  При использовании TypeScript ключ может быть символом, приведенным к `InjectionKey` - предоставляемый Vue вспомогательным тип, расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

- **Пример:**

  Предположим, что родительский компонент предоставил значения, как показано в предыдущем примере `provide()`.

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // внедрение статического значения со значением по умолчанию
  const foo = inject('foo')

  // внедрение реактивного значения
  const count = inject('count')

  // внедрение с ключами-символами
  const foo2 = inject(fooSymbol)

  // внедрение со значением по умолчанию
  const bar = inject('foo', 'default value')

  // внедрение с функцией-фабрикой значения по умолчанию
  const baz = inject('foo', () => new Map())

  // внедрение со значением по умолчанию в виде функции, через передачу 3го аргумента
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **См. также:**
  - [Guide - Provide / Inject](/guide/components/provide-inject.html)
  - [Guide - Типизация Provide / Inject](/guide/typescript/composition-api.html#typing-provide-inject)
