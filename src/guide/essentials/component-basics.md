# Основы компонентов {#components-basics}

Компоненты позволяют нам разделить пользовательский интерфейс на независимые и многократно используемые части и думать о каждой части в отдельности. Обычно приложение организовано в виде дерева вложенных друг в друга компонентов:

![Дерево компонентов](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Это очень похоже на то, как мы вкладываем собственные HTML-элементы, но Vue реализует свою собственную модель компонентов, которая позволяет нам инкапсулировать пользовательское содержимое и логику в каждый компонент. Vue также хорошо сочетается с родными веб-компонентами. Если вам интересно узнать о взаимосвязи между компонентами Vue и родными веб-компонентами, [читайте подробнее здесь](/guide/extras/web-components.html).

## Определение компонента {#defining-a-component}

При использовании шага сборки мы обычно определяем каждый компонент Vue в отдельном файле с расширением `.vue` - это называется [однофайловый компонент](/guide/scaling-up/sfc.html) (по англ. Single-File Component или, сокращённо, SFC):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Вы нажали на меня {{ count }} раз.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Вы нажали на меня {{ count }} раз.</button>
</template>
```

</div>

Если не использовать шаг сборки, компонент Vue можно определить как обычный объект JavaScript, содержащий специфические для Vue опции:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Вы нажали на меня {{ count }} раз.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      Вы нажали на меня {{ count }} раз.
    </button>`
  // Can also target an in-DOM template:
  // template: '#my-template-element'
}
```

</div>

Здесь шаблон вставляется в виде строки JavaScript, которую Vue скомпилирует на лету. Вы также можете использовать селектор ID, указывающий на элемент (обычно это собственные элементы `<template>`) - Vue будет использовать его содержимое в качестве источника шаблона.

В приведенном выше примере определяется один компонент и экспортируется как экспорт по умолчанию из файла `.js`, но вы можете использовать именованный экспорт для экспорта нескольких компонентов из одного файла.

## Использование компонента {#using-a-component}

:::tip Совет
Мы будем использовать синтаксис SFC для остальной части этого руководства — концепции компонентов одинаковы независимо от того, используете ли вы шаг сборки или нет. В разделе [Примеры](/examples/) показано использование компонентов в обоих сценариях.
:::

Чтобы использовать дочерний компонент, мы должны импортировать его в родительский компонент. Если мы разместили наш компонент счётчика в файле под названием `ButtonCounter.vue`, то компонент будет экспортирован в файл по умолчанию:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Здесь дочерний компонент!</h1>
  <ButtonCounter />
</template>
```

Чтобы отобразить импортированный компонент в нашем шаблоне, нам нужно [зарегистрировать](/guide/components/registration.html) его с помощью опции `components`. После этого компонент будет доступен как тег, используя ключ, под которым он зарегистрирован.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Здесь дочерний компонент!</h1>
  <ButtonCounter />
</template>
```

С помощью `<script setup>`, импортированные компоненты автоматически становятся доступными для шаблона.

</div>

Также можно глобально зарегистрировать компонент, сделав его доступным для всех компонентов данного приложения без необходимости его импорта. Плюсы и минусы глобальной и локальной регистрации обсуждаются в специальном разделе [Регистрация компонентов](/guide/components/registration.html).

Компоненты можно использовать повторно столько раз, сколько вы захотите:

```vue-html
<h1>Здесь много дочерних компонентов!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Обратите внимание, что при нажатии на кнопки каждая из них ведет свой собственный `count`. Это происходит потому, что при каждом использовании компонента создаётся его новый **экземпляр**.

В SFC рекомендуется использовать имена тегов для дочерних компонентов в регистре `PascalCase`, чтобы отличить их от собственных элементов HTML. Хотя имена тегов HTML не чувствительны к регистру, Vue SFC - это скомпилированный формат, поэтому мы можем использовать в нем имена тегов с учетом регистра. Мы также можем использовать `/>` для закрытия тега.

