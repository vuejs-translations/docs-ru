<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# Сохранение состояния {#keepalive}

`<KeepAlive>` это встроенный компонент, который позволяет условно кэшировать экземпляры компонентов при динамическом переключении между несколькими компонентами.

## Базовое использование {#basic-usage}

В главе "Основы компонентов" мы представили синтаксис для [Динамических компонентов](/guide/essentials/component-basics#dynamic-components), используя специальный элемент `<component>`:

```vue-html
<component :is="activeComponent" />
```

По умолчанию активный экземпляр компонента будет размонтирован при переключении с него. Это приведет к потере любого измененного состояния, которое оно содержит. При повторном отображении этого компонента будет создан новый экземпляр только с начальным состоянием.

В приведенном ниже примере у нас есть два компонента с состоянием: компонент A содержит счетчик, а компонент B содержит сообщение, синхронизированное с введенным значением через `v-model`. Попробуйте обновить состояние одного из них, переключиться на другой компонент, а затем вернуться к нему:

<SwitchComponent />

Вы заметите, что при обратном переключении предыдущее измененное состояние будет сброшено.

Создание нового экземпляра компонента при переключении обычно является полезным поведением, но в этом случае нам бы очень хотелось, чтобы два экземпляра компонента сохраняли своё состояние, даже когда они неактивны. Чтобы решить эту проблему, мы можем обернуть наш динамический компонент встроенным компонентом `<KeepAlive>`:

```vue-html
<!-- Неактивные компоненты будут кэшироваться! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Теперь состояние будет сохраняться при переключении компонентов:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip Совет
При использовании в [DOM-шаблонах](/guide/essentials/component-basics#dom-template-parsing-caveats), на него следует ссылаться как на `<keep-alive>`.
:::

## Включение / Исключение {#include-exclude}

По умолчанию `<KeepAlive>` будет кэшировать любой экземпляр компонента внутри. Мы можем настроить это поведение с помощью параметров `include` и `exclude`. Оба свойства могут быть строками, разделенными запятыми, `RegExp`, или массивами, содержащими элементы типа:

```vue-html
<!-- строка, разделённая запятыми -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- регулярное выражение (используйте `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- массив (используйте `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

Соответствие проверяется параметром [`name`](/api/options-misc#name) компонента, поэтому компоненты, которые должны быть условно кэшированы с помощью `KeepAlive` должны явно объявлять параметр `name`.

:::tip Совет
Начиная с версии 3.2.34, однофайловый компонент, использующий `<script setup>`, будет автоматически определять собственный `name` на основе имени файла, устраняя необходимость вручную объявлять имя.
:::

## Максимальное количество кэшированных экземпляров {#max-cached-instances}

Мы можем ограничить максимальное количество экземпляров компонентов, которые можно кэшировать с помощью опции `max`. Когда `max` задан, `<KeepAlive>` ведет себя как [LRU cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): если количество закэшированных экземпляров вот-вот превысит указанное максимальное количество, то наименее недавно использованный закэшированный экземпляр будет уничтожен, чтобы освободить место для нового.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Жизненный цикл кэшированного экземпляра {#lifecycle-of-cached-instance}

Когда экземпляр компонента удаляется из DOM, но является частью дерева компонентов, кэшированного `<KeepAlive>`, он переходит в состояние **деактивированного** вместо того, чтобы быть размонтированным. Когда экземпляр компонента вставляется в DOM как часть кэшированного дерева, он **активируется**.

<div class="composition-api">

Также наш компонент может регистрировать хуки жизненного цикла для этих двух состояний [`onActivated()`](/api/composition-api-lifecycle#onactivated) и [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // вызывается при первоначальном монтировании
  // и каждый раз, когда он повторно вставляется из кэша
})

onDeactivated(() => {
  // вызывается, когда удаляется из DOM в кэш
  // и также при размонтировании
})
</script>
```

</div>
<div class="options-api">

Также наш компонент может регистрировать хуки жизненного цикла для этих двух состояний [`activated`](/api/options-lifecycle#activated) и [`deactivated`](/api/options-lifecycle#deactivated) хуки:

```js
export default {
  activated() {
    // вызывается при первоначальном монтировании
    // и каждый раз, когда он повторно вставляется из кэша
  },
  deactivated() {
    // вызывается, когда удаляется из DOM в кэш
    // и также при размонтировании
  }
}
```

</div>

Обратите внимание, что:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> также вызывается при монтировании, и <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> при размонтировании.

- Оба хука работают не только с корневым компонентом, кэшированным `<KeepAlive>`, но и с дочерними компонентами в кэшированном дереве.

---

**Связанные**

- [`<KeepAlive>` API reference](/api/built-in-components#keepalive)
