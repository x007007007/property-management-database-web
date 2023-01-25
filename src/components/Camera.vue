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
        @click="VideoClick"
        :height="height"
        :width="width"
      >Video stream not available.</video>
    </div>
    <button @click="()=>{capture()}">open video</button>
    <button @click="()=>{stopPlay()}">||</button>
    <button @click="()=>{startPlay()}">&gt;</button>
    <button @click="()=>{closeStream()}">close video</button>
    <button @click="pushStream">push stream</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import QrScanner from 'qr-scanner';
type Nullable<T> = T | void | undefined;

const video = ref<HTMLVideoElement>(),
    height = ref<number>(0),
    width = ref<number>(320),
    qrScanner = ref<QrScanner>(),
    stream = ref<MediaStream>(),
    selectDevice = ref<MediaDeviceInfo>(),
    devices = ref([]),
    requireResizeVideo = ref(true)


const getVideoDom = () => {
  return video.value
}

const refreshDevice = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices() not supported.');
    return
  }
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
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
  console.log(devices.value)
}
const getSelectedStream = async () => {
  let constraints: MediaStreamConstraints = {
    audio: false,
    video: false,
  }
  if (selectDevice.value !== null) {
    constraints['video'] = {
      deviceId: (selectDevice.value as unknown as MediaDeviceInfo).deviceId,
      facingMode: 'environment',
    }
  } else {
    constraints.video = {
      facingMode: 'environment',
    }
  }
  stream.value = await navigator.mediaDevices.getUserMedia(constraints)
  if (stream.value) {
    closeStream()
  }
  requireResizeVideo.value = true
  return stream
}

const capture = async () => {
  const stream = await getSelectedStream()
  if ( video.value ) {
    video.value.srcObject = stream.value as HTMLVideoElement
    qrScanner.value = new QrScanner(
      video.value,
      (result: string) => alert(`decoded qr code ${result}`),
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    await video.value.play()
    await qrScanner.value.start()
  }
},
  stopPlay = (videoDom: Nullable<HTMLVideoElement>) => {
  const theVideoDom: Nullable<HTMLVideoElement> = (videoDom?videoDom:getVideoDom()) as Nullable<HTMLVideoElement>
  if ( theVideoDom ) {
    theVideoDom.pause()
    qrScanner.value && qrScanner.value.stop()
  }
}, startPlay = async (videoDom: Nullable<HTMLVideoElement> = void HTMLVideoElement) => {
  const theVideoDom: Nullable<HTMLVideoElement> = (videoDom?videoDom:getVideoDom()) as Nullable<HTMLVideoElement>
  if ( theVideoDom ) {
    await theVideoDom.play()
    await qrScanner.value.start()
  }
}, closeStream = (videoDom: Nullable<HTMLVideoElement> = void HTMLVideoElement) => {
  const theVideoDom: Nullable<HTMLVideoElement> = (videoDom?videoDom:getVideoDom()) as Nullable<HTMLVideoElement>
  stopPlay(theVideoDom)
  if ( theVideoDom && theVideoDom.srcObject) {
    (theVideoDom.srcObject as MediaStream).getTracks().forEach(function(track) {
      track.stop();
    });
    theVideoDom.srcObject = null
  }
}, videoCanPlayCallback = () => {
  let videoDom = getVideoDom()
  if (requireResizeVideo.value) {
    if (videoDom) {
      height.value = videoDom.videoHeight / (videoDom.videoWidth / width.value)
    } else {
      height.value = NaN
    }
    if (isNaN(height.value)) {
      height.value = width.value / (4/3);
    }
    requireResizeVideo.value = false;
  }
}
// const pushStream = async () => {
//   let pc: RTCPeerConnection = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: 'stun:192.168.1.4:3478',
//       }
//     ]
//   })
//   pc.addEventListener('icegatheringstatechange', function() {
//     console.log(pc.iceGatheringState)
//   }, false)
//   pc.addEventListener('iceconnectionstatechange', function() {
//     console.log(pc.iceGatheringState)
//   }, false)
//   pc.addEventListener('signalingstatechange', function() {
//     console.log(pc.iceGatheringState)
//   }, false)
//   if (stream.value) {
//     for (let track of stream.value.getTracks()) {
//       pc.addTrack(track, stream.value);
//     }
//   }
//   let offer = await pc.createOffer()
//   await pc.setLocalDescription(offer)
//   console.log(pc.iceGatheringState)
//   console.log(pc.localDescription)
//   await fetch('https://192.168.1.8:8080/offer', {
//     body: JSON.stringify({
//       sdp: (pc.localDescription as RTCSessionDescription).sdp,
//       type: (pc.localDescription as RTCSessionDescription).type,
//       video_transform: 'edges'
//     }),
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'POST'
//   })
// }
const VideoClick = (env: Event) => {
  console.log(env)
}

onMounted(async () => {
  await refreshDevice()
})

</script>

<style scoped>

</style>
