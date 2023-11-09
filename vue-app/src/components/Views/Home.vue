<script lang="ts">
import { defineComponent } from 'vue';
import Carousel from './Carousel.vue';

export default defineComponent({
  components: {
    Carousel,
  }
})
</script>

<template>
  <div class="home">
    <div class="header">
      <h1 class="title">Mini Chat App</h1>
    </div>
    <div class="container">
      <Carousel />

    </div>
    <div style="text-align: center;">
        <h1>What make this Chat App Unique !?</h1>
    </div>
    <div class="container text-left py-5 px-3 flex row">
            <div class="col-12 col-m-4 p-4 enc-img">
                <img :src="'/assets/encryption-icon.png'" alt="end-to-end-encryption" class="card-image shadow-2" />
            </div>
            <div class="enc-text col-12 col-m-8 p-4">
                <p>What truly sets our app apart and makes it unique is its unwavering commitment to real end-to-end encryption. We go the extra mile to ensure that every aspect of your communication, from text and voice notes to video calls, is comprehensively protected. This dedication to providing a genuine end-to-end encryption experience distinguishes our app as a secure and private platform where users can freely and confidently engage in conversations, knowing that their data remains shielded from prying eyes.</p>
                <p>Furthermore, we extend our security measures to include the encryption of voice notes even on our servers. This additional layer of protection ensures that your voice messages are not only safeguarded during transmission but also remain encrypted when stored on our servers, providing you with a complete end-to-end encryption solution that prioritizes your privacy and security throughout the entire communication process. Your privacy and security are our top priorities, and our robust encryption practices reflect our unwavering commitment to providing you with a truly secure communication environment.</p>
            </div>
    </div>
    
    <div class="get-started-container">
      <router-link to="/sign-in" class="get-started-button">
          Get Started
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.m-w-500 {
  max-width: 500px;
}

.enc-img {
  text-align: center;
}
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg,#68ff0063,#00aaff);
  color: #000;
  height: 100%;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 36px;
  margin: 10px 0;
}

.subtitle {
  font-size: 18px;
  margin: 10px 0;
  padding: 0px 50px;
  max-width: 600px;
  text-align: left;
}

.features-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.feature-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 20px;
  margin: 10px;
  font-size: large;
  height: 100%
}

.icon {
  max-width: 100px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.router-link-exact-active {
text-decoration: none;
color: #000;
}

.get-started-container {
display: flex;
justify-content: center;
align-items: center;
margin: 80px 0;
}

.get-started-button {
background-color: #000;
color: #fff;
padding: 15px 30px;
border: none;
border-radius: 5px;
font-size: 18px;
text-align: center;
cursor: pointer;
transition: background-color 0.2s, transform 0.2s;
text-decoration: none !important;
}

.get-started-button:hover {
background-color: #0056b3;
transform: scale(1.05);
}

.enc-text {
  font-size: larger;
}

</style>
