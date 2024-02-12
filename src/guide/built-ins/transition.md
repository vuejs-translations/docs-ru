<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue предлагает два встроенных компонента, которые помогают работать с переходами и анимацией в ответ на изменение состояния:

- `<Transition>` для применения анимации элемента или компонента при входе и выходе из DOM. Об этом рассказывается на этой странице.

- `<TransitionGroup>` для применения анимации при вставке, удалении или перемещении элемента или компонента в списке `v-for`. Этому посвящена [следующая глава](/guide/built-ins/transition-group.html).

Помимо этих двух компонентов, во Vue можно применять анимацию и с помощью других приёмов, таких как переключение CSS-классов или анимация, управляемая состоянием с помощью привязки стилей. Эти дополнительные приёмы рассматриваются в главе [Техники анимации](/guide/extras/animation.html).

## Компонент `<Transition>` {#the-transition-component}

`<Transition>` является встроенным компонентом: это означает, что он доступен в шаблоне любого компонента без необходимости его регистрации. Он может использоваться для применения анимации входа и выхода к элементам или компонентам, передаваемым ему через слот по умолчанию. Вход или выход может быть вызван одним из следующих действий:

- Условное отображение через `v-if`
- Условное отображение с помощью `v-show`
- Переключение динамических компонентов с помощью специального элемента `<component>`
- Изменение специального аттрибута `key`

Это пример наиболее простого использования:

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">привет</p>
</Transition>
```

```css
/* мы объясним, что делают эти классы дальше! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip Совет
`<Transition>` поддерживает только один элемент или компонент в качестве содержимого своего слота. Если содержимое является компонентом, то компонент также должен иметь только один единственный корневой элемент.
:::

Когда элемент в компоненте `<Transition>` вставляется или удаляется, происходит следующее:

1. Vue автоматически определяет, есть ли в целевом элементе CSS-переходы или анимация. Если это так, то в соответствующие моменты времени будут добавлены/удалены несколько [классов CSS-переходов](#transition-classes).

2. Если есть слушатели для [JavaScript хуков](#javascript-hooks), то эти хуки будут вызываться в соответствующие моменты времени.

3. Если переходы/анимации CSS не обнаружены и хуки JavaScript не предоставлены, операции DOM по вставке и/или удалению будут выполняться в следующем кадре анимации браузера.

## Переходы на основе CSS {#css-based-transitions}

### Классы перехода {#transition-classes}

Для переходов входа/выхода применяются шесть классов.

![Диаграмма переходов](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: Начало анимации появления элемента. Добавляется перед вставкой элемента, удаляется через один кадр после вставки элемента.

2. `v-enter-active`: Активное состояние появления элемента. Этот класс остаётся на элементе в течение всей анимации появления. Добавляется перед вставкой элемента, удаляется по завершении перехода/анимации. Этот класс можно использовать для установки длительности, задержки или функции плавности (easing curve) анимации появления.

3. `v-enter-to`: Завершение анимации появления элемента. Добавляется в следующем фрейме после вставки элемента (тогда же удаляется `v-enter-from`), а удаляется после завершения перехода или анимации.

4. `v-leave-from`: Начало анимации исчезновения элемента. Добавляется сразу после вызова анимации исчезновения, а удаляется в следующем фрейме после этого.

5. `v-leave-active`: Активное состояние анимации исчезновения. Этот класс остаётся на элементе в течение всей анимации исчезновения. Он добавляется при вызове анимации исчезновения, а удаляется после завершения перехода или анимации. Этот класс можно использовать для установки длительности, задержки или функции плавности (easing curve) анимации исчезновения.
6. 
7. `v-leave-to`: Завершение анимации исчезновения элемента. Добавляется в следующем фрейме после вызова анимации исчезновения (тогда же удаляется `v-leave-from`), а удаляется после завершения перехода или анимации.

Классы  `v-enter-active` и `v-leave-active` позволяют устанавливать кривые плавности для переходов появления и исчезновения элемента. Пример использования рассмотрим ниже.

### Именованные переходы {#named-transitions}

Переход может быть назван с помощью свойства `name`:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Для именованного перехода его классы переходов будут иметь префикс с названием, а не `v`. Например, применяемый класс для приведенного выше перехода будет `fade-enter-active`, а не `v-enter-active`. CSS для перехода fade должен выглядеть следующим образом:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS-переходы {#css-transitions}

`<Transition>` чаще всего используется в сочетании с [собственными CSS-переходами](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), как показано в базовом примере выше. CSS-свойство `transition` - это сокращение, позволяющее указать множество аспектов перехода, включая свойства, которые должны быть анимированы, длительность перехода и [функции плавности](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

Приведем более сложный пример, в котором переходы осуществляются по нескольким свойствам, с различными длительностями и функциями плавностями для входа и выхода:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">привет</p>
</Transition>
```

```css
/*
  Анимации появления и исчезновения могут иметь
  различные продолжительности и функции плавности.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS-анимации {#css-animations}

[Собственные CSS-анимации](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) применяются таким же образом, что и CSS-переходы. Они отличаются лишь тем, что `*-enter-from` удаляется не сразу после вставки элемента, а при наступлении события `animationend`.

Для большинства CSS-анимаций мы можем просто объявить их в классах `*-enter-active` и `*-leave-active`. Вот пример:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Привет, вот какой-то задорный текст!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### Пользовательские классы переходов {#custom-transition-classes}

Вы также можете указать пользовательские классы переходов, передав в `<Transition>` следующие входные параметры:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Они будут заменять обычные имена классов. Это особенно полезно, если вы хотите объединить систему переходов Vue с существующей библиотекой анимации CSS, например [Animate.css](https://daneden.github.io/animate.css/):

```vue-html
<!-- при условии, что Animate.css добавлен на странице -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">привет</p>
</Transition>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### Совместное использование переходов и анимаций {#using-transitions-and-animations-together}

Для определения завершения анимации Vue использует прослушиватели событий с типом `transitionend` или `animationend`, в зависимости от типа применяемых CSS-правил. Если используется только один подход из них, Vue определит правильный тип автоматически.

Однако, в некоторых случах может потребоваться использовать оба подхода на одном элементе. Например CSS-анимация, запущенная Vue, может соседствовать с эффектом CSS-перехода при наведении на элемент. В таких случаях потребуется явное указание типа события, на которое должен ориентироваться Vue. Для этого нужно использовать атрибут `type` со значением `animation` или `transition`:

```vue-html
<Transition type="animation">...</Transition>
```

### Вложенные переходы и явные длительности переходов {#nested-transitions-and-explicit-transition-durations}

Хотя классы перехода применяются только к непосредственному дочернему элементу `<Transition>`, мы можем переходить к вложенным элементам с помощью вложенных CSS-селекторов:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Привет
    </div>
  </div>
</Transition>
```

```css
/* правила, нацеленные на вложенные элементы */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... другие необходимые CSS не указаны */
```

Мы можем даже добавить задержку перехода во вложенный элемент при входе, что создаст ступенчатую последовательность анимации входа:

```css{3}
/* задержка появления вложенного элемента для эффекта */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

