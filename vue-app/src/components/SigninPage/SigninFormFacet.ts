import { ref } from "vue";
import Services from "../../utilites/Services";
import router from "../../route";
import User from "../../models/User";


export default class SigninForm {
	setup() {
		const email = ref("");
		const password = ref("");
		const failedToLogIn = ref(false);

		const onsubmit = (event: Event) => {
			event.preventDefault();
			console.log("onsubmit", event);
            // Services.authenticated({
            //     email: email.value, 
            //     password: password.value,
            // });
			// User.setUser(user)
			failedToLogIn.value = false;
			router.push('/sidebar')
			return true;
		};


		return {
			email,
			password,
            failedToLogIn,
			onsubmit,
		};
	}
}
