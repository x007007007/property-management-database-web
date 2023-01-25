<template>
  <q-page class="flex">
    <div v-if="selectLocationHubs">
      <div v-for="hub in selectLocationHubs" :key="hub.id">
        name: {{ hub.name }}
        location: {{ hub.location_detail.path }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>

<script setup>
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useLocationStore } from 'stores/location.js'

const locationStore = useLocationStore()
const route = useRoute()
const selectLocationHubs = ref({})
const selectPhotoList = ref([])

const updateDetail = async () => {
  if(locationStore && locationStore.selected) {
    selectLocationHubs.value = (await axios.get(`/api/v1/hub/`, {
      params: {
        location: locationStore.selected
      }
    })).data.results
  }
}

watch(() => locationStore.selected, async () => {
  console.log('change')
  await updateDetail()
})


onBeforeMount(async () => {

})


</script>
