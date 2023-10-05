
<script lang="ts">
import { defineComponent } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SigninForm from './SigninForm.vue';
import SignupForm from './SignupForm.vue';
import SigninSignupPageFacet from './_SigninSignupPageFacet';

export default defineComponent({
  components: {
    SigninForm,
    SignupForm,
    TabView,
    TabPanel,
  },
  

  setup() {
    const signinSignupPageFacet = new SigninSignupPageFacet();
    return signinSignupPageFacet.setup();
  },

});

</script>

<template>
    <div v-if="isLoading">Loading....</div>
    <TabView v-if="!isLoading && !showVerify" class="login-page">
        <TabPanel header="Log in">
            <SigninForm @my-event="getLoginStatus"></SigninForm>
        </TabPanel>
        <TabPanel header="Sign up">
            <SignupForm @signup-success="waitingForVerification"></SignupForm>
        </TabPanel>
    </TabView>
    <section v-if="showVerify">
      <div> this section will be replaced with verify email component!</div>
      <h1>
        Account Created Please verify your Email ..
      </h1>
    </section>
</template>

<style>
.login-page {
  max-width: 600px;
  margin: auto;
}
</style>