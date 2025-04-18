# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Бесплатный урок о телепортах во Vue.js"/>

`<Teleport>` это встроенный компонент, который позволяет «телепортировать» часть шаблона компонента в узел DOM, который находится за пределами иерархии DOM этого компонента.

## Базовое использование {#basic-usage}

Иногда мы можем столкнуться с такой ситуацией: часть шаблона компонента логически принадлежит ему, но с визуальной точки зрения она должна быть отображена в другом месте в DOM, вне приложения Vue.

Наиболее распространённый пример — создание модального окна на весь экран. В идеале мы хотим, чтобы код для кнопки модального окна и само модального окна находились в одном компоненте, так как они оба связаны с состоянием открытия / закрытия нашего окна. Но это означает, что модальное окно будет отрисовано вместе с кнопкой, глубоко вложено в иерархию DOM-структуры приложения. Это может вызывать некоторые сложности при позиционировании модального окна с помощью CSS.

Рассмотрите следующую структуру HTML.

```vue-html
<div class="outer">
  <h3>Пример Vue Teleport</h3>
  <div>
    <MyModal />
  </div>
</div>
```

А вот и реализация `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Открыть модальное окно</button>

  <div v-if="open" class="modal">
    <p>Привет из модального окна!</p>
    <button @click="open = false">Закрыть</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Открыть модальное окно</button>

  <div v-if="open" class="modal">
    <p>Привет из модального окна!</p>
    <button @click="open = false">Закрыть</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

Компонент содержит `<button>`, который инициирует открытие модального окна, а также `<div>` с классом `.modal`, который будет содержать контент и кнопку для его закрытия.

При использовании этого компонента внутри исходной структуры HTML возможны некоторые проблемы:

- Свойство `position: fixed` размещает элемент относительно окна просмотра, только если нет родительского элемента с заданными свойствами `transform`, `perspective` или `filter`. Если, например, мы хотим анимировать родительский элемент `<div class="outer">` с помощью CSS-трансформации, это может нарушить расположение модального окна!

- `z-index` модального окна ограничен его родительскими элементами. Если существует другой элемент, который перекрывает `<div class="outer">` и имеет более высокий `z-index`, он будет перекрывать наше модальное окно.

Компонент `<Teleport>` обеспечивает простой способ обойти это, позволяя нам вырваться из вложенной структуры DOM. Давайте изменим `<MyModal>` чтобы использовать `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Открыть модальное окно</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Привет из модального окна!</p>
    <button @click="open = false">Закрыть</button>
  </div>
</Teleport>
```

Целевым значением атрибута `to` компонента `<Teleport>` ожидается строка CSS-селектора или фактический узел DOM. Здесь мы как бы говорим Vue «**телепортировать** этот фрагмент шаблона **в** элемент **`body`**».

Вы можете нажать на кнопку ниже и проверить элемент `<body>` с помощью инструментов разработчика вашего браузера:

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Открыть модальное окно</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Привет из модального окна!</p>
        <button @click="open = false">Закрыть</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Вы можете комбинировать `<Teleport>` с [`<Transition>`](./transition) чтобы создавать анимированные модальные окна — [Вот пример](/examples/#modal).

:::tip Совет
Целевой элемент `куда` мы телепортируем должен уже существовать в DOM, когда компонент `<Teleport>` смонтирован. В идеале это должен быть элемент вне всего Vue приложения. Если вы нацеливаетесь на другой элемент, отрисованный Vue, вам нужно убедиться, что этот элемент будет смонтирован до компонента `<Teleport>`.
:::

## Использование с компонентами {#using-with-components}

`<Teleport>` изменяет только отображаемую структуру DOM, не затрагивая логическую иерархию компонентов. Другими словами, если `<Teleport>` содержит компонент, этот компонент остается логическим дочерним элементом родительского компонента, содержащего `<Teleport>`. Передача свойств и генерация событий продолжают работать так же, как и раньше.

Это также означает, что инъекции из родительского компонента работают ожидаемым образом, и дочерний компонент будет вложен под родительским компонентом в инструментах разработчика Vue, вместо того, чтобы быть размещенным там, куда перемещается фактическое содержимое.

## Отключение телепорта {#disabling-teleport}

В некоторых случаях мы можем захотеть условно отключить `<Teleport>`. Например, мы можем захотеть отображать компонент поверх всего контента на десктопе, но встроенным на мобильных устройствах. `<Teleport>` поддерживает свойство `disabled`, которое можно динамически переключать:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Мы могли бы динамически обновлять `isMobile`.

## Несколько телепортов в один целевой элемент {#multiple-teleports-on-the-same-target}

Распространённым случаем использования может быть повторно используемый компонент `<Modal>`, который может иметь несколько активных экземпляров одновременно. Для такого сценария несколько компонентов `<Teleport>` могут монтировать своё содержимое в один и тот же целевой элемент. Порядок будет определяться простым добавлением, т.е. поздние монтирования будут находиться внутри целевого элемента после более ранних.

Пример использования:

```vue-html
<Teleport to="#modals">
  <div>А</div>
</Teleport>
<Teleport to="#modals">
  <div>Б</div>
</Teleport>
```

Результатом отрисовки будет:

```html
<div id="modals">
  <div>А</div>
  <div>Б</div>
</div>
```

## Отложенный телепорт <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

В Vue 3.5 и выше можно использовать свойство `defer`, чтобы отложить определение цели для телепорта до тех пор, пока другие части приложения не будут смонтированы. Это позволяет телепорту нацеливаться на контейнерный элемент, который отрисовывается Vue, но находится в более поздней части дерева компонентов:
  
```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- где-то позже в шаблоне -->
<div id="late-div"></div>
```

Обратите внимание, что целевой элемент должен быть отрисован в рамках того же такта монтирования/обновления, что и телепорт. Если `<div>` появится позже (например, через секунду), телепорт всё равно вызовет ошибку. Работа `defer` аналогична хуку жизненного цикла `mounted`.

---

**Связанные**

- [Справочник API — `<Teleport>`](/api/built-in-components#teleport)
- [Работа с телепортами в SSR](/guide/scaling-up/ssr#teleports)
