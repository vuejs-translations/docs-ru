# API отрисовки на стороне сервера {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Пример:**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'привет' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### Контекст SSR

  Вы можете передать необязательный объект контекста, который может быть использован для записи дополнительных данных во время отрисовки, например [доступ к содержимому телепортов](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'контент телепорта' }
  ```

  Большинство других SSR API, представленных на этой странице, также опционально принимают объект контекста. Доступ к объекту контекста можно получить в коде компонента с помощью помощника [useSSRContext](#usessrcontext).

- **См. также:** [Руководство - Отрисовка на стороне сервера](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Выводит входные данные в виде [Node.js Readable stream](https://nodejs.org/api/stream#stream_class_stream_readable).

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Пример:**

  ```js
  // внутри http-обработчика Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Примечание
  Этот метод не поддерживается в ESM-сборке `vue/server-renderer`, которая отвязана от окружения Node.js. Вместо него используйте [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Отрисовка и передача данных в существующий экземпляр [Node.js Writable stream](https://nodejs.org/api/stream#stream_writable_streams).

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Пример:**

  ```js
  // внутри http-обработчика Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Передает входные данные в виде [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Пример:**

  ```js
  // внутри среды с поддержкой ReadableStream
  return new Response(renderToWebStream(app))
  ```

  :::tip Примечание
  В окружениях, не предоставляющих конструктор `ReadableStream` в глобальной области видимости, вместо него следует использовать [`pipeToWebWritable()`](#pipetowebwritable).
  :::

## pipeToWebWritable() {#pipetowebwritable}

Отрисовка и передача данных в существующий экземпляр [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Пример:**

  Обычно используется в сочетании с [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream доступен в таких средах, как CloudFlare workers.
  // в Node.js TransformStream должен быть явно импортирован из 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Осуществляет отрисовку входных данных в потоковом режиме с использованием простого readable интерфейса.

- **Экспортируется из `vue/server-renderer`**

- **Тип:**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Пример:**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // готово
          console(`отрисовка завершена: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // возникла ошибка
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Runtime API, используемый для получения объекта контекста, передаваемого в `renderToString()` или другие серверные API отрисовки.

- **Тип:**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Пример:**

  Извлеченный контекст может быть использован для присоединения информации, необходимой для рендеринга конечного HTML (например, метаданных head).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // убедитесь, что вызывается только во время SSR
  // https://vitejs.dev/guide/ssr#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...прикрепление свойства к контексту
  }
  </script>
  ```
