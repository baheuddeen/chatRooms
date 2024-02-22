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
				const keys = await Encryption.generateKeyPair();
				const resp = await Services.signup({
					email: email.value.trim().toLowerCase(),
					user_name: userName.value.trim(),
					password: password.value,
					public_key: await Encryption.exportKey(keys.publicKey),
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
