---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# Станьте спонсором Vue.js {#become-a-vue-js-sponsor}

Vue.js - это проект с открытым исходным кодом по лицензии MIT и совершенно бесплатный для использования.
Огромные усилия, необходимые для поддержания такой большой экосистемы и разработки новых возможностей для проекта, становятся возможными только благодаря щедрой финансовой поддержке наших спонсоров.

## Как спонсировать? {#how-to-sponsor}

Спонсировать можно через [GitHub Sponsors](https://github.com/sponsors/yyx990803) или [OpenCollective](https://opencollective.com/vuejs). Счета можно получить через платежную систему GitHub. Принимаются как ежемесячные спонсорские взносы, так и единовременные пожертвования. Повторяющиеся спонсорские взносы дают право на размещение логотипа, согласно [Уровням спонсорства](#tier-benefits).

Если у вас есть вопросы, касаемо уровней, логистики платежей или данных об экспозиции спонсоров, обращайтесь по адресу [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Спонсирование Vue как бизнес {#sponsoring-vue-as-a-business}

Sponsoring Vue gives you great exposure to over **2 million** Vue developers around the world through our website and GitHub project READMEs. This not only directly generates leads, but also improves your brand recognition as a business that cares about Open Source. This is an intangible but extremely important asset for companies building products for developers, as it improves your conversion rate.

Если вы используете Vue для создания продукта, приносящего доход, то спонсирование разработки Vue имеет смысл для бизнеса: **это гарантирует, что проект, на который опирается ваш продукт, останется здоровым и будет активно поддерживаться.** Экспозиция и положительный образ бренда в сообществе Vue также облегчает привлечение и набор Vue-разработчиков.

Если вы создаете продукт, где вашими целевыми клиентами являются разработчики, вы получите высококачественный трафик благодаря спонсорской поддержке, поскольку все наши посетители - разработчики. Спонсорство также повышает узнаваемость бренда и улучшает конверсию.

## Спонсирование Vue как частное лицо {#sponsoring-vue-as-an-individual}

Если вы индивидуальный пользователь и получаете удовольствие от продуктивности использования Vue, подумайте о пожертвовании в знак признательности - например, угощать нас кофе время от времени. Многие члены нашей команды принимают спонсорскую помощь и пожертвования через GitHub Sponsors. Ищите кнопку "Спонсор" в профиле каждого члена команды на нашей [странице команды](/about/team).

Вы также можете попытаться убедить своего работодателя спонсировать Vue как бизнес. Это может быть нелегко, но бизнес-спонсорство обычно оказывает гораздо большее влияние на устойчивость OSS-проектов, чем индивидуальные пожертвования, так что вы поможете нам гораздо больше, если у вас получится.

## Преимущества за уровень {#tier-benefits}

- **Global Special Sponsor**:
  - Limited to **one** sponsor globally. <span v-if="!data?.special">Currently vacant. [Get in touch](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)!</span><span v-else>(Currently filled)</span>
  - (Exclusive) **Above the fold** logo placement on the front page of [vuejs.org](/).
  - (Exclusive) Special shoutout and regular retweets of major product launches via [Vue's official X account](https://twitter.com/vuejs) (320k followers).
  - Most prominent logo placement in all locations from tiers below.
- **Платина (USD$2,000/месяц)**:
  - Заметное размещение логотипа на главной странице сайта [vuejs.org](/).
  - Заметное размещение логотипа на боковой панели на всех контентных страницах.
  - Заметное размещение логотипа в README во [`vuejs/core`](https://github.com/vuejs/core) и [`vuejs/vue`](https://github.com/vuejs/core).
- **Золото (USD$500/месяц)**:
  - Размещение большого логотипа на главной странице сайта [vuejs.org](/).
  - Размещение большого логотипа в README в `vuejs/core` и `vuejs/vue`.
- **Серебро (USD$250/месяц)**:
  - Размещение среднего логотипа в `BACKERS.md` файле во `vuejs/core` и `vuejs/vue`.
- **Бронза (USD$100/месяц)**:
  - Размещение маленького логотипа в `BACKERS.md` файле во `vuejs/core` и `vuejs/vue`.
- **Щедрый Спонсор (USD$50/месяц)**:
  - Перечисление имени в `BACKERS.md` файле во `vuejs/core` и `vuejs/vue`, выше других индивидуальных спонсоров.
- **Индивидуальный Спонсор (USD$5/месяц)**:
  - Перечисление имени в `BACKERS.md` файле во `vuejs/core` и `vuejs/vue`.

## Текущие спонсоры {#current-sponsors}

### Особый глобальный спонсор {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Платина {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Платина (Китай) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Золото {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Серебро {#silver}

<SponsorsGroup tier="silver" placement="page" />
