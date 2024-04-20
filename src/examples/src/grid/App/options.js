import DemoGrid from './Grid.vue'

export default {
  components: {
    DemoGrid
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Чак Норис', power: Infinity },
      { name: 'Брюс ли', power: 9000 },
      { name: 'Джеки Чан', power: 7000 },
      { name: 'Джет Ли', power: 8000 }
    ]
  })
}
