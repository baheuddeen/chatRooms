import { ref } from "vue";
import Services from "../../utilites/Services";
import router from "../../route";
import User from "../../models/User";


export default class SigninForm {
	setup(emit: any) {
		const email = ref("");
		const errorMessage = ref("");
		const password = ref("");
		const failedToLogIn = ref(false);

		const onsubmit = async (event: Event) => {
			event.preventDefault();
            const resp = await Services.login({
                email: email.value.trim().toLowerCase(), 
                password: password.value,
            });

			if (resp.status != 200) {
				errorMessage.value = (await resp.json()).msg;
				failedToLogIn.value = true;
			} else {
				
				emit('my-event');
				return true;			
			}
		};


		return {
			email,
			password,
            failedToLogIn,
			errorMessage,
			onsubmit,
		};
	}
}
