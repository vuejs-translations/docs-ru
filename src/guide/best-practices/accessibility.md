# Доступность {#accessibility}

Веб-доступность (сокращённо на английском — a11y) — это практика создания сайтов, которые могут быть использованы каждым человеком независимо от его инвалидности, скорости интернета, использовании старого или повреждённого оборудования, или просто нахождении в некомфортных местах. К примеру, добавление субтитров к видеороликам может помочь как глухим, слабослышащим людям, так и тем, кто в данный момент находится в шумной обстановке и не могут услышать звук со своего телефона. Аналогично, улучшив контрастность текста можно облегчить чтение людям с ослабленным зрением, а также тем, кто использует телефон при ярком солнечном свете.

Хотите сделать свои сайты доступными, но не знаете с чего начать?

Ознакомьтесь с [руководством по планированию и управлению веб-доступностью](https://www.w3.org/WAI/planning-and-managing/) от [консорциума Всемирной паутины (World Wide Web Consortium, W3C)](https://www.w3.org/)

## Ссылка для перехода к основному контенту {#skip-link}

Хорошая практика — добавить ссылку в начале каждой страницы, которая позволит пользователям быстро переходить к области основного содержимого на ней, что позволит пропустить повторяющееся элементы на веб-страницах.

Как правило, такая ссылка размещается в самом верху разметки главного компонента `App.vue`, поскольку она должна стать первым фокусируемым элементом для всех страниц:

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Перейти к основному содержанию</a>
  </li>
</ul>
```

Чтобы скрыть ссылку до тех пор, пока она не получит фокус, можно добавить следующие стили:

```css
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

При переходе на новую страницу возвращаем фокус обратно на ссылку. Для этого вызовем соответствующий метод на элементе через ref (при условии использования `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[Документация о реализации ссылок для перехода к основному содержимому](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Структурирование содержимого {#content-structure}

Одна из важнейших частей доступности — разработка дизайна с прицелом на доступность. Дизайн должен рассматривать не только цветовой контраст, шрифт, размер текста и язык, но и то, как структурировать содержимое в приложении.

### Заголовки {#headings}

Пользователи могут осуществлять навигацию по заголовкам в приложении. Наличие заголовков для каждого раздела даст общее представление об содержащейся в них информации. Несколько полезных рекомендаций для улучшения доступности заголовков:

- Используйте вложенные заголовки в порядке очерёдности: `<h1>` - `<h6>`
- Не пропускайте заголовки внутри раздела
- Следует использовать именно теги заголовков вместо стилизации текста

[Узнать подробнее про заголовки](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Основной заголовок</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1"> Заголовок раздела </h2>
    <h3>Вложенный заголовок раздела</h3>
    <!-- Содержимое -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2"> Заголовок раздела </h2>
    <h3>Вложенный заголовок раздела</h3>
    <!-- Содержимое -->
    <h3>Вложенный заголовок раздела</h3>
    <!-- Содержимое -->
  </section>
</main>
```

### Ориентиры {#landmarks}

[Ориентиры](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) (landmarks) предоставляют программный доступ к разделам приложения. Пользователи, использующие вспомогательные технологии, могут перейти непосредственно к каждому разделу приложения минуя остальное содержимое. Для этого следует использовать [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).

| HTML    | ARIA Role            | Назначение ориентира                                                                                             |
|---------|----------------------|------------------------------------------------------------------------------------------------------------------|
| header  | role="banner"        | Основной заголовок: заголовок страницы                                                                           |
| nav     | role="navigation"    | Коллекция ссылок для перемещения по странице или другим страницам                                                |
| main    | role="main"          | Основное или самое важное содержимое на странице                                                                 |
| footer  | role="contentinfo"   | Информация о странице: сноски, авторские права, ссылки на политику конфиденциальности                            |
| aside   | role="complementary" | Дополнение к основному содержимому                                                                               |
| search  | role="search"        | Раздел, содержащий функциональность поиска по приложению                                                         |
| form    | role="form"          | Коллекция элементов формы                                                                                        |
| section | role="region"        | Сопутствующее содержимое, которое пользователь возможно захочет изучить. Для такого элемента нужно указать метку |

[Подробнее про ориентиры](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Семантические формы {#semantic-forms}

При создании формы можно использовать следующие элементы: `<form>`, `<label>`, `<input>`, `<textarea>`, и `<button>`

Как правило, метки размещаются сверху или слева от полей формы:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

Обратите внимание, можно добавить `autocomplete='on'` к самому элементу формы, и этот атрибут применится ко всем полям формы. Каждому полю можно задать свои [значения атрибута autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).

### Метки {#labels}

Добавляйте метки для описания полей формы, а также создания связи между элементами с атрибутами `for` и `id`:

```vue-html
<label for="name">Название:</label>
<input type="text" name="name" id="name" v-model="name" />
```

Если посмотреть элемент через инструменты разработки (например, DevTools в браузере Chrome) и перейти на вкладку Accessibility внутри раздела Elements, то можно увидеть, что имя поля извлекается из связанной с ним метки:

![Инструменты разработчика в Chrome показывают имя для поля из метки](./images/AccessibleLabelChromeDevTools.png)

:::warning Предупреждение
Часто можно встретить случаи, когда поле ввода находится внутри элемента с меткой:

```vue-html
<label>
  Название:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Однако явное указание меткам соответствующего идентификатора лучше поддерживается вспомогательными технологиями.
:::

#### `aria-label` {#aria-label}

Указать имя поля для использования вспомогательными технологиями можно с помощью атрибута [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).

```vue-html
<label for="name">Название:</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

Можно убедиться самостоятельно что имя элемента изменилось с помощью инструментов разработки Chrome DevTools:

![Инструменты разработчика в Chrome показывают имя поля из aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

Использование атрибута [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) похоже на `aria-label`, за исключением того, что текст метки показывается на экране. Он создаёт связь между элементами с атрибутом `id`, причём допускается указывать несколько `id`:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Выставление счетов</h1>
  <div class="form-item">
    <label for="name">Название:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

![Chrome Developer Tools showing input accessible name from aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

Атрибут [aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) используется аналогично `aria-labelledby`, но предоставляет дополнительную информацию, которая может потребоваться пользователю. Его можно использовать для описания критериев любых полей:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Выставление счетов</h1>
  <div class="form-item">
    <label for="name">Полное название:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Пожалуйста, укажите имя и фамилию.</p>
  </div>
  <button type="submit">Отправить</button>
</form>
```

Вы можете просмотреть описание, заглянув в Chrome DevTools:

![Инструменты разработчика в Chrome показывают имя поля из aria-labelledby и описание с использованием aria-describedby](./images/AccessibleARIAdescribedby.png)

### Подсказка внутри поля (Placeholder) {#placeholder}

Старайтесь ограничить использование подсказок внутри полей, так как они могут запутать пользователя.

Одна из проблем заключается в том, что по умолчанию подсказки внутри полей не соответствуют [критериям цветового контраста](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). Попытка исправить цветовой контраст может сделать подсказку похожей на уже заполненное поле. Посмотрите на следующий пример: подсказка поля Last Name соответствует критериям цветового контраста, но не отличается от введённого значения:

![Доступный вариант placeholder](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

Поэтому будет лучше всего перенести всю необходимую информацию для заполнения за пределы полей формы.

### Инструкции {#instructions}

При добавлении инструкций для заполнения убедитесь, что они связаны с нужным полем.
Можно указать дополнительные инструкции и привязать несколько идентификаторов в атрибуте [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). Это делает дизайн более гибким.

```vue-html
<fieldset>
  <legend>Использование aria-labelledby</legend>
  <label id="date-label" for="date">Текущая дата:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

В качестве альтернативы, можно привязать инструкции к полю с помощью атрибута [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Использование aria-describedby</legend>
  <label id="dob" for="dob">Дата рождения:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### Скрытие содержимого {#hiding-content}

Обычно не рекомендуется визуально скрывать лейблы, даже если для поля ввода задано вспомогательное имя. Тем не менее, если смысл поля понятен из контекста, то лейбл можно скрыть.

Рассмотрим следующее поле поиска:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Поиск: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Поиск</button>
</form>
```

В данном случае можно скрыть лейбл, поскольку кнопка поиска поможет зрячим пользователям определить назначение поля.

С помощью CSS-класса визуально скрываем элемент, но оставляем их доступными для вспомогательных технологий:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

Добавление `aria-hidden="true"` скроет элемент от обнаружения вспомогательными технологиями, но оставит его визуально доступным для остальных пользователей. Не используйте его на фокусируемых элементах, только для декоративных, дублирующихся или не отображаемых на экране элементов.

```vue-html
<p>Это не скрыто от устройств чтения с экрана.</p>
<p aria-hidden="true">Это скрыто от устройств чтения с экрана.</p>
```

### Кнопки {#buttons}

При использовании кнопок внутри формы, следует указывать их тип, чтобы избежать отправки формы.
Для создания кнопок также можно использовать обычное поле ввода:

```vue-html
<form Кнопки="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Кнопки -->
  <button type="button">Отменить</button>
  <button type="submit">Отправить</button>

  <!-- Кнопки ввода -->
  <input type="button" value="Отменить" />
  <input type="submit" value="Отправить" />
</form>
```

### Функциональные изображения {#functional-images}

Для создания функциональных изображений можно использовать приведенную ниже технику.

- Поля ввода

  - Изображение будет работать как кнопка отправки формы

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Поиск: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Поиск"
    />
  </form>
  ```

- Иконки

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Поиск: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Поиск</span>
  </button>
</form>
```

## Стандарты {#standards}

Инициатива веб-доступности (Web Accessibility Initiative, WAI) консорциума Всемирной паутины (World Wide Web Consortium, W3C) разработала стандарты для обеспечения доступности:

- [Руководства по доступности пользовательских программ (User Agent Accessibility Guidelines, UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - касается браузеров и медиа-плееров, включая вспомогательные технологии
- [Руководства по доступности средств разработки авторского контента (Authoring Tool Accessibility Guidelines, ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - распространяется на приложения для создания веб-страниц
- [Руководства по доступности веб-содержимого (Web Content Accessibility Guidelines, WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - относится к содержимому в вебе, используемому разработчиками, программами для создания веб-страниц и инструментами для оценки доступности

### Руководства по доступности веб-содержимого (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) продолжение [WCAG 2.0](https://www.w3.org/TR/WCAG20/), в котором были учтены новые веб-технологии. При разработке новых или обновлении существующих политик по обеспечению веб-доступности консорциум W3C настоятельно рекомендует использовать последнюю версию стандарта WCAG.

#### Четыре базовых принципа WCAG 2.1 (сокращённо POUR): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Perceivable (Воспринимаемость)](https://www.w3.org/TR/WCAG21/#perceivable)
  - Представленная информация должна быть доступной для всех пользователей
- [Operable (Управляемость)](https://www.w3.org/TR/WCAG21/#operable)
  - Компоненты интерфейса, элементы управления и навигации поддерживают управление с клавиатуры
- [Understandable (Понятность)](https://www.w3.org/TR/WCAG21/#understandable)
  - Информация и функционирование интерфейса должны быть понятны всем пользователям
- [Robust (Надёжность)](https://www.w3.org/TR/WCAG21/#robust)
  - Рабочий доступ к информации вне зависимости от технологии, используемой пользователями

#### Инициатива веб-доступности – Доступные полнофункциональные интернет-приложения (Accessible Rich Internet Applications, WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

Стандарт WAI-ARIA компании от W3C служит руководством по созданию динамического содержимого и расширенных средств для управления интерфейсом.

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Ресурсы {#resources}

### Документация {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Вспомогательные технологии {#assistive-technologies}

- Программы для чтения экрана
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Программы для увеличения/уменьшения области просмотра
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Тестирование {#testing}

- Автоматизированные инструменты
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Инструменты для работы с цветом
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Другие полезные инструменты
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Пользователи {#users}

Согласно Всемирной организации здравоохранения, 15% населения мира имеет какую-либо форму инвалидности, 2-4% из них — тяжёлую форму. По оценкам ВОЗ, в мире насчитывается примерно 1 миллиард инвалидов, что делает их самой крупной группой меньшинств в мире.

Существует очень много инвалидностей, которые примерно можно разделить на четыре категории:

- _[Визуальные](https://webaim.org/articles/visual/)_ - Таким пользователям могут помочь программы для чтения с экрана, увеличения экрана, управления контрастностью экрана, либо брайлевский дисплей.
- _[Слуховые](https://webaim.org/articles/auditory/)_ - Таким пользователям могут помочь субтитры, расшифровки или видео с языком жестов.
- _[Двигательные](https://webaim.org/articles/motor/)_ - Таким пользователям могут помочь разные [вспомогательные технологии при двигательных нарушений](https://webaim.org/articles/motor/assistive): программы для распознавания голоса, отслеживания глаза, устройства для простого управления, головные щуп-указки, устройства для управления указателем мыши без рук, безразмерные трекбол-мыши, сенсорные клавиатуры или другие вспомогательные технологии.
- _[Когнитивные](https://webaim.org/articles/cognitive/)_ - Таким пользователям могут помочь дополнительные медиа, структурированная организация содержимого, понятный и простой стиль написания. Ознакомьтесь со следующими ссылками WebAim, чтобы понять их у пользователей.

Посмотрите следующие ссылки из WebAim для понимания проблемы со стороны пользователей:

- [Web Accessibility Perspectives: Explore the Impact and Benefits for Everyone](https://www.w3.org/WAI/perspective-videos/)
- [Stories of Web Users](https://www.w3.org/WAI/people-use-web/user-stories/)
