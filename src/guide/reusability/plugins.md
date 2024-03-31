# Плагины {#plugins}

## Вступление {#introduction}

Плагины — это самодостаточный код, который обычно добавляет функциональность к Vue на уровне приложения. Вот как мы устанавливаем плагин:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* дополнительные опции */
})
```

Плагин определяется либо как объект, который предоставляет метод `install()`, либо просто как функция, которая действует как сама функция установки. Функция установки получает [экземпляр приложения](/api/application) вместе с дополнительными опциями, которые передаются в `app.use()`, если таковые имеются:

```js
const myPlugin = {
  install(app, options) {
    // настройка приложения
  }
}
```

Нет чётко определенной области применения плагина, но наиболее распространенные сценарии, в которых плагины полезны, включают в себя:

1. Регистрация одного или нескольких глобальных компонентов или пользовательских директив в [`app.component()`](/api/application#app-component) и [`app.directive()`](/api/application#app-directive).

2. Сделать ресурс [injectable](/guide/components/provide-inject) во всём приложении через вызов [`app.provide()`](/api/application#app-provide).

3. Добавление некоторых свойств или методов глобального экземпляра, присоединив их к [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Библиотека, которая должна выполнить определенную комбинацию вышеупомянутого (например, [vue-router](https://github.com/vuejs/vue-router-next)).

## Написание плагина{#writing-a-plugin}

Чтобы лучше понять, как создавать собственные плагины Vue.js, мы создадим очень упрощённую версию плагина, который отображает строки `i18n` (сокращённо от [Интернационализация](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

Начнём с настройки объекта плагина. Рекомендуется создать его в отдельном файле и экспортировать, как показано ниже, чтобы держать логику отдельно.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Здесь содержится код плагина
  }
}
```

Мы хотим создать функцию перевода. Эта функция получит разделенную точками строку `key`, которую мы будем использовать для поиска перевода строки в опциях, предоставленных пользователем. Это предполагает использование в шаблонах:
```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Поскольку эта функция должна быть глобально доступной во всех шаблонах, мы сделаем ее таковой, присоединив к `app.config.globalProperties` нашего плагина:

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // введение глобально доступного метода $translate()
    app.config.globalProperties.$translate = (key) => {
      // получить вложенное свойство в `options`,
      // используя `key` в качестве пути
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Наша функция `$translate` возьмёт строку, например, `greetings.hello`, заглянет в предоставленную пользователем конфигурацию и вернёт переведенное значение.

Объект, содержащий переведенные ключи, следует передать плагину при установке с помощью дополнительных параметров к `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Теперь наше исходное выражение `$translate('greetings.hello')` будет заменено на `Bonjour!` во время выполнения.

Смотрите также: [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Используйте глобальные свойства редко, поскольку это может быстро запутать, если в приложении используется слишком много глобальных свойств, введенных различными плагинами.
:::

### Provide / Inject с плагинами {#provide-inject-with-plugins}

Плагины также позволяют нам использовать `inject`, чтобы предоставить функцию или атрибут пользователям плагина. Например, мы можем позволить приложению иметь доступ к параметру `options`, чтобы иметь возможность использовать объект с переводами.

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Пользователи плагина теперь смогут добавлять его параметры в свои компоненты с помощью ключа `i18n`:

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
