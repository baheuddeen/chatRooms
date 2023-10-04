
<script lang="ts">
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import SigninForm from './SigninFormFacet';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default defineComponent({

  components: {
    InputText,
    Button,
    TabView,
    TabPanel,
  },

  emits: ['my-event'],

  setup(_props, { emit }) {
    const signinForm = new SigninForm();
    return signinForm.setup(emit);
  },

});

</script>

<template>
      <form @submit.prevent="onsubmit">
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputText name="email" :value="email" @input="email = ($event.target as HTMLInputElement).value" required
            class="p-inputtext-sm" placeholder="username" />
        </div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-key"></i>
          </span>
          <InputText type="password" name="password" :value="password" class="p-inputtext-sm" placeholder="password"
            @input="password = ($event.target as HTMLInputElement).value" required />
        </div>
        <Button type="submit">Login</Button>
      </form>

      <span>
        <small v-if="failedToLogIn" class="p-error" id="text-error">{{ errorMessage }}</small>
      </span>
</template>

<style>

</style>