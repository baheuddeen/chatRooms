
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
        <section>
            <h1>
                Crypto Keys Configuration. 
            </h1>
            <h2>
                it should have more information about what we are doing here!
            </h2>
            <p>
                what is importatnt now you have two choices one is to create new Public and Private Keys Or To upload your Private Key
            </p>
            <Button @click="onCreateKeys" v-if="!generated">
                create New Keys
            </Button>
            <div v-if="generated">
                private Key
                <div>
                    {{ privateKeyToExport }}
                </div>
                <Button> Copy Your Private Key</Button>
            </div>
        </section>
</template>
