export default {
  data() {
    return {
      message: 'Привет Мир!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('навигация была предотвращена.')
    }
  }
}
