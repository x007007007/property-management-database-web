<template>
  <q-tree
    :nodes="locationTree"
    :default-expand-all="true"
    :expanded="expanded"
    v-model:selected="locationStore.selected"
    tick-strategy="none"
    node-key="id"
    label-key="label"
  />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LocationNav'
})
</script>

<script setup>
import { useLocationStore } from 'stores/location.js'
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
const locationStore = useLocationStore()
const locationAPIRes = ref([])
const locationTree = ref([])
const expanded = ref([])

const updateLocationTree = async () => {
  locationAPIRes.value = (await axios.get("/api/v1/location_tree/")).data
}

const getLocationTree = (lt) => {
  const locIcon = 'location'
  expanded.value = []
  function transTreeNode(old) {
    const id = `${old.id}`
    expanded.value.push(id)
    const newNode = {
      label: old.name,
      id: id,
      icon: locIcon,
    }
    if (old.children && old.children.length && old.children.length > 0) {
      newNode.children = old.children.map(transTreeNode)
    }
    return newNode
  }
  return [transTreeNode(lt)]
}

onBeforeMount(async () => {
  await updateLocationTree()
  locationTree.value = getLocationTree(locationAPIRes.value)
})

</script>
