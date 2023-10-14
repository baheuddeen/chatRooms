<script lang="ts">

import { defineComponent, Ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Message from 'primevue/message';
import ChatFacet from './ChatFacet';
import ChatMessage from './ChatMessage.vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import recorder from './voiceRecorder/components/recorder.vue';
import VoiceCall from './VoiceCall.vue';

export default defineComponent({
  components: {
    Panel,
    Button,
    InputText,
    Message,
    ChatMessage,
    recorder,
    VoiceCall,
},

  props: {
    socketIoClient: {
      type: SocketIoClient,
    },
  },

  setup() {    
    const chatFacet = new ChatFacet();
    SocketIoClient.subscribeChat({
      chat: chatFacet,
    });

    return chatFacet.setup();
  }
});
</script>

<template>
  <div v-if="otherDeviceIsLoggedIn">
    <h1>
      Other Device is logged in
    </h1>
    <h2>
      To do Add information about the current connection
      and add a way to report if it is not you! 
    </h2>
  </div>
  <div v-else>
    <span class="connect-status" v-if="!state.connected">Trying to connect to sever .... </span>
    <div class="row chat-container">
      <section class="chat col-8" v-if="activeConversationId">
      <Panel header="Messages" class="messages">
        <div  v-for="message of messages" >
          <ChatMessage @stop-other-audios="onStopOtherAudios" :key="message.created + '_' + message.sender_id" :message="message" :conversation_id="activeConversationId"> </ChatMessage>
        </div>
      </Panel>
      <form @submit.prevent="onsubmit">
        <div class="message-input">
          <textarea  type="text" class="text-input" :rows="rows" ref="messageInput" v-model="message" placeholder="Type your message.."  @keydown="onKeydown($event)" />
          <Button class="submit-input" type="submit">Send</Button>
        </div>
      </form>
      <recorder
        :activeConversationId = "activeConversationId"
        upload-url="YOUR_API_URL"
        :time="2"
        :sampleRate="sampleRate" 
        @stop-other-audios="onStopOtherAudios"
      />    
      <voiceCall :activeConversationId="activeConversationId" />
    </section>
    <section class="no-chat col-8" v-else>
      <h2>
        please join a conversation first.
      </h2>
    </section>
    <section class="col-4">
      <h3>
        convserations
      </h3>
      <div v-if="!conversationLoaded">
        loading...
      </div>
      <div v-if="conversationLoaded && conversations.length == 0">
        No Active conversation .. 
      </div>
      <div v-for="conversation of conversations">
          <Button :data-conversation-id="conversation.id" @click="onSelectConversation"> {{  conversation.title  }}</Button>
      </div>
    </section>
    </div> 

  </div>

</template>

<style scoped>
.chat-container {
  flex-direction: row-reverse;
  height: 80vh;
}
.chat {
  height: 100%;
}
.chat .p-panel-content,
.chat [role="region"] {
  height: 100%;
}

.no-chat {
  height: fit-content;
  margin: auto;
}

.text-input{
  width: 70%;
  text-wrap: wrap;
  overflow: hidden;
}

.messages{
  width: 100%;
  height: 70vh;
  overflow-y: scroll;
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
