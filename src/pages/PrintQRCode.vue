<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div  v-for="j in groups" :key="j.name" class="row wrap justify-start items-start">
        <div class="col-12">{{ j.name }}</div>
        <div v-for="i in j.items" :key='i.id' class="overflow: auto;">
          <div class="qr-box">
            <q-img
              :src="`/api/v1/hub/${i.id}/qrcode`"
              style="width: 1cm; height: 1cm"
            ></q-img>
            {{ i.name }}#{{i.code}}
          </div>
        </div>
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
import { onBeforeMount, ref, computed } from 'vue'
import axios from 'axios'

const l = ref()

const groups = computed(() => {
  const group = {}
  for(const item of l.value) {
    const path = item['location_detail'] && item['location_detail']['path'] || ''
    if (!group[path]) {
      group[path] = {
        name: path,
        items: [item]
      }
    } else {
      group[path].items.push(item)
    }
  }
  let res = []
  for (const path in group) {
    res.push(group[path])
  }
  return res
})
async function *iterhub() {
  let page = 0
  const prePageCount = 100
  while (1) {
    let thePageRes = (await axios.get(`/api/v1/hub/?page=${page+1}`)).data
    for (const item of thePageRes.results) {
      yield item
    }
    let currentRead = thePageRes.results.length + page * prePageCount
    if (currentRead >= thePageRes.count) {
      break
    }
  }
}

onBeforeMount(async () => {
  l.value = []
  for await (const val of iterhub()) {
    l.value.push(val)
  }

})
</script>

<style>
@page {
  size: A4;
  margin: 0;
}
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
}

</style>

<style scoped>
div.qr-box {
  padding: 2px;
  border-style: dashed;
  border-width: 1px;
}
</style>
