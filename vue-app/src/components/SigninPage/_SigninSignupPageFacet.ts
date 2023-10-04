import { Ref, onMounted, ref } from "vue"
import Services from "../../utilites/Services";
import router from "../../route";
import User, { UserType } from "../../models/User";

export default class SigninSignupPageFacet {
  public readonly isLoading: Ref<boolean>;

  constructor() {
    this.isLoading = ref(true);
  }

  public async getLoginStatus () {
    try{
      const resp = await Services.getLoginStatus();
      this.isLoading.value = false;
      if (resp.status !== 200)
      {
        return;
      }
      const user = await resp.json() as UserType;
      console.log(user);
				User.setUser(user)
        router.push('/chat')
    } catch {
      // do something
    }
  }

  public setup() {
   onMounted(async () => {
    this.getLoginStatus();
   });

    return {
      isLoading: this.isLoading,
      getLoginStatus: this.getLoginStatus.bind(this),
    }
  }
}