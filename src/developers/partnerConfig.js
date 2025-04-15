import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find(partner => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl = 'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    title: 'Найдите лучших Vue.js разработчиков для вашей команды',
    description1: 'Получите доступ к сертифицированным Vue.js разработчикам для вашего следующего проекта.',
    description2: 'Proxify проводит тщательный отбор специалистов, гарантируя высочайшее качество и надежность.',
    hireButton: {
      url: hireUrl,
      label: 'Найдите разработчиков Vue.js'
    },
    footer: 'Найдите лучшего Vue.js разработчика менее чем за 48 часов',
  },

  // Hero Section
  pageJoinSection: {
    title: 'Попасть в список разработчиков',
    description: 'Получите долгосрочную работу с частичной или полной занятостью в компании, которая ищет Vue.js разработчика.',
    applyButton: {
      url: applyUrl,
      label: 'Подать заявку на вступление'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: 'Этот тщательно отобранный разработчик предоставлен партнёром Vue:',
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Профиль кандидата',
    prependText: 'Как наши разработчики оцениваются по параметрам, которые наиболее точно предсказывают успех в данной роли.'
  },

  scoreDiagram: {
    title: 'Оценка инженерного мастерства',
    prependText: 'Шкала оценки варьируется от 0 до 300. На графике показаны распределение баллов всех оценённых Vue.js разработчиков и как оценён ваш кандидат.',
    appendText: 'Данные по 3 661 оценённому Vue.js разработчику из 38 008 кандидатов.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
