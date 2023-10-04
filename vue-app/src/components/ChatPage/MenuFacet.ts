import { Ref, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { MenuItem } from "primevue/menuitem";
import User from "../../models/User";

export default class MenuFacet {
    public items: Ref<Array<MenuItem>>;

    public toggle: Ref<boolean>;

    public userName: string;

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
        this.userName = User.getUser().user_name;
        this.status = ref('online')
    }

    public profileClick() {
        this.toggle.value = !this.toggle.value;
        // const toast = useToast();
        // toast.add({ severity: 'info', summary: 'Info', detail: 'Item Selected', life: 3000 });
    }

    setup () {
        return {
            items: this.items,
            toggle: this.toggle,
            profileClick: this.profileClick.bind(this),
            userName: this.userName,
            status: this.status,
        }
    }
}