<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Партнеры Vue' }}</template>
    <template #lead>
      <p>
      Партнеры Vue — это агентства, одобренные командой Vue,
      которые предоставляют первоклассные консультационные и услуги разработки на базе Vue.
      Если ваша компания заинтересована в том, чтобы быть указанной как партнер, пожалуйста,
      <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
        >зарегистрируйтесь здесь</a>.
      </p>
    </template>
  </PageHero>
</template>
