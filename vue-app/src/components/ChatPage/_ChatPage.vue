<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import Chat from './Chat.vue';
import NavBar from '../NavBar.vue';
import popup from './popup.vue';

export default defineComponent({
  components: {
    Chat,
    NavBar,
    popup,
},
  
  setup() {        
    return {
    }
  }
});


</script>

<template>
  <NavBar></NavBar>
  <Chat > </Chat>
  <popup />
</template>

<style scoped>
</style>
