import { createWebHistory, createRouter } from "vue-router";
import signinSignup from "../components/SigninPage/_SigninSignupPage.vue";
import Chat from '../components/ChatPage/_ChatPage.vue';
import KeysConfig from '../components/KeysConfigPage/KeysConfig.vue';
import HomePage from '../components/Views/Home.vue';
import RedirectToHomePage from '../components/Views/RedirectToHomePage.vue';
import User from "../models/User";
// import RealTimeChat from '../components/views/RealTimeChat.vue';
// import VoiceNotes from '../components/views/VoiceNotes.vue';
// import GroupVoiceCall from '../components/views/GroupVoiceCall.vue';
// import Encryption from '../components/views/Encryption.vue';
const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    // component: Chat,
  },
  // {
  //   path: '/voice-notes',
  //   component: VoiceNotes,
  // },
  // {
  //   path: '/group-voice-call',
  //   component: GroupVoiceCall,
  // },
  // {
  //   path: '/end-to-end-encryption',
  //   component: Encryption,
  // },
	{
		path: "/sign-in",
		name: "Signin-signup",
		component: signinSignup,
	},
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: {
      requiresAuth: true 
    }
  },
  {
    path: "/keys-config",
    name: "keys",
    component: KeysConfig,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: RedirectToHomePage,
  }
];

const router = createRouter({
  history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
  to.matched.some((record) => {
    if (record.meta.requiresAuth) {
      if (!User.getLoggedInStatus()) {
        next({
          path: '/sign-in',
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
