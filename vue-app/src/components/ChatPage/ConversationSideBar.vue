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
        <div v-if = "desktopView" class="col-lg-3"></div>
        <div v-if = "desktopView" class="card flex justify-content-start col-lg-3">
            <ConversationBar 
                :conversations="conversations"
                :conversationLoaded="conversationLoaded"
                @select-conversation="onSelectConversation"
            />
        </div>
        <div class="show-chats-menu" v-else>
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
    font-size: 42px;
    left: 10px;
    cursor: pointer;
    color: rgb(209, 207, 207);
    display: block;
}

.show-chats-menu {
    position: fixed;
    height: 60px;
    width: fit-content;
    background: black;
    top: 0px;
    padding: 10px;
    z-index: 100;
}
.card {
    background: rgb(33, 33, 33);
    height: 100vh;
    border-radius: 0px;
    position: fixed;
    height: 100vh;
    top: 0px;
    padding-top: 65px;
    color: white;
}
</style>


