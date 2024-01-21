import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  data() {
    return {
      childMsg: 'Пока нет сообщения от дочернего компонента'
    }
  }
}
