---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Быстрый старт {#quick-start}

## Поиграться с Vue онлайн {#try-vue-online}

- Чтобы быстро попробовать Vue, можно воспользоваться [Песочницей](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Если предпочитаете простое HTML-окружение без каких-либо шагов сборки, то можно начать с [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/).

- Если уже знакомы с Node.js и концепцией инструментов сборки, то можно попробовать полноценное окружение с шагом сборки прямо в браузере на [StackBlitz](https://vite.new/vue).

## Создание приложения Vue {#creating-a-vue-application}

:::tip Предварительные условия
- Знакомство с командной строкой
- Установленная [Node.js](https://nodejs.org/) 18.3 версии или выше
:::

В этом разделе разберёмся как развернуть на локальной машине [одностраничное приложение](/guide/extras/ways-of-using-vue#single-page-application-spa) Vue. Созданный проект будет использовать шаг сборки с помощью [Vite](https://vitejs.dev), и позволит использовать во Vue [однофайловые компоненты](/guide/scaling-up/sfc) (SFCs).

Убедитесь, что установлена актуальная версия [Node.js](https://nodejs.org/), после чего выполните следующую команду в командной строке (символ `>` вводить не нужно):

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh
  $ pnpm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh
  $ yarn create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Команда установит и запустит [create-vue](https://github.com/vuejs/create-vue) — официальный инструмент для развёртывания проектов Vue. Также после запуска будут выводиться подсказки для возможности выбора ряда дополнительных функций, таких как TypeScript или поддержка тестирования:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Если не уверены в каком-либо варианте, просто выбирайте `No`, нажав клавишу Enter. После создания проекта следуйте инструкциям по установке зависимостей и запуске сервера разработки:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ npm install
  $ npm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ pnpm install
  $ pnpm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ yarn
  $ yarn dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ bun install
  $ bun run dev
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Теперь уже должен быть запущен первый проект! Обратите внимание, что примеры компонентов в сгенерированном проекте написаны с использованием [Composition API](/guide/introduction#composition-api) и `<script setup>`, а не [Options API](/guide/introduction#options-api). Вот несколько дополнительных советов:

- Рекомендуемая конфигурация IDE — [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Официальное расширение](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Если используете другие редакторы, ознакомьтесь с разделом [поддержка IDE](/guide/scaling-up/tooling#ide-support).
- Больше информации об инструментарии, включая интеграцию с бэкенд-фреймворками, обсуждается в разделе [Инструментарий](/guide/scaling-up/tooling).
- Чтобы узнать больше об используемом инструменте сборки Vite, ознакомьтесь с [документацией Vite](https://vitejs.dev).
- Если решили использовать TypeScript, ознакомьтесь с инструкцией по [использованию TypeScript](typescript/overview).

Когда будете готовы опубликовать приложение в production, выполните команду:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh
  $ pnpm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh
  $ yarn build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun run build
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Она создаст сборку приложения для production в каталоге `./dist`. Ознакомьтесь с руководством по [развёртыванию в production](/guide/best-practices/production-deployment), чтобы узнать больше о публикации приложения в production.

[Следующие шаги >](#next-steps)

## Использование Vue с помощью CDN {#using-vue-from-cdn}

Можно подключать Vue напрямую из CDN через тег script:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Здесь использовали [unpkg](https://unpkg.com/), но также можно использовать любой другой CDN, который публикует npm-пакеты, например [jsdelivr](https://www.jsdelivr.com/package/npm/vue) или [cdnjs](https://cdnjs.com/libraries/vue). И конечно же, всегда можно скачать этот файл и заниматься его хостингом его самостоятельно.

При использовании Vue из CDN нет никакого «шага сборки». Это значительно упрощает конфигурацию и подходит для улучшения статического HTML или для интеграции с бэкенд-фреймворком. Но в таком случае не получится использовать синтаксис однофайловых компонентов (SFC).

### Использование глобальной сборки {#using-the-global-build}

Указанная выше ссылка загружает _глобальную сборку_ Vue, где все API верхнего уровня доступны как свойства глобального объекта `Vue`. Вот полный пример с использованием глобальной сборки:

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Привет Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen демо](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen демо](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip Совет
Многие примеры в руководстве по использованию Composition API будут использовать синтаксис `<script setup>`, который требует использования инструментов сборки. Если вы планируете использовать Composition API без этапа сборки, ознакомьтесь с использованием [опции `setup()`](/api/composition-api-setup).
:::

</div>

### Использование сборки в виде ES-модуля {#using-the-es-module-build}

В остальной части документации в основном используется синтаксис [ES-модулей](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Большинство современных браузеров теперь поддерживают ES-модули нативно, поэтому можно подключать Vue из CDN как нативный ES-модуль таким образом:

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Привет Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Привет Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Обратите внимание, что используется `<script type="module">`, а импортированный CDN URL указывает на **сборку в виде ES-модуля**.

<div class="options-api">

[Codepen демо](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Codepen демо](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Использование Import maps {#enabling-import-maps}

В примере выше импортируем по полному CDN URL, но дальше в документации увидим код, подобный этому:

```js
import { createApp } from 'vue'
```

Чтобы импортировать в таком лаконичном формате нужно указать браузеру местоположение импорта `vue` с помощью [Import Maps (карту импорта)](https://caniuse.com/import-maps):

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Привет Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen демо](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Привет Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen демо](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Также можно добавлять записи и для других зависимостей в import map — но убедитесь, что они указывают на версию ES-модуля библиотеки, которую собираетесь использовать.

:::tip Поддержка `Import Maps` в браузере
`Import Maps` является относительно новой возможностью браузера. Убедитесь, что браузер её [поддерживает](https://caniuse.com/import-maps). В частности, поддерживается в `Safari` с версии `16.4+`.
:::

:::warning Примечание при использовании в production
На данный момент в примерах используется сборка Vue для разработки. Если вы собираетесь использовать Vue из CDN в рабочей среде, обязательно ознакомьтесь с [Руководством по производственному развертыванию](/guide/best-practices/production-deployment#without-build-tools).

Хотя можно использовать Vue без системы сборки, можно рассмотреть альтернативный подход — использование [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue), который лучше подходит для контекста, в котором [`jquery/jquery`](https://github.com/jquery/jquery) (в прошлом) или [`alpinejs/alpine`](https://github.com/alpinejs/alpine) (в настоящем) можно использовать вместо этого.
:::

### Разделение на модули {#splitting-up-the-modules}

По мере углубления в руководство может понадобиться разделить код на отдельные файлы JavaScript, чтобы ими было легче управлять. Например:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>Счётчик: {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>

Если напрямую открыть `index.html` в браузере, то обнаружите, что он выдаёт ошибку, потому что ES-модули не могут работать по протоколу `file://`. Чтобы исправить эту ситуацию, необходимо раздавать `index.html` по протоколу `http://` с помощью локального HTTP-сервера.

Из-за соображений безопасности ES-модули могут работать только по протоколу `http://`, который используется браузерами при открытии страниц в сети Интернет. Чтобы ES-модули работали на локальной машине, необходимо предоставить `index.html` через протокол `http://`, используя локальный HTTP-сервер.

Для запуска локального HTTP-сервера для начала нужно установить [Node.js](https://nodejs.org/en/), а затем запустить команду `npx serve` в том же каталоге, где находится HTML-файл. Можно использовать и любой другой HTTP-сервер, который умеет хостить статические файлы с правильными MIME-типами.

Как можно заметить, шаблон импортируемого компонента указан как строка JavaScript. При использовании VS Code можно установить расширение [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) и добавить к этой строке префикс комментарием `/*html*/` чтобы получить подсветку синтаксиса в них.

## Следующие шаги {#next-steps}

Если пропустили [Введение](/guide/introduction), настоятельно рекомендуем прочитать его, прежде чем переходить к остальной части документации.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application">
    <p class="next-steps-link">Руководство</p>
    <p class="next-steps-caption">В руководстве каждый аспект фреймворка разбирается подробно.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Самоучитель</p>
    <p class="next-steps-caption">Для тех, кто предпочитает учиться на практике.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Примеры</p>
    <p class="next-steps-caption">Изучите примеры основных функций и общих задач при разработке UI.</p>
  </a>
</div>
