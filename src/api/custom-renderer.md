# API пользовательского рендерера {#custom-renderer-api}

## createRenderer() {#createrenderer}

Создает пользовательский рендерер. Предоставление API для создания и работы с узлами, специфичных для конкретной платформы, позволяет использовать runtime-ядро Vue для работы в средах, отличных от DOM.

- **Тип:**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      // остальное не используется в большинстве пользовательских рендереров
      isSVG?: boolean,
      prevChildren?: VNode<HostNode, HostElement>[],
      parentComponent?: ComponentInternalInstance | null,
      parentSuspense?: SuspenseBoundary | null,
      unmountChildren?: UnmountChildrenFn
    ): void
    insert(
      el: HostNode,
      parent: HostElement,
      anchor?: HostNode | null
    ): void
    remove(el: HostNode): void
    createElement(
      type: string,
      isSVG?: boolean,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null

    // опционально, специфично для DOM
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      isSVG: boolean
    ): [HostNode, HostNode]
  }
  ```

- **Пример:**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` - это низкоуровневый API
  // `createApp` возвращает экземпляр приложения
  export { render, createApp }

  // реэкспорт основного API Vue
  export * from '@vue/runtime-core'
  ```

  Собственный пакет Vue `@vue/runtime-dom` [реализован с использованием того же API](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts). Более простую реализацию можно найти в [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts), который представляет собой приватный пакет для собственного модульного тестирования Vue.
