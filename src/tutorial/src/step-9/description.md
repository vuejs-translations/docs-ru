# Жизненный цикл и ссылки в шаблонах {#lifecycle-and-template-refs}

До сих пор Vue выполнял все обновления DOM за нас, благодаря реактивности и декларативному рендерингу. Однако могут быть случаи, когда нам потребуется работать с DOM вручную.

Мы можем обратиться к **template ref**, который является ссылкой на элемент в шаблоне, используя <a target="_blank" href="/api/built-in-special-attributes.html#ref">специальный атрибут `ref`</a>:

```vue-html
<p ref="p">привет</p>
```

<div class="composition-api">

Для доступа к ссылке необходимо объявить ее с соответствующим именем<span class="html">и вернуть</span>:

<div class="sfc">

```js
const p = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const p = ref(null)

  return {
    p
  }
}
```

</div>

Обратите внимание, что ссылка инициализирована значением `null`. Это связано с тем, что элемент еще не существует, когда выполняется <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span>. Ссылка на шаблон доступна только после того, как компонент **смонтирован**.

Для выполнения кода после монтирования, мы можем использовать функцию `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // компонент теперь смонтирован.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // компонент теперь смонтирован.
    })
  }
})
```

</div>
</div>

<div class="options-api">

Элемент будет доступен в `this.$refs` как `this.$refs.p`. Однако доступ к нему возможен только после того, как компонент будет **смонтирован**.

Для выполнения кода после монтирования, мы можем использовать параметр `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // компонент теперь смонтирован.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // компонент теперь смонтирован.
  }
})
```

</div>
</div>

Это называется **хуком жизненного цикла**, позволяющего нам указать функцию обратного вызова в определенные моменты жизненного цикла компонента. Также существуют другие хуки, такие как <span class="options-api">`created` и `updated`</span><span class="composition-api">`onUpdated` и `onUnmounted`</span>. Чтобы узнать больше, просмотрите <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Диаграмму жизненного цикла</a>.

Теперь попробуйте добавить хук <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> для того, чтобы получить доступ к `<p>` через <span class="options-api">`this.$refs.p`</span><span class="composition-api">`p.value`</span> и выполните любые операции с DOM (например, измените его textContent).
