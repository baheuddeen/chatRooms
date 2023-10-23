<script lang="ts">

import { defineComponent } from 'vue';
import Fieldset  from 'primevue/fieldset';
import ChatMessage from './ChatMessageFacet';
import audioPlayer from './voiceRecorder/components/player.vue'

export default defineComponent({
  components: {
    Fieldset ,
    audioPlayer,
  },

  props: {
    message: {
      type: Object as () => {
        body: ArrayBuffer,
        sender_id: number,
        created: string,
        filename?: string,
        type?: number,
      }
    },
    conversation_id: {
      type: Number,
    }
  },

  setup(props, { emit }) {
    const chatMessage = new ChatMessage();
    return chatMessage.setup(props, emit);
  }

});
</script>

<template>
    <div v-if="sender_id ? true : false" :class="{
          'message-sender': isSender,
          'message-reciver': !isSender,
        }">
        <Fieldset  :legend="nickName"  v-if="message.type == 0">
          {{decodedMessage}}
        </Fieldset >
        <Fieldset  :legend="nickName"  v-if="message.type == 1">
          <audioPlayer 
           :playerUniqId="message.filename.split('/').pop()"
           :src="'/private/_uid-' + conversation_id + '/' + message.filename"
           @stop-other-audios="onStopOtherAudios"
           />
        </Fieldset >

    </div>
    <p v-else>{{decodedMessage}}</p>

</template>

<style scoped>
.message-input {
  display: flex;
}
.text-input{
  width: 70%;
}

.submit-input {
width: 25%;
text-align: center;
}
input {
  width: 80%;
  margin: 5px;
}
</style>
