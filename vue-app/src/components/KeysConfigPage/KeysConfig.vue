
<script lang="ts">
import { defineComponent } from 'vue';
import KeysConfigFacet from './KeysConfigFacet';
import Button from 'primevue/button';

export default defineComponent({
    components: {
        Button,
    },

    setup() {
        const keysConfigFacet = new KeysConfigFacet();
        return keysConfigFacet.setup();
    },

});

</script>

<template>
    <section class="black-bg-main-section">
        <div class="crypto-keys-config-section">
            <h1>
                Crypto Keys Configuration.
            </h1>
            <p>

            </p>
            <div v-if="!generated" class="row">
                <Button class="black btn" @click="onCreateKeys" v-if="!generated">
                    Create New Keys
                </Button>
                <Button class="black btn" @click="onUploadKeys" v-if="!generated">
                    upload Your Private Key
                </Button>
            </div>
            
            <div v-if="generated">
                private Key (Save it somewhere safe, you will not be able to see it again!)
                <textarea class="text-wrapper">
                    {{ privateKeyToExport }}
                </textarea>
                <Button class="black btn" @click="onCopyPrivateKey"> Copy Your Private Key</Button>
                <Button class="black btn" @click="onGoToChat"> Go To Chat </Button>
            </div>
        </div>
    </section>
</template>

<style>
.crypto-keys-config-section {
    background-color: rgb(14,16,15);
    color: white;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.black-bg-main-section {
    background-color: black;
    color: white;
    min-height: 100vh;
    position: fixed;
    width: 100%;
}

.btn {
    font-size: 15px !important;
    padding: 10px 10px !important;
    width: fit-content !important;
}

.text-wrapper {
    background-color: black;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    resize: none;
    height: 200px;
    margin: 20px;
}
</style>
