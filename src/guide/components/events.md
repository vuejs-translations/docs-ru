<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# События компонентов {#component-events}

> Подразумевается, что вы уже изучили и разобрались с разделом [Основы компонентов](/guide/essentials/component-basics). Если нет — прочитайте его сначала.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Бесплатный урок по объявлению пользовательских событий"/>
</div>

## Отправка и прослушивание событий {#emitting-and-listening-to-events}

Компонент может генерировать пользовательские события непосредственно в выражениях шаблона (например, в обработчике `v-on`), используя встроенный метод `$emit`:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">нажми на меня</button>
```

<div class="options-api">

Метод `$emit()` также доступен в экземпляре компонента как `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Родительский компонент может прослушать его, используя `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

Модификатор `.once` также поддерживается для слушателей событий компонента:

```vue-html
<MyComponent @some-event.once="callback" />
```

Как компоненты и входные параметры, имена событий обеспечивают автоматическое преобразование регистра. Обратите внимание, что мы испустили событие в регистре camelCase, но можем прослушать его с помощью слушателя в регистре kebab-case в родительском компоненте. Как и в случае с [регистрацией входных параметров](/guide/components/props#prop-name-casing), мы рекомендуем использовать kebab-case регистр для прослушивания событий в шаблонах.

:::tip Совет
В отличие от собственных событий DOM, события, испускаемые компонентами, **не** всплывают. Вы можете слушать только события, испускаемые непосредственно дочерним компонентом. Если необходимо взаимодействие между родственными или глубоко вложенными компонентами, используйте внешнюю шину событий или [глобальное управление состоянием](/guide/scaling-up/state-management.html).
:::

## Аргументы события {#event-arguments}

Иногда бывает полезно передать определенное значение вместе с событием. Например, мы можем захотеть, чтобы компонент `<BlogPost>` отвечал за то, насколько увеличить текст. В таких случаях мы можем передать `$emit` дополнительные аргументы, чтобы предоставить это значение:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Увеличить на 1
</button>
```

Затем, когда мы прослушиваем событие в родителе, мы можем использовать встроенную стрелочную функцию в качестве слушателя, что позволит нам получить доступ к аргументу события:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Или, если обработчик события является методом:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Затем значение будет передано в качестве первого параметра этого метода:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip Совет
Все дополнительные аргументы, переданные в `$emit()` после имени события, будут переданы слушателю. Например, при `$emit('foo', 1, 2, 3)` функция обработчика события получит три аргумента.
:::

## Определение пользовательских событий {#declaring-emitted-events}

События генерируемые компонентом можно объявить с помощью <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">опции [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

Метод `$emit`, который мы использовали в `<template>` недоступен в разделе `<script setup>` компонента, но `defineEmits()` возвращает эквивалентную функцию, которую мы можем использовать вместо него:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

Макрос `defineEmits()` **нельзя использовать внутри функции**, он должен быть помещен непосредственно в `<script setup>`, как в примере выше.

Если вы используете явную функцию `setup` вместо `<script setup>` события должны быть объявлены с помощью опции [`emits`](/api/options-state#emits), а функция `emit` доступна в контексте `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Как и другие свойства контекста `setup()`, `emit` можно безопасно деструктурировать:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

Опция `emits` также поддерживает синтаксис объекта, что позволяет нам выполнять проверку полезной нагрузки пользовательских событий во время выполнения:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // возвращает `true` или `false`, чтобы показать
    // что проверка пройдена / не пройдена
  }
})
</script>
```

Если вы используете TypeScript с `<script setup>`, можно также объявить генерируемые события с помощью чистых аннотаций типов:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Подробнее: [Типизирование пользовательских событий компонента](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // возвращает `true` или `false`, чтобы показать
      // что проверка пройдена / не пройдена
    }
  }
}
```

См. также: [Типизирование пользовательских событий компонента](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Хотя это и необязательно, рекомендуется определить все генерируемые события, чтобы лучше документировать, как должен работать компонент. Это также позволяет Vue исключать известных слушателей из [проваливающихся атрибутов](/guide/components/attrs#v-on-listener-inheritance), избегая пограничных случаев, вызванных событиями DOM, которые вручную отправляются сторонним кодом.

:::tip Совет
Если в опции `emits` определено собственное событие (например, `click`), слушатель теперь будет прослушивать только события `click`, генерируемые компонентом, и больше не будет реагировать на собственные события `click`.
:::

## Валидация сгенерированных событий {#events-validation}

Аналогично валидации входных параметров генерируемые события также могут быть провалидированы при помощи объектного синтаксиса, но не при синтаксисе с использованием массива. 

Для добавления валидации событию необходимо указать функцию, которая получает аргументы, с которыми вызывался <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> и возвращает булево, определяющее является ли событие корректным или нет.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Без валидации
  click: null,

  // Валидация события submit
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Некорректные данные для события submit!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Без валидации
    click: null,

    // Валидация события submit
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Некорректные данные для события submit!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
