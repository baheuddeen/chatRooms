<script lang="ts">
import { defineComponent } from 'vue';
import Chat from './Chat.vue';
import Menu from './Menu.vue';

export default defineComponent({
  components: {
    Chat,
    Menu,
  },
  
  setup() {
    return {
    }
  }
});


</script>

<template>
  <Menu > </Menu>
  <Chat > </Chat>
</template>

<style scoped>
</style>
