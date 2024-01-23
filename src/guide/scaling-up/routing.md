# Роутинг {#routing}

## Маршрутизация на стороне клиента и на стороне сервера {#client-side-vs-server-side-routing}

Маршрутизация на стороне сервера означает отправку сервером ответа на основе пути URL, по которому переходит пользователь. Когда мы щелкаем на ссылке в традиционном веб-приложении с серверным рендерингом, браузер получает HTML-ответ от сервера и перезагружает всю страницу с новым HTML.

Однако в [односторничных приложениях](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA) JavaScript на стороне клиента может перехватывать навигацию, динамически получать новые данные и обновлять текущую страницу без полной перезагрузки страницы. Это, как правило, обеспечивает более быстрое взаимодействие с пользователем, особенно в тех случаях, когда речь идёт о реальных "приложениях", в которых пользователь должен выполнять множество взаимодействий в течение длительного времени.

В таких SPA "маршрутизация" осуществляется на стороне клиента, в браузере. Маршрутизатор на стороне клиента отвечает за управление отображаемым представлением приложения, используя такие API браузера, как [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) или [событие `hashchange`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event).

## Официальный роутер {#official-router}

<!-- TODO update links -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="Бесплатный курс по Vue Router">
    Посмотрите бесплатный видеокурс от Vue School
  </VueSchoolLink>
</div>

Vue хорошо подходит для создания SPA. Для большинства SPA рекомендуется использовать официально поддерживаемую [библиотеку Vue Router](https://github.com/vuejs/router). Более подробную информацию по Vue Router можно найти в [документации](https://router.vuejs.org/).

## Простая маршрутизация с нуля {#simple-routing-from-scratch}

Если вам нужна только очень простая маршрутизация и вы не хотите привлекать полнофункциональный роутер, то можно обойтись [динамическими компонентами](/guide/essentials/component-basics#dynamic-components) и обновлять текущее состояние компонента, прослушивая [`hashchange` события](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) браузера или используя [History API](https://developer.mozilla.org/en-US/docs/Web/API/History).

Приведем простой пример:

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Главная страница</a> |
  <a href="#/about">О нас</a> |
  <a href="#/non-existent-path">Несуществующая ссылка</a>
  <component :is="currentView" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Главная страница</a> |
  <a href="#/about">О нас</a> |
  <a href="#/non-existent-path">Несуществующая ссылка</a>
  <component :is="currentView" />
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
