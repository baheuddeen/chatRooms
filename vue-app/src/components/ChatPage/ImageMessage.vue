<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Encryption from '../../utilites/Encryption';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
    props: {
        src: { type: String },
        iv: { type: ArrayBuffer },
        symmetricKey: { type: ArrayBuffer },
        is_encrypted: { type: Number },
    },

    setup(props) {
        let url = ref(props.src);
        const isPreview = ref(false);

        const showImage = () => {
            SocketIoClient.popup.isPreview.value = true;
            SocketIoClient.popup.popupImage.value.src = url.value;
        };

        onMounted(async () => {
            if (props.is_encrypted == 1) {
                const res = await fetch(props.src);
                const encryptedBlob = await res.blob() as Blob;
                const iv = props.iv;
                const symmetricKeyEncrypted = props.symmetricKey;
                const symmetricKey = await Encryption.decryptMessage(symmetricKeyEncrypted);                
                const decryptedData = await Encryption.decryptBinaryData({
                    encryptedData: await encryptedBlob.arrayBuffer(),
                    symmetricKeyBuffer: symmetricKey,
                    iv,
                });
                const blob = new Blob([decryptedData]);
                url.value = URL.createObjectURL(blob);
            }
        });

        return {
            url,
            isPreview,
            showImage,
        };
    }
});

</script>
<template>
    <div class="image-massage" @click="showImage">
        <img :src="url"/>
    </div>
</template>
<style>
.image-massage {
    width: fit-content;
    cursor: pointer;
}

.image-massage img{
    min-width: 100px;
    width: 80%;
}

.image-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: block;
    z-index: 400;

}

.image-popup img {
  max-width: 80%;
  max-height: 80%;
  margin: auto;
  margin-top: 2.5%;
  margin-bottom: 2.5%;
  display: block;
}

.close {
  position: absolute;
  top: 0;
  right: 10%;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
}

@media (max-width: 768px){
    .image-popup img {
        margin-top: 20%;
    }
    .close {
        top: 5%;
    }
}

</style>
