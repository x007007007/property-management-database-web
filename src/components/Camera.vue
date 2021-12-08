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
    <button @click="stopPlay">||</button>
    <button @click="startPlay">&gt;</button>
    <button @click="closeStream">close video</button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Camera',
  data () {
    let selectDevice: MediaDeviceInfo|null = null
    let devices: MediaDeviceInfo[] = []
    let stream: MediaStream|null = null
    return {
      width: 320,
      height: 0,
      is_streaming: false,
      stream,
      selectDevice,
      devices,
    }
  },
  methods: {
    getVideoDom () {
      return document.querySelector<HTMLVideoElement>('#video')
    },
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
    async getSelectedStream ()  {
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
      return stream
    },
    async capture () {
      const stream = await this.getSelectedStream()
      const videoDom = this.getVideoDom()
      if ( videoDom ) {
        videoDom.srcObject = stream
        await videoDom.play()
      }
    },
    stopPlay() {
      const videoDom = this.getVideoDom()
      if ( videoDom ) {
        videoDom.pause()
      }
    },
    async startPlay() {
      const videoDom = this.getVideoDom()
      if ( videoDom ) {
        await videoDom.play()
      }
    },
    closeStream () {
      this.stopPlay()
      const videoDom = this.getVideoDom()
      if ( videoDom && videoDom.srcObject) {
        (videoDom.srcObject as MediaStream).getTracks().forEach(function(track) {
          track.stop();
        });
        videoDom.srcObject = null
      }
    },
    videoCanPlayCallback() {
      let videoDom = this.getVideoDom()
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
