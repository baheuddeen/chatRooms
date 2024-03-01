<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import PopupFacet from './popupFacet';
import Button from 'primevue/button';

export default defineComponent({
  components: {
    Button,
  },
  
  setup() {        
    const popupFacet = new PopupFacet();
    onMounted(() => {
      SocketIoClient.subscribePopupImage({
        popup: popupFacet,
      });
    });

    return popupFacet.setup();
  }
});
</script>

<template>
    <section>
        <div  :class="{'popup': true, 'd-none': !isPreview}">
            <img ref="popupImage">
            <div class="close" @click="onClose"><span class="pi pi-times"></span></div>
            <Button @click="onUploadImage" class="white-bg btn" v-if="showUpload"> Send </Button>
        </div>
    </section>
</template>

<style scoped>

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.8);
  display: block;
  z-index: 400;
}
.close {
  position: absolute;
  top: 0;
  right: 10%;
  cursor: pointer;
  color: #fff;
  font-size: 1.5rem;
}

.popup img{
  max-width: 80%;
  max-height: 80%;
  margin: 2.5% auto;
  display: block;
}

.btn {
  width: fit-content;
  padding: 0.5rem 1rem;
  display: block;
  margin: auto;
}

.white-bg {
  background-color: white;
  color: black;
  font-size: large;
}

@media (max-width: 768px) {
    .close{ 
      top: 10%;
    }

    .popup img{
        margin-top: 30%;
    }
}
</style>
