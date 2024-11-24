# Обработка событий {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Бесплатный урок по обработке событий во Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Бесплатный урок по обработке событий во Vue.js"/>
</div>

## Прослушивание событий {#listening-to-events}

Можно использовать директиву `v-on`, которую обычно сокращают до символа `@`, чтобы прослушивать события DOM и запускать JavaScript-код по их наступлению. Используется как `v-on:click="methodName"` или в сокращённом виде `@click="methodName"`.

Значение обработчика может быть одним из следующих:

1. **Обработчик события в виде инлайн-кода:** Код JavaScript будет выполняться при срабатывании события (аналогично как в нативном атрибуте `onclick`).

2. **Обработчик события в виде метода:** Имя свойства или путь, указывающий на метод, объявленный в компоненте.

## Обработчик события в виде инлайн-кода {#inline-handlers}

Обычно подобный подход используют лишь в очень простых случаях, например:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Добавить 1</button>
<p>Счётчик: {{ count }}</p>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## Обработчик события в виде метода {#method-handlers}

Но чаще всего у многих обработчиков событий логика будет довольно сложной, поэтому оставлять JavaScript-код в значении атрибута `v-on` бессмысленно. Поэтому `v-on` также принимает имя метода, который потребуется вызвать.

Например:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Привет, ${name.value}!`)
  // `event` — нативное событие DOM
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` в методе указывает на текущий активный экземпляр
    alert(`Привет, ${this.name}!`)
    // `event` — нативное событие DOM
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` — название метода, объявленного в компоненте выше -->
<button @click="greet">Поприветствовать</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

Метод обработчика автоматически получает аргументом нативное событие DOM, которое его вызвало — например, в примере выше можно получить доступ к элементу, на котором произошло событие, через `event.target`.

<div class="composition-api">

См. также: [Аннотация событий](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

См. также: [Аннотация событий](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Написание обработчика методом vs. инлайн {#method-vs-inline-detection}

Компилятор шаблонов определяет методы обработчиков, проверяя является ли строка значения `v-on` допустимым идентификатором JavaScript или путём для обращения к свойству. Например, `foo`, `foo.bar` и `foo['bar']` будут рассматриваться как обработчики методов, а `foo()` и `count++` — как инлайн.

## Вызов методов в инлайн-обработчиках {#calling-methods-in-inline-handlers}

Вместо привязки непосредственно к имени метода, можно вызывать методы и в инлайн-обработчике. Это позволит передавать в метод вместо нативного события другие аргументы:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('привет')">Скажи привет</button>
<button @click="say('пока')">Скажи пока</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## Доступ к событию через аргумент в инлайн-обработчиках {#accessing-event-argument-in-inline-handlers}

Иногда может потребоваться получить доступ к оригинальному событию DOM в инлайн-обработчике. Его можно явно передать в метод с помощью специальной переменной `$event` или воспользоваться стрелочной функцией:

```vue-html
<!-- использование специальной переменной $event -->
<button @click="warn('Форму пока ещё нельзя отправить.', $event)">
  Отправить
</button>

