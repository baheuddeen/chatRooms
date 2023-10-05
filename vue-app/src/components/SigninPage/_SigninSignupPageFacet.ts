import { Ref, onMounted, ref } from "vue"
import Services from "../../utilites/Services";
import router from "../../route";
import User, { UserType } from "../../models/User";

export default class SigninSignupPageFacet {
  public readonly isLoading: Ref<boolean>;
  public readonly showVerify: Ref<boolean>;

  constructor() {
    this.isLoading = ref(true);
    this.showVerify = ref(false);
  }

  public async getLoginStatus () {
    try{
      const resp = await Services.getLoginStatus();
      if (resp.status !== 200)
      {
        this.isLoading.value = false;
        return;
      }
      const user = await resp.json() as UserType;
      console.log(user);
				User.setUser(user);
        if (user.verified != 0) {
          router.push('/chat')          
        } else {
          this.isLoading.value = false;
          this.showVerify.value = true;
        }
    } catch {
      // do something
    }
  }

  public waitingForVerification() {
    this.showVerify.value = true;
  }

  public setup() {
   onMounted(async () => {
    this.getLoginStatus();
   });

    return {
      isLoading: this.isLoading,
      showVerify: this.showVerify,
      getLoginStatus: this.getLoginStatus.bind(this),
      waitingForVerification: this.waitingForVerification.bind(this),
    }
  }
}