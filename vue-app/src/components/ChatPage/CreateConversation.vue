<script lang="ts">
import { defineComponent } from 'vue';
import CreateConversationFacet from './CreateConversationFacet';
import Button from 'primevue/button';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
    components: {
        Button
    },

    setup() {
        const createConversationFacet = new CreateConversationFacet();
        SocketIoClient.subcribeCreateConversationFacet({
            createConversationFacet,
        });
        return createConversationFacet.setup();
    }
})
</script>

<template>
    <div class="create-conversation">
        <h2>
            Don't have any chats <br /> 
            Create a new one
        </h2>
        <form @submit.prevent="onSubmit" v-if="!inviteLink">
            <div>
                <div class="input-item">
                    <label class="title" for="title">Title </label>
                    <input type="text" id="title" placeholder="Title" v-model="title">
                </div>
               <div class="input-item">
                <label class="title" for="title">Type </label>
                <select id="conversation-type" v-model="conversationType">
                    <option value="0">
                        Private
                    </option>
                    <option value="1">
                        Public
                    </option>
                </select>
               </div>
            </div>
                
           
           
            <Button type="submit" severity="contrast" class="larg"> Create ! </Button>
        </form>
        <div v-else>
            <textarea rows="8" cols="40" disabled class="invite-link">
               {{ inviteLink }}
            </textarea>
            <Button severity="contrast" class="larg" @click="onCopy"> Copy Link </Button>
        </div>
       
    </div>
</template>

<style>
.create-conversation {
    text-align: center;
}
.title {
    padding-right: 20px;
    font-size: 40px;
    font-weight: 600;
    padding-left: 20px;
}
.create-conversation h2{
    font-size: 80px;
    font-weight: 600;
    letter-spacing: 0px;
    line-height: 1;
    font-family: serif;
}
form {
    padding-top: 50px;
}
.input-item {
    padding-bottom: 10px;
    min-width: 75px;
}
input,
select {
    width: 200px;
    border: 1px solid #000;
    border-radius: 5px;
    margin-top: 10px;
    height: 3rem;
    font-size: larger !important;
    line-height: 2rem !important;
    padding: 8px;
}

/* wrap .invite-link in a div to make it a block element */
.invite-link {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0px;
  line-height: 1;
  font-family: serif;
  color: #fff;
  background: transparent;
  border-color: transparent;
  display: block;
  text-align: center;
  margin: auto;
  resize: none;
}

@media (max-width: 766px) {
    .create-conversation {
        margin-top: 120px;
    }
    
    .create-conversation h2 {
    font-size: 35px;
  }

  .title {
    font-size: 20px;
  }

  input,
    select {
        width: 150px;
    }
}
</style>