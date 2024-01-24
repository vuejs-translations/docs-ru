// выдаем всем todo уникальные id
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: 'Изучить HTML' },
        { id: id++, text: 'Изучить JavaScript' },
        { id: id++, text: 'Изучить Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
