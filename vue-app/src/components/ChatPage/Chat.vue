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
import Avatar from 'primevue/avatar';
import CreateConversation from './CreateConversation.vue';
import ConversationSideBar from './ConversationSideBar.vue';

export default defineComponent({
  components: {
    Panel,
    Button,
    InputText,
    Message,
    ChatMessage,
    recorder,
    VoiceCall,
    Avatar,
    CreateConversation,
    ConversationSideBar,
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
      <section class="chat col-12 col-lg-10 row" v-if="activeConversationId">
        <div class=" col-12 col-lg-10" >
          <Panel header="Messages" class="messages">
        <div  v-for="message of messages" >
          <ChatMessage @stop-other-audios="onStopOtherAudios" :key="message.created + '_' + message.sender_id" :message="message" :conversation_id="activeConversationId"> </ChatMessage>
        </div>
      </Panel>
      <form @submit.prevent="onsubmit">
        <div class="message-input">
          <textarea  type="text" class="text-input" :rows="rows" ref="messageInput" v-model="message" placeholder="Type your message.."  @keydown="onKeydown($event)" />
          <div class=" submit-input"><span  class="pi pi-chevron-right" @click="onsubmit"></span></div>
        </div>
      </form>
      <recorder
        :activeConversationId = "activeConversationId"
        upload-url="YOUR_API_URL"
        :time="2"
        :sampleRate="sampleRate" 
        @stop-other-audios="onStopOtherAudios"
      />  
        </div>

        <div class="col-lg-2">
          <div>
            <div>
              <b>Conversation Participants</b>
            </div>
          <div v-for="user of cashConversationParticipant[activeConversationId]">
            <div class="user-participant">
              <Avatar image="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" :class="{
                'mr-2': true,
                'online': user.status == 'online',
                'offline': user.status == 'offline',
                }" shape="circle" />
              <div class="flex flex-column align">
                  <span class="font-bold">{{ user.user_name }}</span>
                  <span class="text-sm" :key="user.email + user.status">{{ user.status == 'online' ? 'online' : 'offline' }}</span>

              </div>
            </div>
           
          </div>
          </div>
        <div>
          <h3>
            In Voice Chat.
          </h3>
          <div v-for="user of voiceChatParticipants">
            <div class="user-participant">
              <Avatar image="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" class="mr-2" shape="circle" />
              <div class="flex flex-column align">
                  <span class="font-bold">{{ user.user_name }}</span>
              </div>
            </div>
          </div>
        </div>
        <voiceCall :activeConversationId="activeConversationId" />
      </div>
  
    </section>
    <section class="no-chat col-10 col-lg-10" v-else="!activeConversationId">
       <CreateConversation />
    </section>
    <ConversationSideBar 
      @selectConversation="onSelectConversation"
      :conversations="conversations"
      :conversationLoaded="conversationLoaded && messagesLoaded"
      />
    </div> 

  </div>

</template>

<style scoped>
.chat {
  height: 100%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
}
.chat .p-panel-content,
.chat [role="region"] {
  height: 100%;
}

.online{
  border: 2px solid green;
}
.offline{
  border: 2px solid red;
}

.no-chat {
  height: fit-content;
  margin: auto;
}

.user-participant {
  display: flex;
  padding: 5px;
}

.text-input{
  text-wrap: wrap;
  overflow: hidden;
  width: 100%;
  min-height: 2.5rem;
  height: 32px;
  padding: 5px;
}

.messages{
  width: 100%;
  height: 85vh;
  overflow-y: scroll;
}
.submit-input {
  border: solid 2px #e4ded2;
  border-radius: 13px;
  padding: 5px;
  background: #108000;
  color: white;
}
input {
  width: 80%;
  margin: 5px;
}
</style>
