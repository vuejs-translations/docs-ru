import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Привет Мир!')
    const isRed = ref(true)
    const color = ref('зеленый')

    function toggleRed() {
      isRed.value = !isRed.value
    }

    function toggleColor() {
      color.value = color.value === 'зеленый' ? 'синий' : 'зеленый'
    }

    return {
      message,
      isRed,
      color,
      toggleRed,
      toggleColor
    }
  }
}
