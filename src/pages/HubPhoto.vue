<template>
  <q-page class="row items-center justify-evenly">
    <q-card v-if="currentHub && !photo">
      <q-card-section>
        {{ currentHub.code }} : {{currentHub.name}}
      </q-card-section>
      <q-card-section  v-if="currentHub.location_detail">
        {{ currentHub.location_detail.path }}
      </q-card-section>
      <q-img v-if="currentHub.image"
        :src="currentHub.image"
      >
      </q-img>
    </q-card>
    <input ref="photoInputRef" class="image-input" type="file" accept="image/*" capture="camera" @change="onTakePhoto"/>
    <div v-if="photo" class="col-11">
      <q-btn-group push v-show="!isUploading">
        <q-btn @click="takePhoto">重拍</q-btn>
        <q-btn @click="submit">提交</q-btn>
      </q-btn-group>
      <label>        {{ currentHub.location_detail.path }}: {{currentHub.name}}</label>
      <q-img
        fit="contain"
        :src="photo"></q-img>
    </div>
    <div v-else class="col-6">
      <q-btn @click="takePhoto">拍照</q-btn>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'HubPhoto'
})
</script>

<script setup>
import { ref, onBeforeMount } from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'

const currentHub = ref()
const photo = ref()
const photoInputRef = ref()
const route = useRoute()
const currentFile = ref()
const isUploading = ref(false)

const takePhoto = () => {
  photoInputRef.value.click()
}

const onTakePhoto = (e) => {
  const files = e.target.files || e.dataTransfer.files
  currentFile.value = e.target.files[0]
  photo.value = URL.createObjectURL(currentFile.value)
}

const reset = () => {
  currentFile.value = null
  photo.value = ""
}
const submit = async (e) => {
  if (currentFile.value) {
    isUploading.value = true
    try {
      const code = route.params['code']
      const fileForm = new FormData
      fileForm.append('image', currentFile.value, 'photo.png')
      const res = await axios.post(`/api/v1/hub/${code}/photo/`, fileForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      console.log(res.data)
      reset()
    } catch (e) {
      isUploading.value = false
      window.alert('系统出错，请重试')
    }
    isUploading.value = false
  }
}


const getHubDetail = async () => {
  const code = route.params.code
  return (await axios.get(`/api/v1/hub/code/${code}/`)).data
}


onBeforeMount(async () => {
    currentHub.value = await getHubDetail()
})
</script>

<style lang="scss">
img.display {
  width: 100%;
  height: 100%;
}

input.image-input {
  display: none;
}
</style>
