import { ref } from 'vue'

export default {
  setup() {
    const text = ref('Отредактируйте меня')
    const checked = ref(true)
    const checkedNames = ref(['Джек'])
    const picked = ref('Один')
    const selected = ref('A')
    const multiSelected = ref(['A'])

    return {
      text,
      checked,
      checkedNames,
      picked,
      selected,
      multiSelected
    }
  }
}
