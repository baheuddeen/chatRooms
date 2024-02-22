

<script lang="ts">
  import { Ref, defineComponent, ref, watch } from 'vue';
  import IconButton from './icon-button.vue'
import SocketIoClient from '../../../../utilites/SocketIoClient';
import Encryption from '../../../../utilites/Encryption';

  export default defineComponent({
    components: {
      IconButton
    },

    props: {
      record: { type: Object },
      filename: {type: String},
      headers: {type: Object},
      activeConversationId: {type: Object},
    },

    emits:['start-upload', 'end-upload', 'reset-record'],

    setup(props, { emit }) {
      
      const sendingBinaryData = ref(false);
      const encryptedBlob: Ref<Blob> = ref(null);
  
      SocketIoClient.subscribeUpload({
        sendingBinaryData,
      });



      watch(sendingBinaryData, () => {
        if (!sendingBinaryData.value) {
          return;
        }
        const file = encryptedBlob.value;
        const chunkSize = 700000;
        let num = 0;

        for (let start = 0; start < file.size; start += chunkSize) {
          const chunk = file.slice(start, start + chunkSize + 1);
          SocketIoClient.sendVoiceMessage( {
            blob: chunk,
            num: num++,
          } );          
        }
        sendingBinaryData.value = false;
        emit('reset-record');
      })

      const upload = async () => {
        if (!props.record.url) {
          return
        }

        emit('start-upload');
        const encrypted = await Encryption.encryptBinaryData(await (props.record.blob as Blob).arrayBuffer());
        encryptedBlob.value = new Blob([encrypted.encryptedData], { type: "audio/ogg; codecs=opus" });
        const chunkSize = 700000;
        const length = Math.floor(encryptedBlob.value.size / chunkSize);
        
        SocketIoClient.prepareVoiceMessage( {
          filename: props.filename.split('/').pop(),
          length,
          binary: true,
          conversation_id: props.activeConversationId,
          iv: encrypted.iv,
          symmetric_key: encrypted.key,
        } );          
         
      }

        return {
          upload,
        }
    }

  });
</script>

<template>
  <button class="send-button btn btn-success" @click.native="upload"> Send </button>
</template>

<style lang="scss">
  .send-button.btn-success {
    position: absolute;
    top: -63px;
    font-size: medium;
    height: fit-content;
    width: fit-content;
  }

  .ar__uploader {
    background: white !important;
    color: black !important;
  }
  @import '../scss/icons';
</style>

