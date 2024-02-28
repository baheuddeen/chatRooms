<script lang="ts">

import { defineComponent } from 'vue';
import Fieldset  from 'primevue/fieldset';
import ChatMessage from './ChatMessageFacet';
import audioPlayer from './voiceRecorder/components/player.vue'
import Avatar from 'primevue/avatar';
import ImageMessage from './ImageMessage.vue';

export default defineComponent({
  components: {
    Fieldset ,
    audioPlayer,
    Avatar,
    ImageMessage,
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
    <div v-if="sender_id" :class="{
          'message': true,
        }">
        <div :class="{
            'd-flex': true, 
            'message-sender': isSender,
            'message-reciver': !isSender,
          }">
          <Avatar image="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" :class="{
              'mr-2': true,
              }" shape="circle" />
          <div class="flex flex-column align message-right">
            <div class="sender-info">
              <span>{{nickName}}</span>
            <!-- <span>{{message.created}}</span> -->    
            </div>
            <div :class="{'message-wrapper': true, 'is-sender': isSender}">
              <div class="message-text" v-if="message.type == 0">
              {{decodedMessage}}
            </div >
            <div  v-if="message.type == 1">
              <audioPlayer 
              :is_encrypted="message.is_encrypted"
              :playerUniqId="message.filename.split('/').pop()"
              :src="'/private/_uid-' + conversation_id + '/' + message.filename"
              :iv="message.iv"
              :symmetricKey="message.symmetric_key"
              @stop-other-audios="onStopOtherAudios"
              />
            </div >
            <div  v-if="message.type == 2">
              <ImageMessage
                :is_encrypted="message.is_encrypted"
                :iv="message.iv"
                :symmetricKey="message.symmetric_key"
                :src="'/private/_uid-' + conversation_id + '/' + message.filename"
                />
            </div >
            </div>
          </div>
        </div>
    </div>
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

.sender-info {
  font-size: 17px;
  font-weight: 600;
  padding: 5px 6px;
}

.message-text {
  font-size: 15px;
  padding: 0px 7px;
  width: 100%;
}

.message-sender .message-right{
  align-items: end;
}

.message-sender .sender-info {
  width: fit-content;
  padding-right: 10px;
}

.message-sender {
  flex-direction: row-reverse;
}
.message {
  margin: 0px 10px;
  padding: 10px;
  width: 90%;
  word-wrap: break-word;
}
.message-right{
  width: 100%;
}

.message-wrapper {
  padding: 10px;
  border-radius: 10px;
  background-color: #161616;
  margin: 5px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 85%;
  word-wrap: break-word;
}

</style>
