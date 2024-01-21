# Слоты {#slots}

> Подразумевается, что вы уже изучили и разобрались с разделом [Основы компонентов](/guide/essentials/component-basics). Если нет — прочитайте его сначала.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="Бесплатный урок про слоты"/>

## Содержимое слота и его вывод {#slot-content-and-outlet}

Мы узнали, что компоненты могут принимать входные параметры, которые могут быть значениями JavaScript любого типа. Но как насчет содержимого шаблонов? В некоторых случаях мы можем захотеть передать фрагмент шаблона дочернему компоненту и позволить дочернему компоненту отобразить этот фрагмент в своем собственном шаблоне.

Например, у нас может быть компонент `<FancyButton>`, который поддерживает такое использование:

```vue-html{2}
<FancyButton>
  Нажми на меня! <!-- содержимое слота -->
</FancyButton>
```

Шаблон `<FancyButton>` выглядит следующим образом:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- вывод слота -->
</button>
```

Элемент `<slot>` указывает, где должно быть выведено **содержимое родительского слота**.

![Диаграмма слота](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

И окончательный рендеринг DOM:

```html
<button class="fancy-btn">Нажми на меня!</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

В слотах `<FancyButton>` отвечает за отрисовку внешнего `<button>` (и ее причудливой стилизации), в то время как внутреннее содержимое предоставляется родительским компонентом.

Другой способ понять слоты - сравнить их с функциями JavaScript:

```js
// родительский компонент, передающий содержимое слота
FancyButton('Нажми на меня!')

// FancyButton отображает содержимое слота в собственном шаблоне
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

Содержимое слота не ограничивается только текстом. Это может быть любое допустимое содержимое шаблона. Например, мы можем передать несколько элементов или даже другие компоненты:

```vue-html
<FancyButton>
  <span style="color:red">Нажми на меня!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

Благодаря использованию слотов наш `<FancyButton>` стал более гибким и многоразовым. Теперь мы можем использовать его в разных местах с разным внутренним содержимым, но с одинаковой стилизацией.

Механизм слотов компонентов Vue вдохновлен [нативным элементом `<slot>` веб-компонента](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), но с дополнительными возможностями, которые мы увидим позже.

## Область видимости при отрисовке {#render-scope}

Содержимое слота имеет доступ к области видимости данных родительского компонента, поскольку он определен в родительском компоненте. Например:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Здесь обе интерполяции <span v-pre>`{{ message }}`</span> будут отображать одно и то же содержимое.

Содержимое слота **не имеет** доступа к данным дочернего компонента. Выражения в шаблонах Vue имеют доступ только к области видимости, в которой они определены, что соответствует лексической области видимости JavaScript. Другими словами:

> Выражения в родительском шаблоне имеют доступ только к родительской области видимости; выражения в дочернем шаблоне имеют доступ только к дочерней области видимости.

## Содержимое слота по умолчанию {#fallback-content}

Бывают случаи, когда полезно указать для слота запасное (т.е. по умолчанию) содержимое, которое будет отображаться только при отсутствии содержимого. Например, в компоненте `<SubmitButton>` component:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

Мы можем захотеть, чтобы текст "Отправить" отображался внутри `<button>`, если родитель не предоставил никакого содержимого слота. Чтобы сделать "Отправить" содержимым по умолчанию, мы можем поместить его внутри тега `<slot>`:

```vue-html{3}
<button type="submit">
  <slot>
    Отправить <!-- содержимое по умолчанию -->
  </slot>
</button>
```

Теперь, когда мы используем `<SubmitButton>` в родительском компоненте, не предоставляя никакого содержимого для слота:

```vue-html
<SubmitButton />
```

Это приведет к отображению содержимого, "Отправить":

```html
<button type="submit">Отправить</button>
```

Но если мы предоставим контент:

```vue-html
<SubmitButton>Сохранить</SubmitButton>
```

Тогда вместо него будет отображено предоставленное содержимое:

```html
<button type="submit">Сохранить</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## Именованные слоты {#named-slots}

Зачастую удобно иметь несколько слотов. К примеру, для компонента `<BaseLayout>` со следующим шаблоном:

```vue-html
<div class="container">
  <header>
    <!-- Мы хотим отобразить контент заголовка здесь -->
  </header>
  <main>
    <!-- Мы хотим отобразить основной контент здесь -->
  </main>
  <footer>
    <!-- Мы хотим отобразить контент подвала здесь -->
  </footer>
