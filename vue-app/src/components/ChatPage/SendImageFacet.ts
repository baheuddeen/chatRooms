import { Ref, onMounted, ref, watch } from "vue";
import SocketIoClient from "../../utilites/SocketIoClient"
import Encryption from "../../utilites/Encryption";

export default class SendImageFacet {
    sendingBinaryData: Ref<boolean>;

    encryptedBlob: Ref<Blob>;

    imageUploader: Ref<HTMLInputElement>;

    imagePreview: Ref<HTMLImageElement>;

    activeConversationId: Ref<number>;

    isPreviewing: Ref<boolean>;

    constructor() {
        this.sendingBinaryData = ref(false);
        this.encryptedBlob = ref(null);
    }

    async onUploadImage() {
        if (!SocketIoClient.popup.popupImage.value.src) {
            return
        }
        const image = this.imageUploader.value.files[0];
        
        const encrypted = await Encryption.encryptBinaryData(await (image).arrayBuffer());
        this.encryptedBlob.value = new Blob([encrypted.encryptedData], { type: image.type });
        const chunkSize = 700000;
        const length = Math.floor(this.encryptedBlob.value.size / chunkSize);
        const _uid = new Date().getTime();
        SocketIoClient.prepareImageMessage( {
            filename: SocketIoClient.popup.popupImage.value.src.split('/').pop() + _uid,
            length,
            binary: true,
            conversation_id: this.activeConversationId.value,
            iv: encrypted.iv,
            symmetric_key: encrypted.key,
        } );    
    }
    
    async previewImage () {
        if (this.imageUploader.value.files && this.imageUploader.value.files[0]) {
            // Create a blob URL
            const imgURL = URL.createObjectURL(this.imageUploader.value.files[0]);
            SocketIoClient.popup.isPreview.value = true;
            SocketIoClient.popup.showUpload.value = true;
            SocketIoClient.popup.popupImage.value.src = imgURL;
        }         
    }
    
    onChooseImage() {
        this.imageUploader.value.click();
    }

    setup(props, emit) {
        this.imageUploader = ref(null);
        this.imagePreview = ref(null);
        this.isPreviewing = ref(false);
        this.activeConversationId = ref(props.activeConversationId);
        onMounted(() => {
            this.imageUploader.value.addEventListener('change', this.previewImage.bind(this));
        });

        SocketIoClient.subscribeImageUpload({
            sendingBinaryDataImage: this.sendingBinaryData,
        });
  
  
  
        watch(this.sendingBinaryData, () => {
          if (!this.sendingBinaryData.value) {
            return;
          }

          const file = this.encryptedBlob.value;
          const chunkSize = 700000;
          let num = 0;
  
          for (let start = 0; start < file.size; start += chunkSize) {
            const chunk = file.slice(start, start + chunkSize);
            SocketIoClient.sendImageMessage( {
              blob: chunk,
              num: num++,
            } );          
          }
          this.sendingBinaryData.value = false;
          SocketIoClient.popup.isPreview.value = false;
          SocketIoClient.popup.showUpload.value = false;
        });


        return {
            imageUploader: this.imageUploader,
            imagePreview: this.imagePreview,
            activeConversationId: this.activeConversationId,
            isPreviewing: this.isPreviewing,
            onUploadImage: this.onUploadImage.bind(this),
            sendImage: this.previewImage.bind(this),
            onChooseImage: this.onChooseImage.bind(this),
        }
    }
}