
<script lang="ts">
import { defineComponent } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SigninForm from './SigninForm.vue';
import SignupForm from './SignupForm.vue';
import SigninSignupPageFacet from './_SigninSignupPageFacet';
import Button from 'primevue/button';

export default defineComponent({
  components: {
    SigninForm,
    SignupForm,
    TabView,
    TabPanel,
    Button,
  },
  

  setup() {
    const signinSignupPageFacet = new SigninSignupPageFacet();
    return signinSignupPageFacet.setup();
  },

});

</script>

<template>
  <div class="sign-in-page"></div>
    <div v-if="isLoading">Loading....</div>
    <TabView v-if="!isLoading && !showVerify" class="login-page">
        <TabPanel header="Log in">
            <SigninForm @my-event="getLoginStatus"></SigninForm>
        </TabPanel>
        <TabPanel header="Sign up">
            <SignupForm @signup-success="waitingForVerification"></SignupForm>
        </TabPanel>
    </TabView>
    <section v-if="showVerify" style="text-align: center; padding-top: 200px;">
      <h1>
        Please Enter Verification Code Sent To Your Email "<span class="email">{{ email }}</span>"
      </h1>
      <div class="verificationCode" ref="verificationCode">
        <input v-for="i of [...Array(6).keys()]" type="text" :index="i + 1" @keydown="moveFocus" @input="onPast"/>
      </div>
      <Button @click="verifyCode">Verify</Button>
      <Button @click="removeJWT" class="red">Change Email</Button>

    </section>
</template>

<style>
.login-page {
  max-width: 600px;
  margin: auto;
}
.email {
  color: black;
  font-family: Arial, sans-serif;
  font-size: 30px;
  font-weight: 500;
}

.red {
  background-color: red !important;
  color: white !important;
  border: none !important;
}

.verificationCode {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
}

.verificationCode input {
  font-size: 20px;
  text-align: center;
  width: 40px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>