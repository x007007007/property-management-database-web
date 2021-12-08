<template>
  <div>
    <q-select
      v-model="selectDevice"
      option-label="label"
      option-value="deviceId"
      :options="devices"
    />
    <div class="camera">
      <video
        id="video"
        ref="video"
        @canplay="videoCanPlayCallback"
        :height="height"
        :width="width"
      >Video stream not available.</video>
    </div>
    <button @click="capture">open video</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Camera',
  data () {
    let selectDevice: MediaDeviceInfo|null = null
    let devices: MediaDeviceInfo[] = []
    return {
      width: 320,
      height: 0,
      is_streaming: false,
      selectDevice,
      devices,
    }
  },
  methods: {
    async refreshDevice () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log('enumerateDevices() not supported.');
        return
      }
      this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (x: MediaDeviceInfo)=>{
          return x.kind === 'videoinput'
        }).map((x: MediaDeviceInfo, index) => {
          interface Label {
            label: string
          }
          if (!x.label) {
            let r = JSON.parse(JSON.stringify(x)) as Label
            r.label = `device ${index}`
            return r as MediaDeviceInfo
          }
          return x
      })
    },
    async capture () {
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: false,
      }
      if (this.selectDevice !== null) {
        constraints['video'] = {deviceId: (this.selectDevice as unknown as MediaDeviceInfo).deviceId}
      } else {
        constraints.video = true
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const videoDom = document.querySelector<HTMLVideoElement>('#video')
      if ( videoDom ) {
        videoDom.srcObject = stream
        await videoDom.play()
      }
    },
    videoCanPlayCallback() {
      let videoDom = document.querySelector<HTMLVideoElement>('#video')
      if (!this.is_streaming) {
        if (videoDom) {
          this.height = videoDom.videoHeight / (videoDom.videoWidth / this.width)
        } else {
          this.height = NaN
        }
        if (isNaN(this.height)) {
          this.height = this.width / (4/3);
        }
        this.is_streaming = true;
      }
    }
  },
  async mounted() {
    await this.refreshDevice()
  }
})
</script>

<style scoped>

</style>
