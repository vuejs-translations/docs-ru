import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Привет Мир!')

    function reverseMessage() {
      // Доступ/изменение значения ссылки
      // через ее свойство .value
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('навигация была предотвращена.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
