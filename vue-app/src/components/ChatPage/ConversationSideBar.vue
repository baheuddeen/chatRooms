<script lang="ts">
import { ref, defineComponent } from "vue";
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import ConversationBar from "./ConversationBar.vue";
import { Conversation } from "../../models/Types";

export default defineComponent({
    components: {
        Sidebar,
        ConversationBar,
        Button,
    },

    props: {
        conversationLoaded: {
            type: Boolean
        }, 
        conversations: {
            type: () => null as Conversation[]
        },
    },

    emits: ["selectConversation"],


    setup(_props, {emit}) {
        const visible = ref(false);
        const desktopView = ref(true);
        const checkDesktop = () => {
            console.log('mini', desktopView.value);
            
            if(window.innerWidth > 992) {
                desktopView.value = true;
                return;
            } 
            desktopView.value = false;
        }
        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        const onSelectConversation = (e) => {
            visible.value = false;
            emit("selectConversation", e)
        }
        return {
            visible,
            desktopView,
            onSelectConversation,
        }
    }
})
</script>


<template>
        <div v-if = "desktopView" class="card flex justify-content-start col-lg-2">
            <ConversationBar 
                :conversations="conversations"
                :conversationLoaded="conversationLoaded"
                @select-conversation="onSelectConversation"
            />
        </div>
        <div v-else>
            <span class="pi pi-align-justify show-chats-side-bar" @click="visible = true"></span>
            <Sidebar v-model:visible="visible">
                <ConversationBar 
                    :conversations="conversations"
                    :conversationLoaded="conversationLoaded"
                    @select-conversation="onSelectConversation"
                />
            </Sidebar>
        </div>
       
</template>

<style scoped>
.show-chats-side-bar{
    position: fixed;
    top: 9px;
    font-size: 42px;
    left: 10px;
    cursor: pointer;
}
</style>


