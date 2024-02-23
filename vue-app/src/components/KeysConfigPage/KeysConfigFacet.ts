import { Ref, ref } from "vue";
import Encryption from "../../utilites/Encryption"
import SocketIoClient from "../../utilites/SocketIoClient";
import User from "../../models/User";
import router from "../../route";

export default class KeysConfigFacet {
    publicKeyToExport: Ref<string>;
    privateKeyToExport: Ref<string>;
    generated: Ref<boolean>
    constructor() {
        this.publicKeyToExport = ref('');
        this.privateKeyToExport = ref('');
        this.generated = ref(false);
    }
    public async onCreateKeys() {
        const keys = await Encryption.generateKeyPair();        
        this.privateKeyToExport.value = await Encryption.exportKey(keys.privateKey);
        this.publicKeyToExport.value = await Encryption.exportKey(keys.publicKey);
        this.generated.value = true;
        SocketIoClient.connect(false);
        SocketIoClient.updatePublicKey({
            id: User.getUser().id,
            public_key: this.publicKeyToExport.value,
        });
    }

    public async onCopyPrivateKey() {
        await navigator.clipboard.writeText(this.privateKeyToExport.value);
    }

    public onGoToChat() {
        router.push('/chat');
    }

    public async onUploadKeys() {
        // const keys = await Encryption.importKey(this.privateKeyToExport.value);
        // this.privateKeyToExport.value = await Encryption.exportKey(keys.privateKey);
        // this.publicKeyToExport.value = await Encryption.exportKey(keys.publicKey);
        // this.generated.value = true;
        // SocketIoClient.connect(false);
        // SocketIoClient.updatePublicKey({
        //     id: User.getUser().id,
        //     public_key: this.publicKeyToExport.value,
        // });
    }
    
    public setup() {
        return {
            privateKeyToExport: this.privateKeyToExport,
            publicKeyToExport: this.publicKeyToExport,
            generated: this.generated,
            onCopyPrivateKey: this.onCopyPrivateKey.bind(this),
            onGoToChat: this.onGoToChat.bind(this),
            onUploadKeys: this.onUploadKeys.bind(this),
            onCreateKeys: this.onCreateKeys.bind(this),
        }
    }
}