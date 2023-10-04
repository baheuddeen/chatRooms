
<script lang="ts">
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import SignupForm from './SignupFormFacet';
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

  setup() {
    const signupForm = new SignupForm();
    return signupForm.setup();
  },

});

</script>

<template>
    <TabPanel header="Sign up">
      <form @submit.prevent="onsubmit">
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputText name="email" :value="email" @input="email = ($event.target as HTMLInputElement).value" required
          class="p-inputtext-sm" placeholder="email" />
        </div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputText name="userName" :value="userName" @input="userName = ($event.target as HTMLInputElement).value" required
          class="p-inputtext-sm" placeholder="username" />
        </div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-key"></i>
          </span>
          <InputText type="password" name="password" :value="password" class="p-inputtext-sm" placeholder="password"
            @input="password = ($event.target as HTMLInputElement).value" required />
        </div>
        <Button type="submit">Sign up</Button>
      </form>

      <span>
        <small v-if="failedToSignup" class="p-error" id="text-error">{{error}}</small>
      </span>
    </TabPanel>
</template>

<style>

</style>