<!-- использование стрелочной функции в инлайн-выражении -->
<button @click="(event) => warn('Форму пока ещё нельзя отправить.', event)">
  Отправить
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // теперь есть доступ к нативному событию
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // теперь есть доступ к нативному событию
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Модификаторы событий {#event-modifiers}

Часто необходимо вызвать `event.preventDefault()` или `event.stopPropagation()` внутри обработчиков события. Хотя это и легко можно делать внутри методов, но лучше когда методы содержат в себе только логику и не имеют дела с деталями реализации событий DOM.

Vue для решения этой задачи предоставляет **модификаторы событий** для `v-on`. Вспомните, что модификаторы — это постфиксы директивы, отделяемые точкой:

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- всплытие события click будет остановлено -->
<a @click.stop="doThis"></a>

<!-- событие submit перестанет перезагружать страницу -->
<form @submit.prevent="onSubmit"></form>

<!-- модификаторы можно объединять в цепочки -->
<a @click.stop.prevent="doThat"></a>

<!-- можно использовать без указания обработчиков -->
<form @submit.prevent></form>

<!-- вызов обработчика только в случае наступления события непосредственно -->
<!-- на данном элементе (то есть не на дочернем компоненте) -->
<div @click.self="doThat">...</div>
```

:::tip Совет
При использовании модификаторов имеет значение их порядок, потому что в той же очерёдности генерируется и соответствующий код. Поэтому `@click.prevent.self` предотвратит **действие клика по умолчанию на самом элементе и на его дочерних элементах**, в то время как `@click.self.prevent` предотвратит действие клика по умолчанию только на самом элементе.
:::

Модификаторы `.capture`, `.once` и `.passive` зеркально отражают действия [опций нативного метода `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- можно отслеживать события в режиме capture,     -->
<!-- т.е. событие, нацеленное на внутренний элемент, --> 
<!-- обработается здесь до обработки этим элементом  -->
<div @click.capture="doThis">...</div>

<!-- обработчик click будет вызван максимум 1 раз -->
<a @click.once="doThis"></a>

<!-- по умолчанию событие scroll (при прокрутке) произойдёт -->
<!-- незамедлительно, вместо ожидания окончания `onScroll`  -->
<!-- на случай, если там будет `event.preventDefault()`     -->
<div @scroll.passive="onScroll">...</div>
```

Модификатор `.passive` особенно полезен для [улучшения производительности на мобильных устройствах](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).

:::tip Совет
Не указывайте вместе `.passive` и `.prevent` — `.prevent` будет проигнорирован и браузер скорее всего покажет предупреждение. Запомните, что `.passive` сообщает браузеру, что для события _не будет предотвращаться поведение по умолчанию_.
:::

## Модификаторы клавиш {#key-modifiers}

При прослушивании событий клавиатуры часто требуется отслеживать конкретные клавиши. Vue позволяет указывать модификаторы клавиш при использовании `v-on` или `@` при прослушивании событий клавиш:

```vue-html
<!-- вызвать `vm.submit()` только если `key` клавиши будет `Enter` -->
<input @keyup.enter="submit" />
```

Можно использовать любые допустимые имена клавиш напрямую, используя в качестве модификаторов ключи [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) и указывая их имена в формате kebab-case.

```vue-html
<input @keyup.page-down="onPageDown" />
```

В этом примере обработчик вызовется только когда `$event.key` будет `'PageDown'`.

### Псевдонимы клавиш {#key-aliases}

Vue предоставляет псевдонимы для наиболее часто используемых клавиш:

- `.enter`
- `.tab`
- `.delete` (ловит как «Delete», так и «Backspace»)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Модификаторы системных клавиш {#system-modifier-keys}

Можно использовать следующие модификаторы для прослушивания событий мыши или клавиатуры только при зажатой клавиши-модификатора:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

:::tip Примечание
На клавиатурах Apple клавиша meta отмечена знаком ⌘. На клавиатурах Windows клавиша meta отмечена знаком ⊞. На клавиатурах Sun Microsystems клавиша meta отмечена символом ромба ◆. На некоторых клавиатурах, особенно MIT и Lisp machine и их преемников, таких как Knight или space-cadet клавиатуры, клавиша meta отмечена словом «META». На клавиатурах Symbolics, клавиша meta отмечена словом «META» или «Meta».
:::

Например:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Сделать что-нибудь</div>
```

:::tip Совет
Обратите внимание, клавиши-модификаторы отличаются от обычных клавиш и при отслеживании событий `keyup` должны быть нажаты, когда событие происходит. Другими словами, `keyup.ctrl` будет срабатывать только если отпустить клавишу, удерживая нажатой `ctrl`. Это не сработает, если отпустить только клавишу `ctrl`.
:::

### Модификатор `.exact` {#exact-modifier}

Модификатор `.exact` позволяет контролировать точную комбинацию модификаторов системных клавиш, необходимых для запуска события.

```vue-html
<!-- сработает, даже если также будут нажаты Alt или Shift -->
<button @click.ctrl="onClick">A</button>

<!-- сработает, только когда нажат Ctrl и не нажаты никакие другие клавиши -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- сработает, только когда не нажаты никакие системные модификаторы -->
<button @click.exact="onClick">A</button>
```

## Модификаторы кнопок мыши {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Эти модификаторы ограничивают обработчик события только вызовами по определённой кнопке мыши.

Обратите внимание, однако, что модификаторы `.left`, `.right` и `.middle` основаны на типичной для правой руки раскладке мыши, но на самом деле они представляют собой триггеры событий указывающего устройства "основной", "вторичный" и "вспомогательный" соответственно, а не фактические физические кнопки. Таким образом, для раскладки мыши для левой руки "основная" кнопка может физически быть правой, но будет вызывать обработчик модификатора `.left`. Или трекпад может вызывать обработчик `.left` одним касанием пальцем, обработчик `.right` двумя касаниями и обработчик `.middle` тремя касаниями. Аналогично, другие устройства и источники событий, генерирующие события "мыши", могут иметь режимы срабатывания, которые вообще не связаны с "левым" и "правым".
