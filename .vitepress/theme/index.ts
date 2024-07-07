import './styles/index.css'
import { yandexMetrika } from '@hywax/vitepress-yandex-metrika'
import type { EnhanceAppContext } from 'vitepress'
import { h } from 'vue'
import { VPTheme } from '@vue/theme'
import PreferenceSwitch from './components/PreferenceSwitch.vue'
import SecurityUpdateBtn from './components/SecurityUpdateBtn.vue'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'
import SponsorsAside from './components/SponsorsAside.vue'
import VueSchoolLink from './components/VueSchoolLink.vue'
// import Banner from './components/Banner.vue'
// import TextAd from './components/TextAd.vue'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {
      // banner: () => h(Banner),
      'sidebar-top': () => h(PreferenceSwitch),
      'sidebar-bottom': () => h(SecurityUpdateBtn),
      'aside-mid': () => h(SponsorsAside)
    })
  },
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.provide('prefer-composition', preferComposition)
    ctx.app.provide('prefer-sfc', preferSFC)
    ctx.app.provide('filter-headers', filterHeadersByPreference)
    ctx.app.component('VueSchoolLink', VueSchoolLink)
    // app.component('TextAd', TextAd)

    yandexMetrika(ctx, {
      enabled: import.meta.env.MODE === 'production',
      counter: {
        id: 97196107,
        initParams: {
          trustedDomains: ['ru.vuejs.org']
        },
      },
    })
  }
})
