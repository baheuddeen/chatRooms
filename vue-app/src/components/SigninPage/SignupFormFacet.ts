import { ref } from "vue";
import User, { UserType } from '../../models/User'
import Services from "../../utilites/Services";
import router from "../../route";


export default class SingupFormFacet {
	setup() {
        console.log("signup form mounted");
		const email = ref("");
		const password = ref("");
		const failedToSignup = ref(false);
		const userName = ref('');
		const error = ref('');
		const onsubmit = async (event: Event) => {
			event.preventDefault();
			console.log("onsubmit", event);
            try {
				const resp = await Services.signup({
					email: email.value.trim(),
					user_name: userName.value.trim(),
					password: password.value,
				});
				if(resp.status !== 200) {
					failedToSignup.value = true;
					error.value = await resp.text();
					return true;
				}
				const user = await resp.json() as UserType;
				User.setUser(user)
				router.push('/chat');
				return true;
			} catch (err) {
				console.log(err);
			}
			// router.push('/sidebar');
		};


		return {
			email,
			password,
            failedToSignup,
			userName,
			error,
			onsubmit,
		};
	}
}
