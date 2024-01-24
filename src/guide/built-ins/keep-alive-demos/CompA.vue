<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <p>Текущий компонент: A</p>
  <span style="margin-right: 20px">Количество: {{ count }}</span>
  <button @click="count++">+</button>
</template>
