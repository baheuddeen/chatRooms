<script lang="ts">

import { defineComponent, Ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Message from 'primevue/message';
import SearchBarFacet from './ChatFacet';
import ChatMessage from './ChatMessage.vue';


export default defineComponent({
  components: {
    Panel,
    Button,
    InputText,
    Message,
    ChatMessage,
  },

  props: {
    compare: {
      type: Object as () => {
        isComparing: boolean,
      }
    }
  },

  emits: ['setComparing'],

  setup(props, { emit }) {    
    const searchBarFacet = new SearchBarFacet();
    return searchBarFacet.setup(props, emit);
  }
});
</script>

<template>
  <Message severity="error" v-if="!state.connected">Can't connect to server</Message>
  <section class="chat col-10">
    <Panel header="Messages" class="messages">
      <ChatMessage v-for="message of messages" :key="message.created + '_' + message.sender_id" :message="message"> </ChatMessage>
    </Panel>
    <form @submit.prevent="onsubmit">
      <div class="message-input">
        <InputText class="text-input" v-model="message" placeholder="Type your message.." @keydown="onKeydown($event)"> </InputText>
        <Button class="submit-input" type="submit">Send</Button>
      </div>
    </form>
    
  </section>
  <section class="col-2">
    <div v-for="conversation of conversations">
        <button :data-conversation-id="conversation.id" @click="onSelectConversation"> {{  conversation.title  }}</button>
    </div>
  </section>
</template>

<style scoped>
.chat {
  position: fixed;
  right: 0px;
}
.message-input {
  display: flex;
}
.text-input{
  width: 70%;
}

.messages{
  width: 100%;
  height: 75vh;
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
