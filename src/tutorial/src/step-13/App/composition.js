import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref('Пока нет сообщения от дочернего компонента')

    return {
      childMsg
    }
  }
}
