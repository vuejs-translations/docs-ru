# Custom Elements API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Этот метод принимает тот же аргумент, что и [`defineComponent`](#definecomponent), но возвращает нативный конструктор класса [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Тип**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // the following options are 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Тип упрощён для удобства чтения.

- **Подробности**

  В дополнение к обычным опциям компонента, `defineCustomElement()` также поддерживает ряд опций, специфичных для пользовательских элементов:

  - **`styles`**: массив инлайновых CSS-строк для подключения CSS, который будет внедрён в shadow root элемента.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: функция для настройки экземпляра приложения Vue пользовательского элемента.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, по умолчанию `true`. Установите `false`, чтобы рендерить пользовательский элемент без shadow root. В этом случае `<style>` в SFC пользовательских элементов больше не будут инкапсулированы.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, если указан, будет установлен как атрибут `nonce` на тегах `<style>`, внедряемых в shadow root.

  Обратите внимание, что эти опции можно передавать не только как часть самого компонента, но и вторым аргументом:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  Возвращаемое значение — конструктор пользовательского элемента, который можно зарегистрировать с помощью [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Пример**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* component options */
  })

  // Регистрируем пользовательский элемент.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **См. также**

  - [Руководство — Создание пользовательских элементов с Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Также обратите внимание, что для `defineCustomElement()` требуется [особая настройка](/guide/extras/web-components#sfc-as-custom-element) при использовании с однофайловыми компонентами.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Вспомогательная функция Composition API, возвращающая хост-элемент текущего пользовательского элемента Vue.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Вспомогательная функция Composition API, возвращающая shadow root текущего пользовательского элемента Vue.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Свойство Options API, предоставляющее доступ к хост-элементу текущего пользовательского элемента Vue.
