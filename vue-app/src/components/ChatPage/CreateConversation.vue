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
        <form @submit.prevent="onSubmit">
            <div>
                <label class="title" for="title">title </label>
                <input type="text" id="title" placeholder="conversation title" v-model="title">
            </div>
           
            <Button type="submit"> Create ! </Button>
        </form>

        <a class="title" :href="inviteLink" v-if="inviteLink"> {{ inviteLink }}</a>
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
}
</style>