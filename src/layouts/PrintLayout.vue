<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

const linksList = []

export default defineComponent({
  name: 'PrintLayout',

  setup () {
    return {
    }
  }
})
</script>
