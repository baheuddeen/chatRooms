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
            Don't have a conversation yet .. Create a new one
        </h2>
        <form @submit.prevent="onSubmit" v-if="!inviteLink">
            <div>
                <label class="title" for="title">title </label>
                <input type="text" id="title" placeholder="conversation title" v-model="title">
                <label class="title" for="title">type </label>
                <select id="conversation-type" v-model="conversationType">
                    <option value="0">
                        Private
                    </option>
                    <option value="1">
                        Public
                    </option>
                </select>
            </div>
                
           
           
            <Button type="submit"> Create ! </Button>
        </form>
        <div v-else>
            <div>
                <a class="title" :href="inviteLink" > {{ inviteLink }}</a>
            </div>
            <Button @click="onCopy"> Copy Link </Button>
        </div>
       
    </div>
</template>

<style>
.create-conversation {
    text-align: center;
}
.title {
    padding-right: 5px;
    font-size: large;
    font-weight: 600;
    padding-left: 20px;
}
</style>