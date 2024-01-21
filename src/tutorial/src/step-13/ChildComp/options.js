export default {
  emits: ['response'],
  created() {
    this.$emit('response', 'привет от дочернего компонента')
  }
}
