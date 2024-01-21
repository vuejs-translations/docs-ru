<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Руководство по кодам ошибок {#error-reference}

## Ошибки в runtime {#runtime-errors}

В production, третий аргумент, переданный в обработчик ошибок, будет содержать код вместо полного указания источника. Это относится к следующим API:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

Эта таблица содержит соотношения кодов источников ошибок и оригинальных текстов.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Ошибки компиляции {#compiler-errors}

Эта таблица содержит соотношения кодов ошибок компиляции и оригинальных сообщений.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
