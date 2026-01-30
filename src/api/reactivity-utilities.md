# Reactivity API: Утилиты {#reactivity-api-utilities}

## isRef() {#isref}

Проверяет, является ли значение ref-объектом.

- **Тип**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Обратите внимание, что возвращаемый тип является [предикатом типа](https://www.typescriptlang.org/docs/handbook/2/narrowing#using-type-predicates), поэтому `isRef` может быть использован как `type guard`:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // тип foo сужен до Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Возвращает внутреннее значение, если аргумент является ref-объектом, в противном случае возвращает сам аргумент. Функция является синтаксическим сахаром для `val = isRef(val) ? val.value : val`.

- **Тип**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Пример**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped теперь гарантированно имеет числовой тип
  }
  ```

## toRef() {#toref}

Может использоваться для нормализации значений / ref-объектов / геттеров к ref-ссылкам (3.3+).

Может использоваться для создания ref-ссылки на свойство исходного реактивного объекта. Созданная ref-ссылка синхронизируется с исходным свойством: изменение свойства в исходном объекте приведет к обновлению ref-ссылки и наоборот.

- **Тип**

  ```ts
  // сигнатура нормализации (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // сигнатура свойства объекта
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  Сигнатура нормализации (3.3+):

  ```js
  // возвращает существующие ref-объекты как есть
  toRef(existingRef)

  // создает ref-ссылку только для чтения, которая вызывает геттер при обращении к .value
  toRef(() => props.foo)

  // создает нормальную ref-ссылку для значений, кроме функций
  // эквивалент для ref(1)
  toRef(1)
  ```

  Сигнатура свойства объекта:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // двусторонняя ref-ссылка, которая синхронизируется с исходным свойством
  const fooRef = toRef(state, 'foo')

  // мутация ref-ссылки обновляет оригинал
  fooRef.value++
  console.log(state.foo) // 2

  // мутация оригинала также обновляет ref-объект
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Обратите внимание, что это отличается от:

  ```js
  const fooRef = ref(state.foo)
  ```

  Приведенная выше ref-ссылка **не синхронизируется** с `state.foo`, потому что `ref()` получает обычное числовое значение.

  Функция `toRef()` полезна, когда вы хотите передать ref-ссылку входного параметра в composable-функцию:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // преобразуем `props.foo` в ref-ссылку, и затем передаем
  // в composable-функцию
  useSomeFeature(toRef(props, 'foo'))

  // синтаксис геттера - рекомендовано в 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Когда `toRef` используется с входными параметрами компонента, обычные ограничения на изменение входных параметров остаются в силе. Попытка присвоить новое значение ref-ссылке эквивалентна попытке изменить входные параметры напрямую, что в свою очередь - не допустимо. В этом случае вы можете рассмотреть возможность использования [`computed`](./reactivity-core#computed) с `get` и `set` вместо этого. Для получения дополнительной информации смотрите руководство по [использованию `v-model` в компонентах](/guide/components/events#usage-with-v-model).

  При использовании сигнатуры свойства объекта, `toRef()` вернет пригодную для использования ref-ссылку, даже если исходное свойство в данный момент не существует. Это позволяет работать с опциональными свойствами, которые не были бы подхвачены [`toRefs`](#torefs).

## toValue() {#tovalue}

- Поддерживается только в версиях 3.3+

Нормализует значения / ref-объекты / геттеры к значениям. Это похоже на [unref()](#unref), с той лишь разницей, что оно также нормализует геттеры. Если аргумент является геттером, то он будет вызван, и будет возвращено его возвращаемое значение.

Это можно использовать в [composable-функциях](/guide/reusability/composables.html) для нормализации аргумента, который может быть значением, ref-объектом или геттером.

- **Тип**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Пример**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Нормализация аргументов в composable-функциях:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(
      () => toValue(id),
      id => {
        // реагировать на изменения id
      }
    )
  }

  // эта composable-функция поддерживает что-либо из следующего:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Преобразует реактивный объект в обычный объект, где каждое свойство результирующего объекта является ref-ссылкой, указывающей на соответствующее свойство исходного объекта. Каждая отдельная ref-ссылка создается с помощью [`toRef()`](#toref).

- **Тип**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Тип stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // ref-ссылка и исходное свойство "связаны"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` полезно использовать при возвращении реактивного объекта из composable-функции, чтобы использующий функцию компонент мог деструктурировать возвращенный объект без потери реактивности:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...логика, работающая с состоянием

    // создание ref-ссылок при возвращении
    return toRefs(state)
  }

  // может быть деструктурировано без потери реактивности
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` будет генерировать ссылки только для тех свойств, которые являются перечислимыми для исходного объекта на момент вызова. Чтобы создать ссылку для свойства, которое может еще не существовать, используйте [`toRef`](#toref).

## isProxy() {#isproxy}

Проверяет, является ли объект прокси, созданным с помощью [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) или [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Тип**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

Проверяет, является ли объект прокси, созданным [`reactive()`](./reactivity-core#reactive) или [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Тип**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Проверяет, является ли переданное значение объектом только для чтения. Свойства объекта только для чтения могут изменяться, но их нельзя присвоить напрямую через переданный объект.

Прокси, созданные [`readonly()`](./reactivity-core#readonly) и [`shallowReadonly()`](./reactivity-advanced#shallowreadonly), считаются доступными только для чтения, как и ref-ссылка [`computed()`](./reactivity-core#computed) без функции `set`.

- **Тип**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
