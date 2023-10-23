import { Ref, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { MenuItem } from "primevue/menuitem";
import User from "../../models/User";

export default class MenuFacet {
    public items: Ref<Array<MenuItem>>;

    public toggle: Ref<boolean>;

    public userName: Ref<string>;

    public status: Ref<string>;
    
    constructor() {
        this.toggle = ref(false);
        this.items = ref([
            // {
            //     label: 'Profile',
            //     icon: 'pi pi-fw pi-user'
            // },
            // {
            //     label: 'Settings',
            //     icon: 'pi pi-fw pi-cog',
            //     badge: 2
            // },
        ]);
        this.userName = ref('');
        this.status = ref('online'); // TODO handle it
    }

    public profileClick() {
        this.toggle.value = !this.toggle.value;
        // const toast = useToast();
        // toast.add({ severity: 'info', summary: 'Info', detail: 'Item Selected', life: 3000 });
    }

    public async setUserName() {
        this.userName.value = (await User.waitingForUser()).user_name;
        console.log(this.userName.value);
    }

    setup () {
        this.setUserName();
        return {
            items: this.items,
            toggle: this.toggle,
            profileClick: this.profileClick.bind(this),
            userName: this.userName,
            status: this.status,
        }
    }
}