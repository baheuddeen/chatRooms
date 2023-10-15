<script lang="ts">
import { defineComponent } from 'vue';
import VoiceCallFacet from './VoiceCallFacet';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
    props:{
        activeConversationId: {
            type: Number,
        }
    },

    setup(props) {
        const voiceCallFacet = new VoiceCallFacet();
        SocketIoClient.subscribeVoiceCall({ voiceCall: voiceCallFacet, });

        return voiceCallFacet.setup(props);
    }
});
</script>


<template>
    <!-- this should render the voice call  as a dragable window and it should show the current connected people -->
    <button @click="onJoin" v-if="!inVoiceCall"> Join </button>
    <button @click="onLeave" v-if="inVoiceCall && activeVoiceCallId == activeConversationId"> Leave </button>
    <audio id="auido-stram" />
</template>