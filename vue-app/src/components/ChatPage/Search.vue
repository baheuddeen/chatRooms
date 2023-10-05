<script lang="ts">
import { defineComponent } from 'vue';
import SearchFacet from './SearchFacet';
import SocketIoClient from '../../utilites/SocketIoClient';

export default defineComponent({
    setup() {
        const searchFacet = new SearchFacet();
        SocketIoClient.subscribeSearch({
            search: searchFacet
        });

        return searchFacet.setup();
    }
});
</script>


<template>
    <form @submit.prevent="onSubmit">
        {{ user_name }}
        <input type="text" placeholder="Enter user name" @keypress="onKeyPress" v-model="user_name">
        <button> search </button>
    </form>
    <!-- <div class="result">
        <div v-for="user of users">
            {{ user.user_name }}
        </div>
    </div> -->
</template>