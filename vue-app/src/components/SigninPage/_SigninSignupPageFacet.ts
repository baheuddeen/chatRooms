import { Ref, onMounted, ref } from "vue"
import Services from "../../utilites/Services";
import router from "../../route";
import User, { UserType } from "../../models/User";
import Encryption from "../../utilites/Encryption";

export default class SigninSignupPageFacet {
  public readonly isLoading: Ref<boolean>;
  public readonly showVerify: Ref<boolean>;
  public controlIsPressed: boolean = false;
  public verificationCode: Ref<HTMLElement>;
  public email: Ref<string>;

  constructor() {
    this.isLoading = ref(true);
    this.showVerify = ref(false);
    this.email = ref('');
    this.verificationCode = ref(null);
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
				User.setUser(user);
        this.email.value = user.email;
        if (user.verified != 0) {
          const keys = await Encryption.getCryptoKeyPair();
          if (!keys) {
            router.push('/keys-config')          
          } else {
            router.push('/chat')          
          }
        } else {
          this.isLoading.value = false;
          this.showVerify.value = true;
        }
    } catch(err) {
      console.log(err);
      
      // TODO FIX IT!
      router.push('/keys-config') 
    }
  }

  public async waitingForVerification() {
    await this.getLoginStatus();
    this.showVerify.value = true;
  }

  public onPast(e: InputEvent) {
    const target = (e.target as HTMLInputElement);
    const current = parseInt(target.getAttribute('index'), 10);
    const pastValue = target.value;
    console.log('pasting', pastValue);
    pastValue.split('').forEach((char, index) => {
      if (index + current > 6) return;
      const currentTarget = (document.querySelector(`[index="${(index + current)}"]`) as HTMLInputElement);
      currentTarget.focus();
      currentTarget.value = char;
    });
    target.setAttribute('maxlength', '1');
  }

  public async verifyCode() {
    let verificationCode = '';
    let notValid = false;
    this.verificationCode.value.querySelectorAll('input').forEach((input) => {
      if(!input.value) {
        input.focus();
        input.classList.add('error');
        notValid = true;
      };
      verificationCode += input.value;
    });
    if (notValid) return;
    console.log('verificationCode', verificationCode);

    const res = await fetch('/api/users/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: User.getUser()?.email,
        verificationCode,
      }),
    });
    if (res.status !== 200) {
      return;
    }
    router.push('/chat');
  }

  public moveFocus(e: KeyboardEvent) {
    const target = (e.target as HTMLInputElement);
    const current = parseInt(target.getAttribute('index'), 10);      

    if (e.key === 'Enter') {
      this.verifyCode();
      return;
    };

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
      this.controlIsPressed = true;
      return;
    };
    if ((e.key === 'v' || e.key === 'V') && this.controlIsPressed) {
      target.removeAttribute('maxlength');
      return;
    };
    (e.target as HTMLInputElement).value = e.key.length === 1 ? e.key : (e.target as HTMLInputElement).value;
    e.preventDefault();
    this.controlIsPressed = false;
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (!target.value && current > 1) {
        (document.querySelector(`[index="${(current - 1)}"]`) as HTMLInputElement)?.focus();
      }
      target.value = '';
      return;
    }
    if (current < 6) {
      (document.querySelector(`[index="${(current + 1)}"]`) as HTMLInputElement)?.focus();
    }
  }
  public setup() {
   onMounted(async () => {
    this.getLoginStatus();
   });

    return {
      isLoading: this.isLoading,
      showVerify: this.showVerify,
      verificationCode: this.verificationCode,
      email: this.email,
      getLoginStatus: this.getLoginStatus.bind(this),
      waitingForVerification: this.waitingForVerification.bind(this),
      moveFocus: this.moveFocus.bind(this),
      onPast: this.onPast.bind(this),
      verifyCode: this.verifyCode.bind(this),
    }
  }
}