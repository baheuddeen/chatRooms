import { createWebHistory, createRouter } from "vue-router";
import signinSignup from "../components/SigninPage/_SigninSignupPage.vue";
import Chat from '../components/ChatPage/_ChatPage.vue';
const routes = [
	{
		path: "/",
		name: "Signin-signup",
		component: signinSignup,
	},
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  }
];

const router = createRouter({
  history: createWebHistory(),
	routes,
});


export default router;
