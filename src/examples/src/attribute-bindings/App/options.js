export default {
  data() {
    return {
      message: 'Привет Мир!',
      isRed: true,
      color: 'зеленый'
    }
  },
  methods: {
    toggleRed() {
      this.isRed = !this.isRed
    },
    toggleColor() {
      this.color = this.color === 'зеленый' ? 'синий' : 'зеленый'
    }
  }
}
