import DemoGrid from './Grid.vue'
import { ref } from 'vue'

export default {
  components: {
    DemoGrid
  },
  setup() {
    const searchQuery = ref('')
    const gridColumns = ['name', 'power']
    const gridData = [
      { name: 'Чак Норис', power: Infinity },
      { name: 'Брюс Ли', power: 9000 },
      { name: 'Джеки Чан', power: 7000 },
      { name: 'Джет Ли', power: 8000 }
    ]

    return {
      searchQuery,
      gridColumns,
      gridData
    }
  }
}
