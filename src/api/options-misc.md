# Опции: Прочее {#options-misc}

## name {#name}

Явное объявление отображаемого имени компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Подробности**

  Имя компонента используется в следующих целях:

  - Рекурсивная ссылка на себя в собственном шаблоне компонента
  - Отображение в дереве компонентов Vue DevTools
  - Отображение в трассировке предупреждений компонентов

  При использовании однофайловых компонентов компонент уже сам определяет свое имя на основе имени файла. Например, файл с именем `MyComponent.vue` будет иметь предполагаемое отображаемое имя "MyComponent".

  Другой случай - при глобальной регистрации компонента с помощью [`app.component`](/api/application#app-component) в качестве его имени автоматически устанавливается глобальный ID.

  Опция `name` позволяет переопределить подставляемое имя или явно указать имя, если оно не может быть подставлено (например, если не используются средства сборки или встраивается не однофайловый компонент).

  Есть один случай, когда `name` явно необходим: при сопоставлении с кэшируемыми компонентами в [`<KeepAlive>`](/guide/built-ins/keep-alive) через его входные параметры `include / exclude`.

  :::tip Совет
  Начиная с версии 3.2.34, однофайловый компонент, использующий `<script setup>`, будет автоматически определять опцию `name` на основе имени файла, что избавляет от необходимости вручную объявлять имя даже при использовании `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Управляет тем, должно ли быть включено стандартное поведение наследования атрибутов компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // по умолчанию: true
  }
  ```

- **Подробности**

  По умолчанию атрибуты из родительской области видимости, не распознанные как входные параметры, будут "проваливаться". Это означает, что при наличии компонента с одним корнем эти привязки будут применяться к корневому элементу дочернего компонента как обычные HTML атрибуты. При создании компонента, который оборачивает элемент или другой компонент, такое поведение может быть не всегда желательным. Установив для параметра `inheritAttrs` значение `false`, можно отключить это поведение по умолчанию. Атрибуты доступны через свойство экземпляра `$attrs` и могут быть явно привязаны к некорневому элементу с помощью `v-bind`.

- **Пример**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  При объявлении этой опции в компоненте, использующем `<script setup>`, вы можете использовать макрос [`defineOptions`](/api/sfc-script-setup#defineoptions):

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **См. также** [Передача обычных атрибутов](/guide/components/attrs)

## components {#components}

Объект для регистрации компонентов, которые должны быть доступны экземпляру компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Пример**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // сокращение
      Foo,
      // зарегистрировать под другим именем
      RenamedBar: Bar
    }
  }
  ```

- **См. также** [Регистрация компонентов](/guide/components/registration)

## directives {#directives}

Объеке для регистрирации директив, которые должны быть доступны экземпляру компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Пример**

  ```js
  export default {
    directives: {
      // директива v-focus доступна в шаблоне
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

  Хэш директив, которые должны быть доступны экземпляру компонента.

- **См. также** [Пользовательские директивы](/guide/reusability/custom-directives)
