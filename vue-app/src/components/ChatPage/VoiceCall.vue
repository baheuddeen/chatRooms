<script lang="ts">
import { defineComponent } from 'vue';
import VoiceCallFacet from './VoiceCallFacet';

export default defineComponent({
    setup() {
        const voiceCallFacet = new VoiceCallFacet();
        return voiceCallFacet.setup();
    }
});
</script>


<template>
    <!-- this should render the voice call  as a dragable window and it should show the current connected people -->
    <div @click="onCall"> Call </div>
    <div @click="onAnswer"> answer </div>
    <audio id="auido-stram" />
</template>