<script lang="ts">
import { defineComponent } from 'vue';
import router from '../../route';
export default defineComponent({
  setup() {
    router.push('/');
    return {
    }
  }
});    
</script>

<template>
    <div>
        <h1>Redirecting to home page...</h1>
    </div>
</template>