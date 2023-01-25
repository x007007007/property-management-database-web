<template>
  <q-page class="row items-center justify-evenly">
    <input ref="photoInputRef" class="image-input" type="file" accept="image/*" capture="camera" @change="onTakePhoto"/>
    <div v-if="photo" class="col-6">
      <q-btn-group push>
        <q-btn @click="takePhoto">重拍</q-btn>
        <q-btn @click="submit">提交</q-btn>
      </q-btn-group>
      <q-img
           fit="contain"
           :src="photo"></q-img>
    </div>
    <div v-else class="col-6">
      <q-btn  @click="takePhoto">拍照</q-btn>
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
import { ref } from 'vue'
const photo = ref()
const photoInputRef = ref()

const takePhoto = () => {
  photoInputRef.value.click()
}

const onTakePhoto = (e) => {
  const files = e.target.files || e.dataTransfer.files
  photo.value = URL.createObjectURL(e.target.files[0])
}

const submit = (e) => {

}

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