Однако при этом возникает небольшая проблема. По умолчанию компонент `<Transition>` пытается автоматически определить момент завершения перехода, слушая **первое событие** `transitionend` или `animationend` на корневом элементе перехода.  При вложенном переходе желательным поведением будет ожидание завершения переходов всех внутренних элементов.

В таких случаях можно указать явную длительность перехода (в миллисекундах) с помощью параметра `duration` компонента `<transition>`. Общая длительность должна соответствовать длительности задержки плюс длительности перехода внутреннего элемента:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Попробовать в песочнице](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

При необходимости можно также задать отдельные значения для продолжительности входа и выхода с помощью объекта:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Соображения по производительности {#performance-considerations}

Вы можете заметить, что в приведенных выше анимациях в основном используются такие свойства, как `transform` и `opacity`. Эти свойства эффективны для анимации, поскольку:

1. Они не влияют на макет документа во время анимации, поэтому не вызывают дорогостоящих расчётов шаблона CSS на каждом кадре анимации.

2. Большинство современных браузеров могут использовать аппаратное ускорение GPU при `transform`.

Для сравнения, такие свойства, как `height` или `margin` вызывают шаблон CSS, поэтому их анимировать гораздо дороже, и использовать их следует с осторожностью. Мы можем обратиться к таким ресурсам, как [CSS-Triggers](https://csstriggers.com/), чтобы узнать, какие свойства будут вызывать компоновку, если мы их анимируем.

## JavaScript хуки {#javascript-hooks}

Вы можете подключиться к процессу перехода с помощью JavaScript, прослушивая события на компоненте `<Transition>`:

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// вызывается перед вставкой элемента в DOM.
// используется для установки состояния "enter-from" элемента
function onBeforeEnter(el) {}

// вызывается через один кадр после вставки элемента.
// используйте его для запуска анимации входа.
function onEnter(el, done) {
  // вызов обратного вызова done для индикации окончания перехода
  // необязателен, если используется в сочетании с CSS
  done()
}

// вызывается по завершении перехода enter.
function onAfterEnter(el) {}

// called when the enter transition is cancelled before completion.
function onEnterCancelled(el) {}

// вызывается перед хуком leave.
// В большинстве случаев следует использовать только хук leave
function onBeforeLeave(el) {}

// вызывается, когда начинается переход к leave.
// используйте его для запуска анимации ухода.
function onLeave(el, done) {
  // вызов обратного вызова done для индикации окончания перехода
  // необязательно, если используется в сочетании с CSS
  done()
}

// вызывается, когда переход к leave завершен
// элемент был удален из DOM.
function onAfterLeave(el) {}

// доступно только при использовании переходов v-show
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // вызывается перед вставкой элемента в DOM.
    // используется для установки состояния "вход-выход" элемента
    onBeforeEnter(el) {},

    // вызывается через один кадр после вставки элемента.
    // используйте это, чтобы запустить анимацию.
    onEnter(el, done) {
      // вызов обратного вызова done для индикации окончания перехода
      // необязательно, если используется в сочетании с CSS
      done()
    },

    // вызывается по завершении перехода на enter.
    onAfterEnter(el) {},
    onEnterCancelled(el) {},

    // вызывается перед хуком leave.
    // В большинстве случаев вам следует просто использовать хук leave.
    onBeforeLeave(el) {},

    // вызывается, когда начинается переход к leave.
    // используйте это, чтобы запустить анимацию ухода.
    onLeave(el, done) {
      // вызовите обратный вызов done, чтобы указать конец перехода
      // необязательно, если используется в сочетании с CSS
      done()
    },

    // вызывается, когда переход к leave завершен
    // и элемент был удален из DOM.
    onAfterLeave(el) {},

    // доступно только с переходами v-show
    onLeaveCancelled(el) {}
  }
}
```

</div>

Эти хуки могут использоваться как в сочетании с CSS-переходами/анимацией, так и самостоятельно.

При использовании переходов, основанных только на JavaScript, обычно рекомендуется добавить параметр `:css="false"`. Это явно указывает Vue на необходимость пропускать автоматическое определение CSS-переходов. Помимо того, что это несколько повышает производительность, это также предотвращает случайное вмешательство CSS-правил в переход:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

При использовании `:css="false"`  мы также полностью отвечаем за контроль окончания перехода. В этом случае обратные вызовы `done` необходимы для хуков `@enter` и `@leave`. В противном случае хуки будут вызываться синхронно и переход завершится немедленно.

Вот демонстрация использования [библиотеки GreenSock](https://greensock.com/) для выполнения анимации. Конечно, вы можете использовать любую другую библиотеку анимации, например [Anime.js](https://animejs.com/) или [Motion One](https://motion.dev/).

<JsHooks />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## Переиспользуемые переходы {#reusable-transitions}

Переходы можно повторно использовать через систему компонентов Vue. Чтобы создать повторно используемый переход, мы можем создать компонент, который обертывает компонент `<Transition>` и передает содержимое слота:

```vue{5}
<!-- MyTransition.vue -->
<script>
// Логика хуков JavaScript...
</script>

<template>
  <!-- обернуть встроенный компонент Transition -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- передать содержимое слота -->
  </Transition>
</template>

<style>
/*
  Необходимый CSS...
  Примечание: избегайте использования здесь <style scoped>,
  так как это не относится к содержимому слота.
*/
</style>
```

Теперь `MyTransition` можно импортировать и использовать так же, как встроенную версию:

```vue-html
<MyTransition>
  <div v-if="show">привет</div>
</MyTransition>
```

## Переход при появлении {#transition-on-appear}

Если вы также хотите применить переход при начальном рендеринге узла, вы можете добавить атрибут `appear`:

```vue-html
<Transition appear>
  ...
</Transition>
```

## Переход между элементами {#transition-between-elements}

Помимо переключения элемента с помощью `v-if` / `v-show`, мы также можем осуществлять переход между двумя элементами с помощью `v-if` / `v-else` / `v-else-if`, при условии, что в каждый момент времени отображается только один элемент:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Редактировать</button>
  <button v-else-if="docState === 'edited'">Сохранить</button>
  <button v-else-if="docState === 'editing'">Отменить</button>
</Transition>
```

<BetweenElements />

[Попробовать в песочнице](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## Режимы перехода {#transition-modes}

В предыдущем примере элементы входа и выхода анимируются одновременно, и нам пришлось сделать `position: absolute` чтобы избежать проблем с компоновкой, когда оба элемента присутствуют в DOM.

Однако в некоторых случаях это невозможно или просто нежелательно. Мы можем захотеть, чтобы сначала анимировался выходящий элемент, а входящий элемент вставлялся только **после** завершения анимации выхода. Организовать такую анимацию вручную было бы очень сложно - к счастью, мы можем включить это поведение, передав `<Transition>` свойство `mode`:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Вот предыдущая демонстрация с `mode="out-in"`:

<BetweenElements mode="out-in" />

`<Transition>` также поддерживает режим `mode="in-out"`, хотя он используется гораздо реже.

## Переход между компонентами {#transition-between-components}

`<Transition>` также может использоваться вокруг [динамических компонентов](/guide/essentials/component-basics#dynamic-components):

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## Динамические переходы {#dynamic-transitions}

Входные параметры `<Transition>`, например `name` также может быть динамическим! Это позволяет нам динамически применять различные переходы в зависимости от изменения состояния:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Это может быть полезно, если вы определили CSS-переходы / анимацию, используя соглашения Vue о классах переходов, и хотите переключаться между ними.

Также можно применять различное поведение в переходах JavaScript-хуков в зависимости от текущего состояния компонента. Наконец, окончательный способ создания динамических переходов - это [многократно используемые компоненты переходов](#reusable-transitions), которые принимают входные параметры для изменения характера используемого перехода (переходов). Это может показаться банальным, но на самом деле единственное ограничение - это ваше воображение.

---

**Связанное**

- [`<Transition>` Справочник API](/api/built-in-components#transition)
