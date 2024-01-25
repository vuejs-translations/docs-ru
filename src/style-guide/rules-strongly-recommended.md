# Правила приоритета B: Настоятельно рекомендуются {#priority-b-rules-strongly-recommended}

Эти правила помогают улучшить читаемость и/или опыт разработчика в большинстве проектов. Ваш код все равно выполнится, если вы их нарушите, но эти нарушения должны быть редкими и обоснованными.

## Файлы компонентов {#component-files}

**Несмотря на то, что ваша система сборки приложения может конкатенировать файлы, каждый компонент должен быть в отдельном файле.**

Это поможет вам быстрее находить компонент, который нужно поменять или с которым нужно ознакомиться для дальнейшего использования.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Регистр SFC-файла {#single-file-component-filename-casing}

**Имена файлов [Single-File Components](/guide/scaling-up/sfc) должны всегда быть либо в PascalCase, либо в kebab-case.**

PascalCase работает лучше с автодополнением в редакторах кода, так как он соответствует тому, как мы ссылаемся на компоненты в JSX и в шаблонах, где это возможно. Однако имена файлов в смешанном стиле иногда могут создать проблемы в файловых системах, не зависящих от регистра, поэтому kebab-case также допустим.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Имена базовых компоненов {#base-component-names}

**Базовые компоненты (они же презентационные, глупые или чистые компоненты), которые используют специфичные для приложения стили и соглашения, должны всегда начинаться со специального префикса, например `Base`, `App` или `V`.**

::: details Подробное объяснение
Эти компоненты закладывают основу для согласованного стиля и поведения в рамках вашего приложения. Они содержат **только**:

- HTML-элементы,
- другие базовые компоненты и
- сторонние UI-компоненты.

Но они никогда не будут содержать глобального состояния (например, из [Pinia-хранилища](https://pinia.vuejs.org/)).

Имена этих файлов часто содержат имя элемента, который используют (например, `BaseButton`, `BaseTable`), если не существует элемента для конкретной цели (например, `BaseIcon`). Если вы будете создавать похожие компоненты для более специфичного случая, они почти всегда будут использовать базовые компоненты (например `BaseButton` может быть использован в `ButtonSubmit`).

Преимущества этого соглашения:

- При алфавитном порядке расположения базовые компоненты вашего приложения будут перечисляться вместе, что облегчает их поиск.

- Поскольку имена компонентов всегда должны состоять из нескольких слов, это соглашение избавляет вас от необходимости выбрать произвольных префикс для простых компонентов-оберток (например, `MyButton`, `VueButton`).

- Посколько эти компоненты часто используются, вы, возможно, захотите сделать их глобальными, вместо того, чтобы импортировать их везде. Префикс позволяет сделать это в Webpack:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Имена тесносвязанных компонентов {#tightly-coupled-component-names}

**Дочерние компоненты, которые тесно связаны с родителем, должны использовать имя родительского компонента как префикс.**

Если компонент имеет смысл только в рамках одного родительского компонента, тогда это отношение должно быть очевидно из его имени. Так как редакторы обычно располагают файлы в алфавитном порядке, то это также позволит хранить связанные файлы рядом друг с другом.

::: details Подробное объяснение
Возможно, у вас появится соблазн решить данную проблему, вложив дочерние компоненты в папки, которые названы в честь родителя компонентов. Например:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

или:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Так делать не рекомендуется, так как в результате:

- Много файлов с одинаковыми именами, что затрудняет быстро переключаться между файлами в редакторе.
- Много вложенных друг в друга папок, что увеличивает время поиска компонента в левом меню редактора. 
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Порядок слов в именах компонентов {#order-of-words-in-component-names}

**Имена компонентов должны начинаться с общих слов и заканчиваться описательными словами.**

::: details Подробное объяснение
Вы можете подумать:

> "Почему мы должны пытаться использовать непривычный нам язык для имён компонентов?"

In natural English, adjectives and other descriptors do typically appear before the nouns, while exceptions require connector words. For example:
В английском языке прилагательные и другие описывающие слова идут до существительных, а исключения требуют связывающих слов. Например:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

При желании вы можете включить эти связывающие слова в названия компонентов, но порядок все ещё остается важным.

Also note that **what's considered "highest-level" will be contextual to your app**. For example, imagine an app with a search form. It may include components like this one:
Также обратите внимание, что **общие слова зависят от контекста вашего приложения**. Например, представьте приложение с формой поиска. Оно может включать примерно такие компоненты:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

As you might notice, it's quite difficult to see which components are specific to the search. Now let's rename the components according to the rule:
Как вы могли заметить, довольно тяжело, какие конкретно компоненты относятся к поиску. Давайте переименуем компоненты, исходя из описанного выше правила:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Since editors typically organize files alphabetically, all the important relationships between components are now evident at a glance.
Так как редакторы сортируют файлы в алфавитном порядке, все важные связи между компонентами видны с первого взгляда.

You might be tempted to solve this problem differently, nesting all the search components under a "search" directory, then all the settings components under a "settings" directory. We only recommend considering this approach in very large apps (e.g. 100+ components), for these reasons:
У вас может возникнуть соблазн решить эту проблему по-другому - компоненты поиска положить в папку "search", компоненты настроек - в папку "settings". Мы рекомендуем следовать этому правилу только в очень больших проектах (100+ компонентов) по этим причинам:

- Навигация через папки занимает очень много времени, нежели скролл в одной единственной папке `components`.
- Конфликты имен (например, множественные `ButtonDelete.vue` компоненты) усложняют процесс быстрой навигации к конкретному компоненту в редакторе кода.
- Рефакторинг становится сложнее, потому что просто "найти и изменить" часто недостаточно для относительных ссылок. 
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Самозакрывающиеся компоненты {#self-closing-components}

**Компоненты без контента внутри должны быть самозакрывающимися в [Single-File Components](/guide/scaling-up/sfc), в строковых шаблонах и в [JSX](/guide/extras/render-function#jsx-tsx) - но не в сыром HTML.**

Самозакрывающиеся компоненты не только говорят о том, что у них нет контента, но и **подразумевают**, что не должны иметь контента. Это разница между пустой страницей в книге и пустой страницей с подписью "Эта страница намеренно пустая." Ваш код становится также чище без ненужного закрытия тега.

К сожалению, HTML не разрешает пользовательским элементам быть самозакрывающимимся - только [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). Вот почему это правило возможно только при помощи компилятора шаблонов самого Vue - он "подгоняет" к соответствующему спецификации HTML шаблону.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<!-- Внутри SFC, строковых шаблонах и JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- В сыром index.html -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- Внутри SFC, строковых шаблонах и JSX -->
<MyComponent/>
```

```vue-html
<!-- В сыром index.html -->
<my-component></my-component>
```

</div>

## Регистр имён компонентов в шаблонах {#component-name-casing-in-templates}

**В большинстве проектов регистром имён компонентов должен быть PascalCase внутри [Single-File Components](/guide/scaling-up/sfc) и строковых литералах, но внутри сырого HTML регистром должен быть kebab-case.**

PascalCase has a few advantages over kebab-case:
PascalCase имеет несколько преимуществ над kebab-case:

- Редакторы могут автодополнять имена компонентов в шаблоне, потому что PascalCase также используется в JavaScript.
- `<MyComponent>` визуально сильнее отличается от HTML-элемента в одно слово, чем `<my-component>`, потому что есть два отличия (две заглавные буквы), а не только одно (дефис).
- Если вы используете пользовательские не Vue-элементы в шаблонах, например веб-компоненты, PascalCase обеспечивает визуальное отличие ваших Vue-компонентов.

К сожалению, из-за нечувствительности HTML к регистру, шаблоны внутри сырого HTML должны использовать kebab-case.

Также стоит заметить, что если вы уже в большинстве шаблонов используете kebab-case, то следование HTML соглашениям и возможность иметь одинаковые регистр внутри всего вашего приложения могут быть более важными, чем описанные выше преимущества. В таких случаях, **используете kebab-case повсеместно**.

<div class="style-example style-example-bad">
<h3>Хорошо</h3>

```vue-html
<!-- Внутри SFC и строковых шаблонах-->
<mycomponent/>
```

```vue-html
<!-- Внутри SFC и строковых шаблонах-->
<myComponent/>
```

```vue-html
<!-- В сыром index.html -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- Внутри SFC и строковых шаблонах-->
<MyComponent/>
```

```vue-html
<!-- В сыром index.html -->
<my-component></my-component>
```

ИЛИ

```vue-html
<!-- Везде -->
<my-component></my-component>
```

</div>

## Регистр имен компонентов в JS/JSX {#component-name-casing-in-js-jsx}

**Имена компонентов в JS/[JSX](/guide/extras/render-function#jsx-tsx) должны быть всегда в PascalCase, хотя они могут иметь kebab-case внутри строк для простых приложений, которые используют регистрацию глобальных компонентов через `app.component`.**

::: details Подробное объяснение
В JavaScript PascalCase - это соглашение для классов и конструкторов прототипов - по сути, для всего, что может иметь отдельные экземпляры. Vue-компоненты также могут иметь экземпляры, так что имеет смысл использовать PascalCase. Дополнительное преимущество использовать PascalCase внутри JSX (и шаблонов) позволяет тому, что читает код, легче отличать компоненты и HTML-элементы.

However, for applications that use **only** global component definitions via `app.component`, we recommend kebab-case instead. The reasons are:
Однако, для приложений, которые используют **только** определение глобальных компонентов через `app.component`, мы рекомендуем использовать kebab-case. И вот почему:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- Редко приходится ссылаться на глобальные компоненты из JavaScript, так что следование соглашению для JavaScript имеет все меньший смысл.
- Такие приложения всегда используют сырую HTML-разметку, где [kebab-case **должен** быть использован](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Full-word component names {#full-word-component-names}

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

<div class="style-example style-example-bad">
<h3>Bad</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Prop name casing {#prop-name-casing}

**Prop names should always use camelCase during declaration. When used inside in-DOM templates, props should be kebab-cased. Single-File Components templates and [JSX](/guide/extras/render-function#jsx-tsx) can use either kebab-case or camelCase props. Casing should be consistent - if you choose to use camelCased props, make sure you don't use kebab-cased ones in your application**

<div class="style-example style-example-bad">
<h3>Bad</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// for in-DOM templates
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// for SFC - please make sure your casing is consistent throughout the project
// you can use either convention but we don't recommend mixing two different casing styles
<WelcomeMessage greeting-text="hi"/>
// or
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// for in-DOM templates
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Multi-attribute elements {#multi-attribute-elements}

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is widely considered a good convention, because it's much easier to read. Our templates and [JSX](/guide/extras/render-function#jsx-tsx) deserve the same consideration.

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Simple expressions in templates {#simple-expressions-in-templates}

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue-html
<!-- In a template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// The complex expression has been moved to a computed property
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Simple computed properties {#simple-computed-properties}

**Complex computed properties should be split into as many simpler properties as possible.**

::: details Detailed Explanation
Simpler, well-named computed properties are:

- **Easier to test**

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- **Easier to read**

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- **More adaptable to changing requirements**

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.
  :::

<div class="style-example style-example-bad">
<h3>Bad</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Quoted attribute values {#quoted-attribute-values}

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Directive shorthands {#directive-shorthands}

**Directive shorthands (`:` for `v-bind:`, `@` for `v-on:` and `#` for `v-slot`) should be used always or never.**

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```vue-html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>
