<script lang="ts">
import { defineComponent } from 'vue';
import HeroSection from './HeroSection.vue';
import Homefacet from './HomeFacet';

export default defineComponent({
  components: {
    HeroSection,
  },
  setup() {
    const homefacet = new Homefacet()
    return homefacet.setup();
  }
})
</script>

<template>
  <div class="home">
    <nav class="navbar navbar-dark  flex-column flex-md-row bd-navbar">
      <a class="navbar-brand" href="/">
        <img :src="'/app_logo.svg'" width="30" height="30" class="d-inline-block align-top" alt="" />
        WeeWhisper
      </a>
    </nav>
    <div class="container">
      <div ref="title" class="title"><span class="content d-none">Wee Whisper</span></div>
    </div>
    <div class="container">
      <HeroSection />
    </div>
    <div class="container">

    <div class="why-wee px-4 d-flex" style="text-align: left;">
      <h1>Why WeeWhisper</h1>
      <div class="p-4 enc-img">
      <img :src="'/encryption-icon.svg'" alt="end-to-end-encryption" class="card-image shadow-2" />
    </div>
    </div>
    <div class="container text-left py-2 px-3 flex row">
    
    <div class="enc-text col-12 col-m-8 p-4">
      <p>What truly sets our app apart and makes it unique is its unwavering commitment to real end-to-end encryption.
        We go the extra mile to ensure that every aspect of your communication, from text and voice notes to video
        calls, is comprehensively protected. This dedication to providing a genuine end-to-end encryption experience
        distinguishes our app as a secure and private platform where users can freely and confidently engage in
        conversations, knowing that their data remains shielded from prying eyes.</p>
      <p>Furthermore, we extend our security measures to include the encryption of voice notes even on our servers. This
        additional layer of protection ensures that your voice messages are not only safeguarded during transmission but
        also remain encrypted when stored on our servers, providing you with a complete end-to-end encryption solution
        that prioritizes your privacy and security throughout the entire communication process. Your privacy and
        security are our top priorities, and our robust encryption practices reflect our unwavering commitment to
        providing you with a truly secure communication environment.</p>
    </div>
    </div>
    </div>

  <div class="get-started-container">
    <router-link to="/sign-in" class="get-started-button">
      Get Started
    </router-link>
  </div>
</div></template>

<style scoped>.m-w-500 {
  max-width: 500px;
}

.enc-img img{
  text-align: center;
  width: 50px;
  display: block;
  height: 100%;
}

.why-wee h1{
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 0px;
  line-height: 2;
}
.home {
  display: flex;
  flex-direction: column;
  background: rgb(14, 16, 15);
  color: rgb(255, 252, 225);
  height: 100%;
  min-height: 100vh;
}

.navbar {
  position: fixed;
  background: rgb(14, 16, 15);
  width: 100%;
  z-index: 2;
  padding: 15px 30px;
}

.title {
  font-size: max(5.125rem, min(13.3333vw + 2rem, 18rem));
  font-weight: 600;
  letter-spacing: 0px;
  line-height: .9;
  margin-top: 60px;
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

.navbar-brand {
  margin: auto;
}

@media (max-width: 766px) {
  .enc-img img {
    width: 35px;
  }

  .why-wee h1{
    font-size: 35px;
  }

  .title {
    font-size: 60px;
  }

  .card-text {
    font-size: 50px;
  }
}
</style>