<script lang="ts">
import { defineComponent } from 'vue';
import SendImageFacet from './SendImageFacet';
import Button from 'primevue/button';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
  components: {
    Button,
  },

  props: {
    activeConversationId: {
      type: Number,
    },
  },

  setup(props, {emit}) {
    const sendImageFacet = new SendImageFacet();
    SocketIoClient.subscribeSendImage({
      sendImage: sendImageFacet,
    });
    return sendImageFacet.setup(props, emit);
  }
});
</script>

<template>
  <div>
    <div class="upload-image" @click="onChooseImage">
      <svg viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg" height="45" width="30"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path></svg>
    </div>
    <input type="file" ref="imageUploader" class="d-none"/>
  </div>
</template>

<style scoped>
.upload-image {
  cursor: pointer;
}
.image-previwe {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 400;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.image-previwe img {
  max-width: 80%;
  max-height: 80%;
  margin: auto;
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}

.close {
  position: absolute;
  top: 0;
  right: 10%;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
}

.close span {
  border: 1px solid white;
  border-radius: 50%;
  padding: 0.5rem;
  background-color: white;
  color: black;
}
</style>