# Объявление событий {#emits}

Помимо получения входных параметров, дочерний компонент также может объявлять события для родительского компонента:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// объявление генерируемых событий
const emit = defineEmits(['response'])

// генерация события с параметром
emit('response', 'приветствие от дочернего компонента')
</script>
```

</div>

<div class="html">

```js
export default {
  // объявление генерируемых событий
  emits: ['response'],
  setup(props, { emit }) {
    // генерация события с параметром
    emit('response', 'приветствие от дочернего компонента')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // объявление генерируемых событий
  emits: ['response'],
  created() {
    // генерация события с параметром
    this.$emit('response', 'hello from child')
  }
}
```

</div>

Первым аргументом <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> является имя события. Все дополнительные аргументы передаются слушателю события.

Родительский компонент может прослушивать события дочерних компонентов при помощи `v-on` - обработчик получает дополнительный аргумент от вызова emit в дочернем компоненте и присваивает его локальному состоянию:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Теперь попробуйте сделать это самостоятельно в редакторе.
