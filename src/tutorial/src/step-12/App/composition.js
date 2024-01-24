import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const greeting = ref('Привет от родителя')

    return {
      greeting
    }
  }
}
