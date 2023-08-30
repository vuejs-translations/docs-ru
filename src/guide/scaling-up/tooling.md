# Инструментарий {#tooling}

## Попробуйте онлайн {#try-it-online}

Вам не нужно ничего устанавливать на свой компьютер, чтобы опробовать Vue SFC — есть онлайн-площадки, которые позволяют вам делать это прямо в браузере:

- [Vue SFC Playground](https://sfc.vuejs.org)
  - Всегда развертывается из последнего коммита
  - Предназначен для проверки результатов компиляции компонентов
- [Vue + Vite on StackBlitz](https://vite.new/vue)
  - IDE-подобная среда с запуском реального сервера разработки Vite в браузере
  - Наиболее близка к локальной установке

Также рекомендуется использовать эти онлайн-площадки для предоставления репродукций при сообщении об ошибках.

## Инициализация проекта {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) - это легкий и быстрый инструмент сборки с первоклассной поддержкой Vue SFC. Он создан Эваном Ю, который также является автором Vue!

Чтобы начать работу с Vite + Vue, просто запустите программу:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Эта команда установит и выполнит [create-vue](https://github.com/vuejs/create-vue) официальный инструмент для инициализации проекта Vue.

- Чтобы узнать больше о Vite, ознакомьтесь с [документацией  Vite](https://vitejs.dev).
- Чтобы настроить специфическое для Vue поведение в проекте Vite, например, передать опции компилятору Vue, ознакомьтесь с документацией для [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Обе упомянутые выше онлайн-площадки также поддерживают загрузку файлов в качестве проекта Vite.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) - это официальная цепочка инструментов для Vue, основанная на webpack. В настоящее время он находится в режиме поддержки, и мы рекомендуем начинать новые проекты с Vite, если только вы не полагаетесь на специфические возможности, доступные только для webpack. В большинстве случаев Vite обеспечивает более высокий уровень качества работы разработчиков.

Информация о миграции с Vue CLI на Vite:

- [Руководство по миграции Vue CLI -> Vite с сайта VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Инструменты / плагины, которые помогут с автоматической миграцией](https://github.com/vitejs/awesome-vite#vue-cli)

### Примечание по компиляции шаблонов в браузере {#note-on-in-browser-template-compilation}

При использовании Vue без этапа сборки шаблоны компонентов записываются либо непосредственно в HTML страницы, либо в виде встроенных JavaScript-строк. В таких случаях Vue необходимо поставлять компилятор шаблонов браузеру для выполнения компиляции шаблонов "на лету". С другой стороны, компилятор будет не нужен, если мы предварительно скомпилируем шаблоны на этапе сборки. Чтобы уменьшить размер клиентской сборки, Vue предоставляет [различные "сборки"](https://unpkg.com/browse/vue@3/dist/), оптимизированные для разных случаев использования.

- Файлы сборки, начинающиеся с `vue.runtime.*`, являются **сборками только во время выполнения**: они не включают компилятор. При использовании этих сборок все шаблоны должны быть предварительно скомпилированы с помощью шага сборки.

- Файлы сборки, которые не включают`.runtime`, являются **полными сборками**: они включают компилятор и поддерживают компиляцию шаблонов непосредственно в браузере. Однако они больше в размере примерно на 14КБ.

В наших стандартных настройках инструментария используется сборка только во время выполнения, поскольку все шаблоны в SFC предварительно скомпилированы. Если по каким-то причинам вам необходима компиляция шаблонов в браузере даже с шагом сборки, вы можете сделать это, настроив инструмент сборки на псевдоним `vue` на `vue/dist/vue.esm-bundler.js` вместо этого.

Если вы ищете более легкую альтернативу для использования без шагов сборки, обратите внимание на [petite-vue](https://github.com/vuejs/petite-vue).

## Поддержка IDE {#ide-support}

- Рекомендуемая настройка IDE - [VSCode](https://code.visualstudio.com/) + расширение [Volar](https://github.com/johnsoncodehk/volar). Volar обеспечивает подсветку синтаксиса, поддержку TypeScript и автодополнения для шаблонных выражений и входных параметров компонентов.

  :::tip Совет
  Volar заменяет [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), наше предыдущее официальное расширение VSCode для Vue 2. Если у вас установлено расширение Vetur, не забудьте отключить его в проектах Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) также предоставляет отличную встроенную поддержку однофайловых компонентов Vue.

- Другие IDE, поддерживающие [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) (LSP), также могут использовать основные функции Volar через LSP:

  - Поддержка Sublime Text через [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Поддержка vim / Neovim через [coc-volar](https://github.com/yaegassy/coc-volar).

  - Поддержка emacs через [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Браузерные инструменты разработчика {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Free Vue.js Devtools Lesson"/>

Расширение devtools для браузера Vue позволяет исследовать дерево компонентов приложения Vue, проверять состояние отдельных компонентов, отслеживать события управления состоянием и определять производительность.

![devtools screenshot](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [Документация](https://devtools.vuejs.org/)
- [Расширение для Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Аддон для Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Автономное приложение Electron](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

Основная статья: [Использование Vue с TypeScript](/guide/typescript/overview).

- [Volar](https://github.com/johnsoncodehk/volar) обеспечивает проверку типов для SFC с помощью блоков `<script lang="ts">`, включая шаблонные выражения и межкомпонентную валидацию входных параметров.

- Используйте [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc)  для выполнения аналогичной проверки типов из командной строки или для генерации файлов `d.ts` для SFC.

## Тестирование {#testing}

Основная статья: [Testing Guide](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) рекомендуется для E2E-тестирования. Он также может быть использован для тестирования компонентов Vue SFC с помощью [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) - это программа тестирования, созданная членами команды Vue / Vite и ориентированная на скорость. Он специально разработан для приложений на базе Vite, чтобы обеспечить такой же мгновенный цикл обратной связи для модульного/компонентного тестирования.

- [Jest](https://jestjs.io/) можно заставить работать с Vite с помощью [vite-jest](https://github.com/sodatea/vite-jest). Однако это рекомендуется делать только в том случае, если у вас есть существующие тестовые наборы на базе Jest, которые необходимо перенести на Vite, поскольку Vitest предоставляет аналогичные функции с гораздо более эффективной интеграцией.

## Линтинг {#linting}

Команда Vue поддерживает [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), плагин [ESLint](https://eslint.org/), поддерживающий правила линтинга, специфичные для SFC.

Пользователи, ранее использовавшие Vue CLI, могут привыкнуть к тому, что линтеры настраиваются через загрузчики webpack. Однако при использовании сборки на основе Vite наша общая рекомендация такова:

1. `npm install -D eslint eslint-plugin-vue`, затем следуйте руководству по настройке `eslint-plugin-vue` [configuration guide](https://eslint.vuejs.org/user-guide/#usage).

2. Установите расширения ESLint для IDE, например [ESLint для VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), чтобы получать обратную связь от линтера прямо в редакторе во время разработки. Это также позволяет избежать лишних затрат на линтинг при запуске сервера разработки.

3. Запустите ESLint как часть команды рабочей сборки, чтобы получить полную обратную связь от линтера перед отправкой в рабочую среду.

4. (Необязательно) Инструменты настройки, такие как [lint-staged](https://github.com/okonet/lint-staged) для автоматического анализа измененных файлов при фиксации git.

## Форматирование {#formatting}

- Расширение [Volar](https://github.com/johnsoncodehk/volar) VSCode обеспечивает форматирование для Vue SFC из коробки.

- Кроме того, [Prettier](https://prettier.io/) предоставляет встроенную поддержку форматирования Vue SFC.

## Интеграция пользовательских блоков SFC {#sfc-custom-block-integrations}

Пользовательские блоки компилируются в импорт в один и тот же файл Vue с различными запросами. Обработка этих запросов на импорт зависит от базового инструмента сборки.

- Если используется Vite, то для преобразования сопоставленных пользовательских секций в исполняемый JavaScript необходимо использовать собственный плагин Vite. [Пример](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- При использовании Vue CLI или обычного webpack для преобразования таких секций необходимо настроить загрузчик webpack. [Пример](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Низкоуровневые пакеты {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Документация](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Этот пакет является частью монорепо ядра Vue и всегда публикуется с той же версией, что и основной пакет `vue`. Он включен в качестве зависимости в основной пакет `vue` и доступен через `vue/compiler-sfc`, поэтому его не нужно устанавливать отдельно.

Сам пакет предоставляет низкоуровневые утилиты для обработки Vue SFC и предназначен только для авторов инструментальных средств, которым необходима поддержка Vue SFC в пользовательских инструментах.

:::tip Совет
Всегда лучше использовать этот пакет через глубокий импорт `vue/compiler-sfc`, так как это гарантирует синхронизацию его версии со средой выполнения Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Документация](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Официальный плагин, обеспечивающий поддержку Vue SFC в Vite.

### `vue-loader` {#vue-loader}

- [Документация](https://vue-loader.vuejs.org/)

Официальный загрузчик, обеспечивающий поддержку Vue SFC в webpack. Если вы используете Vue CLI, см. также [документацию по изменению параметров `vue-loader` в Vue CLI](https://cli.vuejs.org/ru/guide/webpack.html#%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BA-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B0).

## Другие онлайн-игровые площадки {#other-online-playgrounds}

- [Игровая площадка VueUse](https://play.vueuse.org)
- [Vue + Vite на Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue на CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue на Codepen](https://codepen.io/pen/editor/vue)
- [Vue на Components.studio](https://components.studio/create/vue3)
- [Vue на WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
