import { ref } from "vue";

type Card = {
    image: string,
    title: string,
    desc: string,
}
/*
<div class="features-container p-grid p-nogutter row">
<div  class="m-w-500 p-col-12 p-md-6 p-lg-3 col-lg-3 col-md-6 col-12">
    <router-link to="/real-time-chat" class="router-link-exact-active">
    <div class="feature-card">
        <img src="../../assets/chat-icon.svg" alt="Chat Icon" class="icon" />
        <p>Real-time text and voice chat</p>
    </div>
    </router-link>
</div>
<div  class="m-w-500 p-col-12 p-md-6 p-lg-3 col-lg-3 col-md-6 col-12">
    <router-link to="/real-time-chat" class="router-link-exact-active">
    <div class="feature-card">
        <img src="../../assets/voice-note-icon.png" alt="Voice Note Icon" class="icon" />
        <p>Voice notes</p>
    </div>
    </router-link>
</div>
<div  class="m-w-500 p-col-12 p-md-6 p-lg-3 col-lg-3 col-md-6 col-12">
    <router-link to="/real-time-chat" class="router-link-exact-active">
    <div class="feature-card">
        <img src="../../assets/group-call-icon.png" alt="Group Call Icon" class="icon" />
        <p>Group voice calls</p>
    </div>
    </router-link>
</div>
<div  class="m-w-500 p-col-12 p-md-6 p-lg-3 col-lg-3 col-md-6 col-12">
    <router-link to="/real-time-chat" class="router-link-exact-active">
    <div class="feature-card">
        <img src="../../assets/encryption-icon.png" alt="Encryption Icon" class="icon" />
        <p>End-to-end encryption</p>
    </div>
    </router-link>
</div>
</div>
*/
export default class CarouselFacet {
    public cards: Card[];
    public responsiveOptions: any;

    constructor() {
        this.cards = [
            {
                image: "/assets/chat-icon.svg",
                title: "Real-time text chat",
                desc: "Mini Chat app leverages the powerful capabilities of Socket.IO to enable real-time communication between web clients and servers. Socket.IO, a versatile real-time web library, facilitates seamless bi-directional interactions, creating a robust foundation for instant text chat and data exchange within our application.",
            },
            {
                image: "/assets/group-call-icon.png",
                title: "Group Voice Call",
                desc: "Additionally, our app utilizies the advanced capabilities of WebRTC technology. WebRTC takes real-time communication to the next level by enabling not only voice calls but also group calls. This feature empowers our users with the ability to engage in group discussions, making our app a versatile and dynamic platform for a wide range of conversations.",
            },
            {
                image: "/assets/voice-note-icon.png",
                title: "Voice notes",
                desc: "We also offers the convenience of voice notes, enhancing the richness and versatility of our platform. With voice notes, users can easily send and receive voice messages, allowing for a more personal and expressive way to communicate. Whether it's a quick voice memo, a heartfelt message, or conveying complex information, our voice notes feature ensures that every message is delivered with clarity and emotion,",
            },
        ];
        this.responsiveOptions = ref([
            {
                breakpoint: '1400px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '1199px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]);
    }
    setup() {
        return {
            cards: this.cards,
            responsiveOptions: this.responsiveOptions,
        }
    }
}