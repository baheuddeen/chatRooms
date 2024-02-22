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
      <ConversationSideBar 
      @selectConversation="onSelectConversation"
      :conversations="conversations"
      :conversationLoaded="conversationLoaded && messagesLoaded"
      />
      <section class="chat col-12 col-lg-9 row" v-if="activeConversationId">
        <div class=" col-12 col-lg-9 messages-wrapper" >
          <div class="messages">
            <div  v-for="message of messages" >
              <ChatMessage @stop-other-audios="onStopOtherAudios" :key="message.created + '_' + message.sender_id" :message="message" :conversation_id="activeConversationId"> </ChatMessage>
            </div>
          </div>
          <div class="message-input-wrapper">
            <form @submit.prevent="onsubmit">
              <div class="message-input d-flex">
                <textarea  type="text" class="text-input" :rows="rows" ref="messageInput" v-model="message" placeholder="Type your message.."  @keyup="onKeydown($event)" />
                <div v-if="message"  @click="onsubmit" class="submit-input ar"><svg width="35" height="35" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
                <recorder v-else
                  :activeConversationId = "activeConversationId"
                  upload-url="YOUR_API_URL"
                  :time="2"
                  :sampleRate="sampleRate" 
                  @stop-other-audios="onStopOtherAudios"
                />  
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-3 conversation-participants">
          <div>
            <div class="side-bar-title">
              <b>Participants</b>
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
        <div class="side-bar-title">
          <b>
            In Voice Chat.
          </b>
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
    <section class="no-chat col-10 col-lg-9" v-else="!activeConversationId">
       <CreateConversation />
    </section>
    </div> 

  </div>

</template>

<style scoped>
.chat {
  margin-left: auto;
  margin-right: auto;
  height: fit-content;
  background: black;
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
  margin-left: auto;
  margin-right: auto;
}

.user-participant {
  display: flex;
  padding: 5px;
}

.messages-wrapper {
  padding: 10px 40px;
}

.text-input{
  text-wrap: wrap;
  overflow: hidden;
  width: 100%;
  min-height: 2.5rem;
  height: 32px;
  padding: 5px;
  resize: none;
  background-color: transparent;
  border: transparent;
  color: white;
}

.text-input:focus-visible {
  outline: none;
}

.messages{
  width: 100%;
  height: 82vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.message-input-wrapper {
  padding: 10px;
  background-color: #0e100f;
  border: 1px solid #313131;
  border-radius: 7px;
  margin-top: 40px;
  position: fixed;
  width: 50%;
  bottom: 20px;
}
.submit-input {
  border-radius: 13px;
  padding: 4px 5px;
  background: #171717e5;;
  color: white;
  height: 35px;
  width: 35px;
}
input {
  width: 80%;
  margin: 5px;
}



.chat-container {
  height: 100vh;
  padding-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background-color: black;
  color: white;
}

.connect-status {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
  padding: 10px;
  z-index: 300;
}

.conversation-participants {
  background-color: #0e100f;
  border: white;
  border: 1px solid #313131;
  border-radius: 7px;
}

.side-bar-title {
  font-size: 20px;
}

form {
  padding-top: 0px !important;
}
@media (max-width: 768px) {
  .message-input-wrapper {
    width: 85%;
    left: 7%;
  }

  .messages{
    height: 85vh;
  }

  .conversation-participants{
    display: none;
  }

  .messages-wrapper {
    padding: 10px 0px;
  }
}
</style>
