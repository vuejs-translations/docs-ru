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

> Этот раздел применим только в том случае, если вы используете [рендеринг на стороне сервера](/guide/scaling-up/ssr).

В Vue 3.5+ асинхронные компоненты могут контролировать момент своей гидратации, предоставляя для неё стратегию.

- Vue предоставляет ряд встроенных стратегий гидратации. Эти встроенные стратегии необходимо импортировать по отдельности, чтобы их можно было удалить с помощью "встряхивания дерева", если они не используются.

- Дизайн намеренно низкоуровневый для гибкости. Синтаксис компилятора потенциально может быть реализован на его основе в будущем как в ядре, так и в решениях более высокого уровня (например, Nuxt).

### Гидратация в режиме ожидания {#hydrate-on-idle}

Гидратация через `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* опционально передаёт максимальное время ожидания */)
})
```

### Гидратация при видимости {#hydrate-on-visible}

Гидратация происходит, когда элемент(ы) становятся видимыми через `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

При необходимости значение объекта можно передать наблюдателю:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Гидратация при медиа-выражениях {#hydrate-on-media-query}

Срабатывает при совпадении указанного медиа-выражения.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Гидратация при взаимодействии {#hydrate-on-interaction}

Гидратация происходит при возникновении определённых событий на элементах компонента. Событие, вызвавшее гидратацию, также будет воспроизведено после её завершения.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Также может быть списком событий разных типов:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Собственная стратегия {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement — вспомогательный метод для итерации по всем корневым элементам
  // в негидратированном DOM-объекте компонента, поскольку корневой элемент может быть фрагментом
  // а не отдельным элементом
  forEachElement(el => {
    // ...
  })
  // вызов `hydrate` по готовности
  hydrate()
  return () => {
    // возвращает функцию разборки, если необходимо
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Использование с Suspense {#using-with-suspense}

Асинхронные компоненты могут использоваться с встроенным компонентом `<Suspense>`. Взаимодействие между `<Suspense>` и асинхронными компонентами описано в [специальной главе, посвящённой `<Suspense>`](/guide/built-ins/suspense.html).
