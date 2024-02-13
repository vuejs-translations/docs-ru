import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: 'Овощи' },
      { id: 1, text: 'Сыр' },
      { id: 2, text: 'Что угодно съедобное для человека' }
    ])

    return {
      groceryList
    }
  }
}