Если вы создаете свои шаблоны непосредственно в DOM (например, как содержимое собственного элемента  `<template>`), то шаблон будет подчиняться собственному поведению браузера при разборе HTML. В таких случаях необходимо использовать регистр `kebab-case` и явные закрывающие теги для компонентов:

```vue-html
<!-- если этот шаблон записан в DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Более подробную информацию смотрите в разделе [Предостережения по разбору шаблонов DOM](#dom-template-parsing-caveats).

## Передача входных параметров {#passing-props}

Если мы создаём блог, нам, скорее всего, понадобится компонент, представляющий запись в блоге. Мы хотим, чтобы все посты в блоге имели одинаковое визуальное оформление, но разное содержание. Такой компонент не будет полезен, если вы не сможете передать ему данные. Например, заголовок и содержание конкретного поста, который мы хотим отобразить. Тут на помощь приходят входные параметры.

Входные параметры — это настраиваемые атрибуты, которые вы можете зарегистрировать в компоненте. Чтобы передать заголовок нашему компоненту записи блога, мы должны объявить его в списке входных параметров, которые принимает этот компонент, используя <span class="options-api">опцию [`props`](/api/options-state#props)</span><span class="composition-api">макрос [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Когда значение передается атрибуту _prop_, оно становится свойством этого экземпляра компонента. Значение этого свойства доступно в шаблоне и в контексте компонента `this`, как и любое другое свойство компонента.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` макрос компилятора используемый только внутри `<script setup>` и не нуждается в явном импорте. Объявленные входные параметры автоматически отображаются в шаблоне. `defineProps` также возвращает объект, содержащий все входные параметры, переданные компоненту, чтобы при необходимости мы могли получить к ним доступ в JavaScript:

```js
const props = defineProps(['title'])
console.log(props.title)
```

