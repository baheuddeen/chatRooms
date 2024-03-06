<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import VideosFacet from './VideosFacet';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
  setup() {
    const videosFacet = new VideosFacet();
    SocketIoClient.subscribeVideos({
        videos: videosFacet,
      });
    return SocketIoClient.videos.setup();
  },
});

</script>

<template>
  <div class="videos">
    <video v-for="stream of streams" :key="stream.id" :srcObject="stream" autoplay="true" :class="{
      'active': stream.isMainStream
    }"
    :test="stream.isMainStream ? 'main' : 'not main'"
    @click="onVideoClick(stream.id)"
    ></video>
  </div>
</template>

<style scoped>
.videos {
    position: fixed;
    z-index: 101;
    top: 25%;
    left: 0;
    width: 50%;
    max-height: 50%;
}
video {
    width: 100%;
    height: 150px;
}

video.active{
    width: 100%;
    height: 100%;
}
</style>
