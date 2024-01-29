import { ref } from 'vue'

export default {
  setup() {
    // выдаем всем todo уникальные id
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: 'Изучить HTML' },
      { id: id++, text: 'Изучить JavaScript' },
      { id: id++, text: 'Изучить Vue' }
    ])

    function addTodo() {
      todos.value.push({ id: id++, text: newTodo.value })
      newTodo.value = ''
    }

    function removeTodo(todo) {
      todos.value = todos.value.filter((t) => t !== todo)
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
