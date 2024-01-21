import { ref } from 'vue'
import TreeItem from './TreeItem.vue'

export default {
  components: {
    TreeItem
  },
  setup() {
    const treeData = ref({
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
    })

    return {
      treeData
    }
  }
}
