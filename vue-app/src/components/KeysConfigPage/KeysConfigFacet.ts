import { Ref, ref } from "vue";
import Encryption from "../../utilites/Encryption"
import SocketIoClient from "../../utilites/SocketIoClient";
import User from "../../models/User";

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
    public setup() {
        return {
            privateKeyToExport: this.privateKeyToExport,
            publicKeyToExport: this.publicKeyToExport,
            generated: this.generated,
            onCreateKeys: this.onCreateKeys.bind(this),
        }
    }
}