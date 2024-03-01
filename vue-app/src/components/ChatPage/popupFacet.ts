import {Ref, ref, } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
export default class PopupFacet {
    public popupImage: Ref<HTMLImageElement>;

    public isPreview: Ref<boolean>;

    public showUpload: Ref<boolean>;


    setup() {
        this.popupImage = ref(null);
        this.isPreview = ref(false);
        this.showUpload = ref(false);

        const onUploadImage = () => {
            SocketIoClient.sendImage.onUploadImage();
        }

        const onClose = () => {
            this.isPreview.value = false;
            this.showUpload.value = false;
        }

        return {
            popupImage: this.popupImage,
            isPreview: this.isPreview,
            showUpload: this.showUpload,
            onUploadImage,
            onClose,
        }
    }

}