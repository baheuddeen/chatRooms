<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import router from '../route';
import SocketIoClient from '../utilites/SocketIoClient';

export default defineComponent({
  components: {
  },
  
  setup() {     
    const goToChat = () => {
      console.log('goToChat');
      SocketIoClient.chat.activeConversationId.value = null;
      router.push('/chat');
    }   
    return {
      goToChat,
    }
  }
});
</script>

<template>
    <nav class="navbar navbar-dark  flex-column flex-md-row bd-navbar">
        <div class="navbar-brand" @click="goToChat">
            <img :src="'/app_logo.svg'" width="30" height="30" class="d-inline-block align-top" alt="" />
            WeeWhisper
        </div>
    </nav>
</template>

<style scoped>

.navbar-dark {
    z-index: 100;
    background-color: black;
    position: fixed;
    width: 75%;
    top: 0;
    right: 0px;
}


.navbar-brand {
  padding-top: 10px;
  margin: auto;
}

@media (max-width: 768px){
  .navbar-dark {
    width: 100%;
}
 
}

</style>