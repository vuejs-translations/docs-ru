import TreeItem from './TreeItem.vue'

const treeData = {
  name: 'Мое дерево',
  children: [
    { name: 'привет' },
    { name: 'мир' },
    {
      name: 'дочерняя папка',
      children: [
        {
          name: 'дочерняя папка',
          children: [{ name: 'привет' }, { name: 'мир' }]
        },
        { name: 'привет' },
        { name: 'мир' },
        {
          name: 'дочерняя папка',
          children: [{ name: 'привет' }, { name: 'мир' }]
        }
      ]
    }
  ]
}

export default {
  components: {
    TreeItem
  },
  data() {
    return {
      treeData
    }
  }
}
