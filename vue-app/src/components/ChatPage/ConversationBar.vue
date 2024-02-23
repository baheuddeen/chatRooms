<script lang="ts">
import { defineComponent } from 'vue';
import { Conversation } from '../../models/Types';
import Button from 'primevue/button';
import router from '../../route';

export default defineComponent({
    components: {
        Button,
    },

    props: {
        conversationLoaded: {
            type: Boolean
        }, 
        conversations: {
            type: () => null as Conversation[]
        },
    },

    emits: ["selectConversation"],


    setup(_props, {emit}) {
        const onSelectConversation = (e) => {
            emit("selectConversation", e)
        }
        const onEncryptionKeyConfigure = () => {
            router.push("/keys-config");
        }
        return {
            onSelectConversation,
            onEncryptionKeyConfigure,
        }
    }

})
</script>

<template>
    <section>
        <h2> Encryption Key</h2>
        <Button @click="onEncryptionKeyConfigure" class="black"> Configure </Button>
        <h2> Chats </h2>
        <div v-if="!conversationLoaded">
            loading...
        </div>
        <div v-if="conversationLoaded && conversations.length == 0">
            No Active conversation .. 
        </div>
        <div v-if="conversationLoaded && conversations.length != 0" v-for="conversation of conversations">
            <Button :data-conversation-id="conversation.id" @click="onSelectConversation" class="black"> {{  conversation.title  }}</Button>
        </div>
    </section>
</template>