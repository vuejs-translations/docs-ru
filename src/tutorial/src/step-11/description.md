# Компоненты {#components}

До сих пор мы работали только с одним компонентом. Реальные приложения Vue обычно создаются с использованием вложенных компонентов.

Родительский компонент может отображать другой компонент в своем шаблоне как дочерний компонент. Чтобы использовать дочерний компонент, нужно сначала импортировать его:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

Также необходимо зарегистрировать компонент, с помощью опции `components`.  Здесь мы используем сокращение свойства объекта для регистрации компонента `ChildComp` под ключом `ChildComp`.

</div>
</div>

<div class="sfc">

Затем можно использовать компонент в шаблоне как:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

Также необходимо зарегистрировать компонент с помощью опции `components`. Здесь используем сокращение свойства объекта, чтобы зарегистрировать компонент `ChildComp` под ключом `ChildComp`.

Поскольку записываем шаблон в DOM, он будет подчиняться правилам разбора браузера, которые не чувствительны к регистру имен тегов. Поэтому нужно использовать имя в регистре kebab-cased для ссылки на дочерний компонент:

```vue-html
<child-comp></child-comp>
```

</div>

Now try it yourself - import the child component and render it in the template.
