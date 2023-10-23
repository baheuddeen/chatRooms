import { ref } from "vue";
import User, { UserType } from '../../models/User'
import Services from "../../utilites/Services";
import router from "../../route";
import Encryption from "../../utilites/Encryption";


export default class SingupFormFacet {
	setup(emit: any) {
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
				await Encryption.getCryptoKeyPair();
				const resp = await Services.signup({
					email: email.value.trim(),
					user_name: userName.value.trim(),
					password: password.value,
					public_key: Encryption.exportedKeyText,
				});
				if(resp.status !== 200) {
					failedToSignup.value = true;
					error.value = await resp.text();
					return true;
				}
				emit('signup-success');
				return true;
			} catch (err) {
				console.log(err);
			}
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
