let id = 0

export default {
  data() {
    return {
      newTodo: '',
      hideCompleted: false,
      todos: [
        { id: id++, text: 'Изучить HTML', done: true },
        { id: id++, text: 'Изучить JavaScript', done: true },
        { id: id++, text: 'Изучить Vue', done: false }
      ]
    }
  },
  computed: {
    // ...
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo, done: false })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
