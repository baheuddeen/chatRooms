import { Ref, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import { UserType } from '../../models/User';

export default class SearchFacet {
    public user_name: Ref<string>;

    public users: Ref<UserType[]>;


    constructor() {
        this.user_name = ref('');
        this.users = ref([]);
    }

    public onSubmit() {        
        SocketIoClient.searchByUser({
            user_name: this.user_name.value,
        });
    }

    public onKeyPress(event: KeyboardEvent) {
        if (!this.user_name.value) {
            return;
        }

        if(event.key == 'enter') {
            this.onSubmit()
        }

        // SocketIoClient.searchByUser({
        //     user_name: this.user_name.value,
        // });
    }


    public setup() {
        return {
            user_name: this.user_name,
            users: this.users,
            onSubmit :this.onSubmit.bind(this),
            onKeyPress:this.onKeyPress.bind(this),
        }
    }
}