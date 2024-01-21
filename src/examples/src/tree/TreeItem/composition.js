import { ref, computed } from 'vue'

export default {
  name: 'TreeItem', // необходимо для ссылки на самого себя
  props: {
    model: Object
  },
  setup(props) {
    const isOpen = ref(false)
    const isFolder = computed(() => {
      return props.model.children && props.model.children.length
    })

    function toggle() {
      isOpen.value = !isOpen.value
    }

    function changeType() {
      if (!isFolder.value) {
        props.model.children = []
        addChild()
        isOpen.value = true
      }
    }

    function addChild() {
      props.model.children.push({ name: 'новый узел' })
    }

    return {
      isOpen,
      isFolder,
      toggle,
      changeType,
      addChild
    }
  }
}
