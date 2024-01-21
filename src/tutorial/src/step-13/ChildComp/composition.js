export default {
  emits: ['response'],
  setup(props, { emit }) {
    emit('response', 'привет от дочернего компонента')
    return {}
  }
}
