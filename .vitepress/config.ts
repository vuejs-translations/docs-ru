import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Документация',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Руководство', link: '/guide/introduction' },
      { text: 'Интерактивный учебник', link: '/tutorial/' },
      { text: 'Примеры', link: '/examples/' },
      { text: 'Быстрый старт', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: 'Глоссарий', link: '/glossary/' },
      { text: 'Руководство по ошибкам', link: '/error-reference/' },
      {
        text: 'Документация для Vue 2',
        link: 'https://ru.vuejs.org/'
      },
      {
        text: 'Руководство по миграции с Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Песочница',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Экосистема',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Ресурсы',
        items: [
          { text: 'Партнёры', link: '/partners/' },
          { text: 'Разработчики', link: '/developers/' },
          { text: 'Темы', link: '/ecosystem/themes' },
          { text: 'UI компоненты', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Сертификация',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Вакансии', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Магазин футболок', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Официальные библиотеки',
        items: [
          { text: 'Vue Router', link: 'https://vue-router-ru.netlify.app/' },
          { text: 'Pinia', link: 'https://pinia-ru.netlify.app/' },
          { text: 'Инструментарий', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: 'Видео-курсы',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Помощь',
        items: [
          {
            text: 'Чат в Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Обсуждения в GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Сообщество разработчиков', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Новости',
        items: [
          { text: 'Блог', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'События', link: 'https://events.vuejs.org/' },
          { text: 'Рассылка', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'О нас',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Команда', link: '/about/team' },
      { text: 'Релизы', link: '/about/releases' },
      {
        text: 'Путеводитель по сообществу',
        link: '/about/community-guide'
      },
      { text: 'Нормы поведения', link: '/about/coc' },
      { text: 'Политика конфиденциальности', link: '/about/privacy' },
      {
        text: 'Документальный фильм',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Спонсоры',
    link: '/sponsor/'
  },
  {
    text: 'Эксперты',
    badge: { text: 'NEW' },
    activeMatch: `^/(partners|developers)/`,
    items: [
      { text: 'Партнёры', link: '/partners/' },
      { text: 'Разработчики', link: '/developers/', badge: { text: 'NEW' } }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Приступая к изучению',
      items: [
        { text: 'Введение', link: '/guide/introduction' },
        {
          text: 'Быстрый старт',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Основы',
      items: [
        {
          text: 'Создание приложения',
          link: '/guide/essentials/application'
        },
        {
          text: 'Синтаксис шаблонов',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Основы реактивности',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Вычисляемые свойства',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Работа с классами и стилями',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Условная отрисовка',
          link: '/guide/essentials/conditional'
        },
        { text: 'Отрисовка списков', link: '/guide/essentials/list' },
        {
          text: 'Обработка событий',
          link: '/guide/essentials/event-handling'
        },
        { text: 'Работа с формами', link: '/guide/essentials/forms' },
        { text: 'Наблюдатели', link: '/guide/essentials/watchers' },
        { text: 'Ссылки на элементы шаблона', link: '/guide/essentials/template-refs' },
        {
          text: 'Основы компонентов',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'Lifecycle Hooks',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'Продвинутые компоненты',
      items: [
        {
          text: 'Регистрация компонентов',
          link: '/guide/components/registration'
        },
        { text: 'Входные параметры', link: '/guide/components/props' },
        { text: 'События', link: '/guide/components/events' },
        { text: 'Component v-model', link: '/guide/components/v-model' },
        {
          text: 'Передача обычных атрибутов',
          link: '/guide/components/attrs'
        },
        { text: 'Слоты', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Асинхронные компоненты',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Переиспользование',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Пользовательские директивы',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Плагины', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Встроенные компоненты',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Масштабирование',
      items: [
        { text: 'Однофайловые компоненты', link: '/guide/scaling-up/sfc' },
        { text: 'Инструментарий', link: '/guide/scaling-up/tooling' },
        { text: 'Роутинг', link: '/guide/scaling-up/routing' },
        {
          text: 'Управление состоянием приложения',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Тестирование', link: '/guide/scaling-up/testing' },
        {
          text: 'Отрисовка на стороне сервера',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Лучшие практики',
      items: [
        {
          text: 'Публикация на production',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Производительность',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Доступность',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Безопасность',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Обзор', link: '/guide/typescript/overview' },
        {
          text: 'Использование с Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'Использование с Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Дополнительные темы',
      items: [
        {
          text: 'Способы использования Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'FAQ по Composition API',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Подробнее о реактивности',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Механизмы отрисовки',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Render-функции & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue и веб-компоненты',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Техники анимации',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'Глобальное API',
      items: [
        { text: 'Приложение', link: '/api/application' },
        {
          text: 'Основное',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Реактивность: Основное',
          link: '/api/reactivity-core'
        },
        {
          text: 'Реактивность: Утилиты',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Реактивность: Продвинутая',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Хуки жизненного цикла',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Внедрение зависимостей',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Helpers',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Опции: Состояние', link: '/api/options-state' },
        { text: 'Опции: Отрисовка', link: '/api/options-rendering' },
        {
          text: 'Опции: Жизненный цикл',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Опции: Композиция',
          link: '/api/options-composition'
        },
        { text: 'Опции: Прочее', link: '/api/options-misc' },
        {
          text: 'Экземпляр компонента',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Встроенное',
      items: [
        { text: 'Директивы', link: '/api/built-in-directives' },
        { text: 'Компоненты', link: '/api/built-in-components' },
        {
          text: 'Специальные элементы',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Специальные атрибуты',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Однофайловый компонент',
      items: [
        { text: 'Спецификация синтаксиса', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Возможности CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Продвинутое API',
      items: [
        { text: 'Пользовательские элементы', link: '/api/custom-elements' },
        { text: 'Render-функция', link: '/api/render-function' },
        { text: 'Отрисовка на стороне сервера', link: '/api/ssr' },
        { text: 'Вспомогательные типы TypeScript', link: '/api/utility-types' },
        { text: 'Пользовательский рендерер', link: '/api/custom-renderer' },
        { text: 'Compile-Time Flags', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Basic',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Handling User Input',
          link: '/examples/#handling-input'
        },
        {
          text: 'Attribute Bindings',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Conditionals and Loops',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Form Bindings',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Simple Component',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Practical',
      items: [
        {
          text: 'Markdown Editor',
          link: '/examples/#markdown'
        },
        {
          text: 'Fetching Data',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Grid with Sort and Filter',
          link: '/examples/#grid'
        },
        {
          text: 'Tree View',
          link: '/examples/#tree'
        },
        {
          text: 'SVG Graph',
          link: '/examples/#svg'
        },
        {
          text: 'Modal with Transitions',
          link: '/examples/#modal'
        },
        {
          text: 'List with Transitions',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Counter',
          link: '/examples/#counter'
        },
        {
          text: 'Temperature Converter',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Flight Booker',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Timer',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Circle Drawer',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Cells',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Руководство по стилю',
      items: [
        {
          text: 'Обзор',
          link: '/style-guide/'
        },
        {
          text: 'A - Основные',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Настоятельно рекомендуются',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Рекомендуются',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Используйте с осторожностью',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: 'Поиск',
  menu: 'Меню',
  toc: 'Содержание',
  returnToTop: 'Вернуться к началу',
  appearance: 'Внешний вид',
  previous: 'Предыдущая',
  next: 'Следующая',
  pageNotFound: 'Страница не найдена',
  deadLink: {
    before: 'Вы перешли по несуществующей ссылке: ',
    after: '.'
  },
  deadLinkReport: {
    before: 'Можно  ',
    link: 'указать нам на неё',
    after: ', чтобы мы смогли её исправить'
  },
  footerLicense: {
    before: '',
    after: ''
  },

  // aria labels
  ariaAnnouncer: {
    before: '',
    after: 'Уже загружено'
  },
  ariaDarkMode: 'Переключение в тёмный режим',
  ariaSkip: 'Перейти к содержанию',
  ariaTOC: 'Оглавление текущей страницы',
  ariaMainNav: 'Основная навигация',
  ariaMobileNav: 'Навигация по мобильной версии',
  ariaSidebarNav: 'Навигация в боковой панели',
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://ru.vuejs.org'
  },

  lang: 'ru-RU',
  title: 'Vue.js',
  description: 'Vue.js - Прогрессивный JavaScript-фреймворк',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - The Progressive JavaScript Framework'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/uwu.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/translation-gang/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: '/translations/',
        text: 'Help Us Translate!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'ru-vuejs',
      appId: '5RTQ6TI35H',
      apiKey: 'c4095d6d1e93c25ca93b3ca0030338ef',
    },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-ru',
      text: 'Исправить эту страницу на GitHub'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
})
