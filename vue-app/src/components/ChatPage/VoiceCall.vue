<script lang="ts">
import { defineComponent } from 'vue';
import VoiceCallFacet from './VoiceCallFacet';
import SocketIoClient from '../../utilites/SocketIoClient';
import Button from 'primevue/button';

export default defineComponent({
    props:{
        activeConversationId: {
            type: Number,
        }
    },

    components: {
        Button,
    },

    setup(props) {
        if(!SocketIoClient.voiceCall) {
            const voiceCallFacet = new VoiceCallFacet();
            SocketIoClient.subscribeVoiceCall({ voiceCall: voiceCallFacet, });
        }
        return SocketIoClient.voiceCall.setup(props);
    }
});
</script>


<template>
    test ! {{ inVoiceCall }}
    <!-- this should render the voice call  as a dragable window and it should show the current connected people -->
    <Button @click="onJoin" v-if="!inVoiceCall" severity="contrast"> Join </button>
    <Button @click="onLeave" v-if="inVoiceCall && activeVoiceCallId == activeConversationId" severity="contrast"> Leave </Button>
    <audio id="auido-stram" />
</template>