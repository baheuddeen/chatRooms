<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import voiceCall from './VoiceCall.vue';
import Avatar from 'primevue/avatar';

export default defineComponent({
    components: {
        voiceCall,
        Avatar,
    },

    props: {
        cashConversationParticipant: {
            type: () => null as any,
        },
        activeConversationId: {
            type: Number,
        },
        voiceChatParticipants: {
            type: () => null as any,
        },
    },

    setup(_props, {emit}) {
        console.log('miin');
        
        return {
        }
    }

})
</script>

<template>
     <div class="">
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
</template>

<style>
.conversation-participants {
  background-color: #0e100f;
  border: white;
  border: 1px solid #313131;
  border-radius: 7px;
}

.side-bar-title {
  font-size: 20px;
}

.user-participant {
  display: flex;
  padding: 5px;
}


.online{
  border: 2px solid green;
}
.offline{
  border: 2px solid red;
}
</style>