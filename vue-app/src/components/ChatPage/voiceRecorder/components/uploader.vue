

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import IconButton from './icon-button.vue'
import SocketIoClient from '../../../../utilites/SocketIoClient';

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

    emits:['start-upload', 'end-upload'],

    setup(props, { emit }) {
      
      const sendingBinaryData = ref(false);
      SocketIoClient.subscribeUpload({
        sendingBinaryData,
      });



      watch(sendingBinaryData, () => {
        if (!sendingBinaryData.value) {
          return;
        }
        const file = props.record.blob;
        const chunkSize = 700000;
        let num = 0;

        for (let start = 0; start < file.size; start += chunkSize) {
          const chunk = file.slice(start, start + chunkSize + 1);
          console.log(chunk);
          SocketIoClient.sendVoiceMessage( {
            blob: chunk,
            num: num++,
          } );          
        }
        sendingBinaryData.value = false;
      })

      const upload = () => {
        if (!props.record.url) {
          return
        }

        emit('start-upload');

        // const data = new FormData()
        // data.append('audio', props.record.blob, `${props.filename}.mp3`);
        const file = props.record.blob as Blob;
        const chunkSize = 700000;
        const length = Math.floor(file.size / chunkSize);
        console.log(length);
        
        SocketIoClient.prepareVoiceMessage( {
          filename: props.filename.split('/').pop(),
          length,
          binary: true,
          conversation_id: props.activeConversationId,
        } );          
         
      //   const timeout = 20;
      //   let counter = 0;
      //   reader.read().then( function readStramBlob (chunk) {
      //     counter++;
      //     if(counter > 20) {
      //       return
      //     }
      //     console.log(chunk);
      //     // SocketIoClient.sendVoiceMessage( chunk.value);
      //     if (chunk.done) {
      //       return;
      //     }
      //     return reader.read().then(readStramBlob(chunk));
      // });
        // SocketIoClient.sendVoiceMessage( props.record.blob);

        // const headers = Object.assign(props.headers, {})
        // @ts-ignore.
        // headers['Content-Type'] = `multipart/form-data; boundary=${data._boundary}`

        // emit('end-upload', { status: 'success', response: resp }
        // 'end-upload', { status: 'fail', response: error }
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
  @import '../scss/icons';
</style>

