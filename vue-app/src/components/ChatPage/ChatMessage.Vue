<script lang="ts">

import { defineComponent } from 'vue';
import Fieldset  from 'primevue/Fieldset';
import ChatMessage from './ChatMessageFacet';

export default defineComponent({
  components: {
    Fieldset ,
  },

  props: {
    message: {
      type: Object as () => {
        body: string,
        sender_id: number,
      }
    }
  },

  setup(props) {
    const chatMessage = new ChatMessage();
    return chatMessage.setup(props);
  }

});
</script>

<template>
    <div v-if="sender_id ? true : false" :class="{
          'message-sender': isSender,
          'message-reciver': !isSender,
        }">
        <Fieldset  :legend="nickName">{{body}}</Fieldset >
    </div>
    <p v-else>{{body}}</p>

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