См. также: [Типизация входных параметров компонента](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Если вы не используете `<script setup>`, входные параметры должны быть объявлены с помощью опции `props`, и объект _props_ будет передан `setup()` в качестве первого аргумента:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Компонент может иметь сколько угодно входных параметров, и по умолчанию любому входному параметру может быть передано любое значение.

После регистрации входного параметра вы можете передавать ему данные в качестве пользовательского атрибута, как показано ниже:

```vue-html
<BlogPost title="Как изучить Vue" />
<BlogPost title="Ведение блога с помощью Vue" />
<BlogPost title="Почему Vue так интересен" />
```

Однако в обычном приложении вы, скорее всего, будете иметь массив постов в родительском компоненте:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'Как изучить Vue' },
        { id: 2, title: 'Ведение блога с помощью Vue' },
        { id: 3, title: 'Почему Vue так интересен' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'Как изучить Vue' },
  { id: 2, title: 'Ведение блога с помощью Vue' },
  { id: 3, title: 'Почему Vue так интересен' }
])
```

</div>

Затем нужно отрисовать компонент для каждого из них, используя `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Обратите внимание, как [`v-bind` синтаксис](/api/built-in-directives#v-bind) (`:title="post.title"`) используется для передачи динамических значений входному параметру. Это особенно полезно, когда вы заранее не знаете, какой именно контент вы собираетесь отобразить.

Это все, что вам нужно знать о входных параметрах на данный момент, но как только вы закончите читать эту страницу и почувствуете себя комфортно с ее содержанием, мы рекомендуем вернуться позже, чтобы прочитать полное руководство по [входным параметрам](/guide/components/props.html).

## Прослушивание событий  {#listening-to-events}

По мере разработки нашего компонента `<BlogPost>`, некоторые функции могут потребовать обратной связи с родительским компонентом. Например, мы можем решить включить функцию доступности для увеличения текста записей блога, оставляя при этом размер остальной части страницы по умолчанию.

В родителе мы можем включить эту функцию, добавив свойство `postFontSize`:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Которая может использоваться в шаблоне для управления размером шрифта всех записей блога:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Теперь давайте добавим кнопку в шаблон компонента `<BlogPost>`:

```vue{5}
<!-- BlogPost.vue, не добавлен <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Увеличить размер текста</button>
  </div>
</template>
```

При нажатии на кнопку нужно сообщить родительскому компоненту, чтобы увеличил размер текста для всех записей блога. Для решения этой проблемы, экземпляры компонента предоставляют собственную систему событий. Родительский компонент может прослушивать любые события на экземпляре дочернего компонента с помощью `v-on` или `@`, аналогично отслеживанию нативных событий DOM:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Тогда дочерний компонент может сгенерировать событие с помощью встроенного [метода `$emit`](/api/component-instance#emit), передавая ему имя события:

```vue{5}
<!-- BlogPost.vue, не добавлен <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Увеличить размер текста</button>
  </div>
</template>
```

Благодаря прослушиванию события `@enlarge-text="postFontSize += 0.1"`, родительский компонент отследит событие и обновится со значением `postFontSize`.

<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Все генерируемые компонентом события можно перечислить в <span class="options-api">[`emits`](/api/options-state#emits)</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Это позволит проверять все события, которые генерирует компонент, и опционально [валидировать их](/guide/components/events#events-validation). Это также позволяет Vue избежать неявного применения их в качестве нативных слушателей к корневому элементу дочернего компонента.

<div class="composition-api">

Как и `defineProps`, `defineEmits` используется только в `<script setup>` и не требует импорта. defineEmits возвращает функцию `emit`, которая эквивалентна методу `$emit`. Её можно использовать для генерации событий в разделе компонента `<script setup>`, где `$emit` недоступен напрямую:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

См. также: [Типизация событий, генерируемых компонентом](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Если вы не используете `<script setup>`, вы можете объявить эмитируемые события с помощью опции `emits`. Вы можете получить доступ к функции `emit` как к свойству контекста настройки (передается в `setup()` в качестве второго аргумента):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

Пока это все, что вам нужно знать о событиях пользовательских компонентов, но как только вы закончите читать эту страницу и почувствуете себя комфортно с ее содержанием, мы рекомендуем вернуться позже, чтобы прочитать полное руководство по [пользовательским событиям](/guide/components/events).

## Распределение контента слотами {#content-distribution-with-slots}

Как и в случае с обычными HTML-элементами, часто бывает полезным иметь возможность передавать компоненту содержимое, например таким образом:

```vue-html
<AlertBox>
  Произошло что-то плохое.
</AlertBox>
```

Чтобы в итоге всё выглядело примерно так:

:::danger Эта ошибка для демонстрационных целей
Произошло что-то плохое.
:::

Такого можно добиться при помощи пользовательского элемента `<slot>` у Vue:

```vue{4}
<template>
  <div class="alert-box">
    <strong>Эта ошибка для демонстрационных целей</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Как можно увидеть выше, `<slot>` будет использоваться в качестве места, куда потребуется подставлять контент — и это всё. Готово!

<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

Для начала это всё, что нужно знать о слотах. Но когда закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — рекомендуем вернуться и прочитать полное руководство по [слотам](/guide/components/slots).

## Динамические компоненты {#dynamic-components}

Иногда бывает полезным динамически переключаться между компонентами, как например в интерфейсе с вкладками:

<div class="options-api">

[Открыть пример в песочнице](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Открыть пример в песочнице](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

Это возможно сделать с помощью элемента `<component>` со специальным атрибутом `is`:

<div class="options-api">

```vue-html
<!-- Компонент будет меняться при изменении currentTab -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- Компонент будет меняться при изменении currentTab -->
<component :is="tabs[currentTab]"></component>
```

</div>

В примере выше значением `:is` может быть:

- имя зарегистрированного компонента, или
- объект с настройками компонента

Можно также использовать атрибут `is` и для создания обычных HTML-элементов.

При переключении между несколькими компонентами с помощью `<component :is="...">`, компонент будет размонтирован при отключении от него. Мы можем заставить неактивные компоненты оставаться "живыми" с помощью встроенного [компонента `<KeepAlive>`](/guide/built-ins/keep-alive.html).

## Особенности парсинга DOM-шаблона {#dom-template-parsing-caveats}

Если пишете шаблоны Vue непосредственно в DOM, то Vue придётся получать строковый шаблон из DOM. Это приводит к некоторым особенностям, связанным с собственным поведением браузеров при парсинге HTML.

:::tip Совет
Следует отметить, что ограничения, обсуждаемые ниже, применимы только в том случае, если пишете шаблоны непосредственно в DOM. Таких ограничений не будет при использовании строковых шаблонов из следующих источников:

- Однофайловые компоненты
- Строковые шаблоны (например, `template: '...'`)
- `<script type="text/x-template">`
:::

### Отсутствие чувствительности к регистру {#case-insensitivity}

Имена атрибутов HTML не чувствительны к регистру, поэтому браузеры будут интерпретировать любые заглавные символы как строчные. А значит, при использовании DOM-шаблонов, необходимо указывать имена входных параметров в camelCase и обработчики событий в kebab-case (разделённые дефисом) эквивалентах:

```js
// camelCase в JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- kebab-case в HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Самозакрывающиеся теги {#self-closing-tags}

В предыдущих примерах кода мы использовали самозакрывающиеся теги для компонентов:

```vue-html
<MyComponent />
```

Это происходит потому, что анализатор шаблонов Vue воспринимает `/>` как признак окончания любого тега, независимо от его типа.

Однако в шаблонах DOM мы всегда должны включать явные закрывающие теги:

```vue-html
<my-component></my-component>
```

Это связано с тем, что спецификация HTML позволяет опускать закрывающие теги только для [нескольких определенных элементов](https://html.spec.whatwg.org/multipage/syntax#void-elements), наиболее распространенными из которых являются `<input>` и `<img>`. Для всех остальных элементов, если вы опустите закрывающий тег, парсер HTML будет считать, что вы не завершили открывающий тег. Например, следующий фрагмент:

```vue-html
<my-component /> <!-- мы намерены закрыть тег здесь... -->
<span>hello</span>
```

будет распарсено как:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- но браузер закроет его здесь. -->
```

### Ограничение по расположению элементов {#element-placement-restrictions}

У некоторых HTML-элементов, таких как `<ul>`, `<ol>`, `<table>` и `<select>` есть ограничения на то, какие элементы могут находиться внутри них, кроме того некоторые элементы `<li>`, `<tr>`, и `<option>`  могут быть только внутри определённых элементов.

Это может привести к проблемам при использовании компонентов с элементами у которых есть такие ограничения. Например:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

При парсинге пользовательский компонент `<blog-post-row>` будет поднят выше, поскольку считается недопустимым содержимым, приводя к ошибкам при отрисовке. Для решения этой проблемы можно использовать [специальный атрибут `is`](/api/built-in-special-attributes#is):

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip Совет
При использовании на нативных HTML-элементах значение `is` должно начинаться с префикса `vue:`, чтобы интерпретироваться как компонент Vue. Это нужно чтобы избежать путаницы с нативными [пользовательскими встроенными элементами](https://html.spec.whatwg.org/multipage/custom-elements#custom-elements-customized-builtin-example).
:::

Это все, что вам нужно знать о предостережениях по разбору шаблонов DOM на данный момент - и, фактически, конец _Основ_ Vue. Поздравляем! Вам предстоит еще многому научиться, но сначала мы рекомендуем сделать перерыв, чтобы попрактиковаться с Vue самостоятельно - построить что-нибудь интересное или ознакомиться с [примерами](/examples/), если вы еще этого не сделали.

Когда закончите изучение этой страницы и разберётесь со всей информацией представленной здесь, рекомендуем перейти к руководству, чтобы узнать больше о компонентах в деталях.
