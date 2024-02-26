import { Ref, onMounted, ref } from "vue";
import Encryption from "../../utilites/Encryption"
import SocketIoClient from "../../utilites/SocketIoClient";
import User from "../../models/User";
import router from "../../route";

export default class KeysConfigFacet {
    publicKeyToExport: Ref<string>;
    privateKeyToExport: Ref<string>;
    generated: Ref<boolean>;
    keysToStore: Ref<string>;
    KeysUploader: Ref<HTMLInputElement>;
    showKeysSync: Ref<boolean>;
    keysSynced: Ref<boolean>;
    constructor() {
        this.publicKeyToExport = ref('');
        this.privateKeyToExport = ref('');
        this.keysToStore = ref('');
        this.generated = ref(false);
        this.showKeysSync = ref(false);
        this.keysSynced = ref(false);
    }
    public async onCreateKeys() {
        const keys = await Encryption.generateKeyPair();        
        this.privateKeyToExport.value = await Encryption.exportKey(keys.privateKey);
        this.publicKeyToExport.value = await Encryption.exportKey(keys.publicKey);
        this.keysToStore.value = JSON.stringify({
            publicKey: this.publicKeyToExport.value,
            privateKey: this.privateKeyToExport.value
        });
        this.generated.value = true;
        SocketIoClient.connect(false);
        SocketIoClient.updatePublicKey({
            id: User.getUser().id,
            public_key: this.publicKeyToExport.value,
        });
    }

    // download your keys
    public async onSaveKeys() {
        const blob = new Blob([this.keysToStore.value], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'YourKeys.txt';
        downloadLink.style.display = 'none';
        downloadLink.click();
    }

    public onGoToChat() {
        router.push('/chat');
    }

    public onUploadKeys() {
        this.KeysUploader.value.click();
    }

    public async onKeysSync() {
        const file = this.KeysUploader.value.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const keys = JSON.parse(e.target.result as string);
            localStorage.setItem('publicKey', keys.publicKey);
            localStorage.setItem('privateKey', keys.privateKey);
            SocketIoClient.updatePublicKey({
                id: User.getUser().id,
                public_key: keys.publicKey,
            });
            await Encryption.getCryptoKeyPair(true);
            this.keysSynced.value = true;
        };
        reader.readAsText(file);
    }
    
    public setup() {
        this.KeysUploader = ref(null);
        onMounted(() => {
            this.KeysUploader.value.addEventListener('change', this.onKeysSync.bind(this));
        });
        return {
            keysToStore: this.keysToStore,
            generated: this.generated,
            KeysUploader: this.KeysUploader,
            keysSynced: this.keysSynced,
            onSaveKeys: this.onSaveKeys.bind(this),
            onGoToChat: this.onGoToChat.bind(this),
            onUploadKeys: this.onUploadKeys.bind(this),
            onCreateKeys: this.onCreateKeys.bind(this),
        }
    }
}