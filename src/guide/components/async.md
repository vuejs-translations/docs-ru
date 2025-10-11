# Асинхронные компоненты {#async-components}

## Базовое использование {#basic-usage}

В больших приложениях может потребоваться разделить приложение на более мелкие части и загружать компонент с сервера только при необходимости. Для этого Vue предоставляет функцию [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...загрузка компонента с сервера
    resolve(/* загруженный компонент */)
  })
})
// ... используйте `AsyncComp` как обычный компонент
```

Как вы заметили, `defineAsyncComponent` принимает функцию загрузчика, которая возвращает Promise. Коллбэк Promise `resolve` должен быть вызван, когда вы получили определение компонента с сервера. Вы также можете вызвать `reject(reason)`, чтобы указать, что загрузка не удалась.

[Динамический импорт ES-модулей](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) также возвращает Promise, поэтому большую часть времени мы будем использовать его в сочетании с `defineAsyncComponent`. Сборщики, такие как Vite и webpack, также поддерживают этот синтаксис (и будут использовать его для разделения бандлов), поэтому мы можем использовать его для импорта файлов однофайловых компонентов Vue (SFC):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

Полученный `AsyncComp` является обёрткой компонента, которая вызывает функцию загрузчика только при фактической отрисовке на странице. Кроме того, он передаст все атрибуты и слоты внутреннему компоненту, поэтому вы можете использовать асинхронную обёртку для плавной замены исходного компонента и реализации lazy loading (ленивой загрузки).

Как и с обычными компонентами, асинхронные компоненты могут быть [глобально зарегистрированы](/guide/components/registration#global-registration) при помощи `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Вы также можете использовать `defineAsyncComponent` при [локальной регистрации компонента](/guide/components/registration.html#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Они также могут быть определены непосредственно внутри родительского компонента:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Состояния загрузки и ошибки {#loading-and-error-states}

Асинхронные операции неизбежно включают состояния загрузки и ошибок - `defineAsyncComponent()` поддерживает обработку этих состояний с помощью дополнительных опций:

```js
const AsyncComp = defineAsyncComponent({
  // функция загрузчика
  loader: () => import('./Foo.vue'),

  // компонент, используемый при загрузке асинхронного компонента
  loadingComponent: LoadingComponent,
  // Задержка перед отображением компонента загрузки. По умолчанию: 200 мс.
  delay: 200,

  // компонент, используемый при ошибке загрузки
  errorComponent: ErrorComponent,
  // Компонент ошибки будет отображаться, если указано и было превышено время ожидания. По умолчанию: Infinity.
  timeout: 3000
})
```

Если предоставлен компонент загрузки, он будет отображаться сначала, пока загружается внутренний компонент. Есть задержка в 200 мс перед отображением компонента загрузки - это связано с тем, что при быстром соединении мгновенное состояние загрузки может быть слишком быстро заменено и создавать эффект мерцания.

Если предоставлен компонент ошибки, он будет отображаться, когда Promise, возвращаемый функцией загрузчиком, будет отклонён. Вы также можете указать время ожидания для отображения компонента ошибки, если запрос занимает слишком много времени.

## Ленивая гидратация <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Данный раздел актуален только для тех, кто использует [Server-Side Rendering](/guide/scaling-up/ssr).

В Vue 3.5+, асинхронные компоненты могут контролировать время гидратации, предоставляя стратегию гидратации.

- Vue предоставляет несколько встроенных стратегий гидратации. Эти встроенные стратегии нужно импортировать явно - это позволяет исключить неиспользуемый код при tree-shaking.

- Дизайн намеренно сделан низкоуровневым для гибкости. В будущем поверх этой основы можно будет добавить синтаксический сахар — или в ядро фреймворка, или в более высокоуровневые решения. (например, Nuxt).

### Гидратация в фоновом режиме {#hydrate-on-idle}

Гидратация происходит с помощью `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* optionally pass a max timeout */)
})
```

### Гидратация при отображении {#hydrate-on-visible}

Гидратация происходит при появлении элемента(ов) в области видимости с помощью `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Можно дополнительно передать объект с настройками для наблюдателя (observer):

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Гидратация на медиазапросе {#hydrate-on-media-query}

Гидратация происходит при соответствии указанному медиазапросу.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Гидратация при взаимодействии {#hydrate-on-interaction}

Гидратация происходит при срабатывании указанных событий на элементе(ах) компонента. Событие, вызвавшее гидратацию, будет повторно воспроизведено после её завершения.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Также поддерживается список из нескольких типов событий:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Кастомная стратегия {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement is a helper to iterate through all the root elements
  // in the component's non-hydrated DOM, since the root can be a fragment
  // instead of a single element
  forEachElement(el => {
    // ...
  })
  // call `hydrate` when ready
  hydrate()
  return () => {
    // return a teardown function if needed
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Использование с Suspense {#using-with-suspense}

Асинхронные компоненты могут использоваться с встроенным компонентом `<Suspense>`. Взаимодействие между `<Suspense>` и асинхронными компонентами описано в [специальной главе, посвящённой `<Suspense>`](/guide/built-ins/suspense.html).
