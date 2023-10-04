
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
    <TabView v-else class="login-page">
        <TabPanel header="Log in">
            <SigninForm @my-event="getLoginStatus"></SigninForm>
        </TabPanel>
        <TabPanel header="Sign up">
            <SignupForm @my-event="getLoginStatus"></SignupForm>
        </TabPanel>
    </TabView>
</template>

<style>
.login-page {
  max-width: 600px;
  margin: auto;
}
</style>