</div>
```

В таких случаях элементу `<slot>` можно указать специальный атрибут `name`, который используется для присвоения уникального ID различным слотам, чтобы определить где какое содержимое необходимо отобразить:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Обычный `<slot>` без `name` неявно имеет имя "default".

В родительском компоненте, использующем `<BaseLayout>`, нам нужен способ передачи нескольких фрагментов содержимого слотов, каждый из которых предназначен для отдельного выхода слота. Именно здесь на помощь приходят **именованные слоты**.

Для указания содержимого именованного слота, нужно использовать директиву `v-slot` на элементе `<template>`, передавая имя слота аргументом `v-slot`:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- содержимое для слота заголовка -->
  </template>
</BaseLayout>
```

`v-slot` имеет специальное сокращение `#`, поэтому `<template v-slot:header>` можно сократить до `<template #header>`. Думайте об этом как о "рендеринге этого фрагмента шаблона в слоте 'header' дочернего компонента".

![Диаграмма именованного слота](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

Вот код, передающий содержимое для всех трех слотов в `<BaseLayout>` с использованием сокращенного синтаксиса:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Здесь мог быть заголовок страницы</h1>
  </template>

  <template #default>
    <p>Параграф для основного контента.</p>
    <p>И ещё один.</p>
  </template>

  <template #footer>
    <p>Некая контактная информация</p>
  </template>
</BaseLayout>
```

Когда компонент принимает как слот по умолчанию, так и именованные слоты, все узлы верхнего уровня, отличные от `<template>` неявно обрабатываются как содержимое для слота по умолчанию. Таким образом, вышеизложенное также можно записать как:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Здесь мог быть заголовок страницы</h1>
  </template>

  <!-- неявный слот по умолчанию -->
  <p>Параграф для основного контента.</p>
  <p>И ещё один.</p>

  <template #footer>
    <p>Некая контактная информация</p>
  </template>
</BaseLayout>
```

Теперь содержимое элементов `<template>` будет передаваться в соответствующие слоты. Отрисованный HTML получится таким:

```html
<div class="container">
  <header>
    <h1>Здесь мог быть заголовок страницы</h1>
  </header>
  <main>
    <p>Параграф для основного контента.</p>
    <p>И ещё один.</p>
  </main>
  <footer>
    <p>Некая контактная информация</p>
  </footer>
</div>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

Опять же, возможно, аналогия с функциями JavaScript поможет вам лучше понять именованные слоты:

```js
// передача нескольких фрагментов слота с разными именами
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> отображает их в разных местах
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Динамическое имя слота {#dynamic-slot-names}

[Динамические аргументы директивы](/guide/essentials/template-syntax.md#dynamic-arguments) также работают и с `v-slot`, что позволяет указывать динамическое имя слота:

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- сокращённая запись -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Обратите внимание, что выражение подчиняется [синтаксическим ограничениям](/guide/essentials/template-syntax#directives) аргументов динамической директивы.

## Слоты с ограниченной областью видимости {#scoped-slots}

Как обсуждалось в разделе [Область видимости при отрисовке](#render-scope), содержимое слота не имеет доступа к состоянию в дочернем компоненте.

Однако бывают случаи, когда содержимое слота может использовать данные как из родительской, так и из дочерней области. Для этого нам нужен способ, с помощью которого дочерняя область может передавать данные слоту при его рендеринге.

На самом деле, мы можем делать именно это - мы можем передавать атрибуты в слот точно так же, как передавать входные параметры в компонент:

```vue-html
<!-- <MyComponent> template -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Получение входных параметров слота немного отличается при использовании одного слота по умолчанию от использования именованных слотов. Сначала мы покажем, как получать входные параметры с помощью одного слота по умолчанию, используя `v-slot` непосредственно в теге дочернего компонента:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![scoped slots diagram](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

Входные параметры, переданные дочерним слотом в слот, доступны как значение соответствующей директивы `v-slot`, к которой можно получить доступ с помощью выражений внутри слота.

Вы можете думать о слоте с областью видимости как о функции, передаваемой дочернему компоненту. Затем дочерний компонент вызывает его, передавая входные параметры в качестве аргументов:

```js
MyComponent({
  // передача слота по умолчанию, но в качестве функции
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // вызов функции слота с входными параметрами!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

На самом деле, это очень похоже на то, как компилируются слоты с областью видимости и как вы будете использовать слоты с областью видимости при использовании [рендер функций](/guide/extras/render-function.html).

Обратите внимание, как `v-slot="slotProps"` соответствует сигнатуре функции слота. Как и в случае с аргументами функции, мы можем использовать деструктуризацию в `v-slot`:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Именованные слоты с ограниченной областью видимости {#named-scoped-slots}

Именованные слоты с ограниченной областью видимости работают аналогичным образом - входные параметры слота доступны как значение `v-slot` директивы: `v-slot:name="slotProps"`. При использовании сокращения это выглядит следующим образом:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Передача входных параметров в именованный слот:

```vue-html
<slot name="header" message="hello"></slot>
```

Обратите внимание, что `name` слота не будет включено в входной параметр, поскольку оно зарезервировано - таким образом, результирующий `headerProps` будет `{ message: 'hello' }`.

Если вы смешиваете именованные слоты со слотами с ограниченной областью видимости по умолчанию, вам необходимо использовать явный тег `<template>` для слота по умолчанию. Попытка разместить директиву `v-slot` непосредственно на компоненте приведет к ошибке компиляции. Это сделано для того, чтобы избежать двусмысленности относительно области видимости входного параметра слота по умолчанию. Например:

```vue-html
<!-- Этот шаблон не скомпилируется -->
<template>
  <MyComponent v-slot="{ message }">
    <p>{{ message }}</p>
    <template #footer>
      <!-- message принадлежит слоту по умолчанию и здесь недоступно -->
      <p>{{ message }}</p>
    </template>
  </MyComponent>
</template>
```

Использование явного тега `<template>` для слота по умолчанию помогает дать понять, что входной параметр `message` недоступен внутри другого слота:

```vue-html
<template>
  <MyComponent>
    <!-- Использование явного слота по умолчанию -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

### Пример необычного списка {#fancy-list-example}

Вам может быть интересно, что было бы хорошим вариантом использования слотов с ограниченной областью видимости. Вот пример: представьте себе компонент `<FancyList>`, который отображает список элементов — он может инкапсулировать логику загрузки удаленных данных, использования данных для отображения списка или даже дополнительных функций, таких как нумерация страниц или бесконечная прокрутка. Однако мы хотим, чтобы он был гибким в отношении того, как выглядит каждый элемент, и оставляем стилизацию каждого элемента родительскому компоненту, который его использует. Таким образом, желаемое использование может выглядеть так:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

Внутри `<FancyList>` мы можем отобразить один и тот же `<slot>` несколько раз с разными данными элементов (обратите внимание, что мы используем `v-bind` для передачи объекта в качестве входного параметра слота):

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### Компонент без рендеринга {#renderless-components}

Пример использования `<FancyList>`, который мы рассмотрели выше, инкапсулирует как логику повторного использования (выборка данных, пагинация и т.д.), так и визуальный вывод, при этом делегируя часть визуального вывода компоненту-потребителю с помощью скопированных слотов.

Если мы продвинем эту концепцию немного дальше, то сможем придумать компоненты, которые инкапсулируют только логику и сами ничего не отображают - визуальный вывод полностью делегируется компоненту-потребителю с помощью скопированных слотов. Мы называем этот тип компонентов **Компонент без рендеринга**.

Примером компонента без рендеринга может быть компонент, который инкапсулирует логику отслеживания текущего положения мыши:

```vue-html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

Хотя это интересный паттерн, большинство из того, что можно достичь с помощью компонентов без рендеринга, может быть достигнуто более эффективным способом с помощью Composition API, без накладных расходов на дополнительную вложенность компонентов. Позже мы увидим, как можно реализовать ту же функциональность отслеживания мыши с помощью [Composables](/guide/reusability/composables.html).

Тем не менее, слоты с ограниченной областью по-прежнему полезны в тех случаях, когда нам нужно как инкапсулировать логику, **так и** составить визуальный вывод, как в примере `<FancyList>`.
