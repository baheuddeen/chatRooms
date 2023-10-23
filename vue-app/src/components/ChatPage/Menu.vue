
<script lang="ts">
import { defineComponent } from "vue";
import MenuFacet from "./MenuFacet";
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import Search from "./Search.vue";
import SocketIoClient from "../../utilites/SocketIoClient";



export default defineComponent({
  components: {
    Menu,
    Avatar,
    Search,
  },

  props: {
        socketIoClient: {
            type: SocketIoClient,
        }
    },
  
  setup() {
    const menuFacet = new MenuFacet();
    return menuFacet.setup();
  }
});

</script>

<template>

    <div class="card flex align-items-end">
        <!-- <div @click="profileClick" class="simple-header">click me..</div> -->
        <Menu :model="items" v-if="!toggle">
            <template #start>
                <button class="w-full p-link flex  align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
                    <Avatar image="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" class="mr-2" shape="circle" />
                    <div class="flex flex-column align">
                        <span class="font-bold">{{ userName }}</span>
                        <span class="text-sm">{{ status == 'online' ? 'online' : 'offline'}}</span>
                    </div>
                </button>
            </template>                
            <!-- <template #item.item="{ label, badge, action, icon }">
                <a  class="flex" v-bind="action">
                    <span v-bind="icon" />
                    <span v-bind="label" >{{ label }}</span>
                    <Badge v-if="badge" class="ml-auto" :value="badge" />
                </a>
            </template>
            <template #end>
                <span>
                    <button class="w-full p-link flex align-items-center pl-4 pt-2 pb-2 text-color hover:surface-200 border-noround">
                    <i class="pi pi-sign-out" />
                    <span class="ml-2">Log Out</span>
                </button>
                </span>
            </template> -->
        </Menu>
        <Toast />
        <!-- <Search :socket-io-client="socketIoClient"></Search> -->
    </div>
</template>
