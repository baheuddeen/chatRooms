import { Ref, onMounted, ref } from "vue";
import Util from "./GSAP";

type Card = {
    image: string,
    title: string,
    desc: string,
}

export default class HeroSectionFacet {
    cards: Card[];

    constructor() {
        this.cards = [
            {
                image: "/chat-icon.svg",
                title: "Real-time text chat",
                desc: "WeeWhisper leverages the powerful capabilities of Socket.IO to enable real-time communication between web clients and servers. Socket.IO, a versatile real-time web library, facilitates seamless bi-directional interactions, creating a robust foundation for instant text chat and data exchange within our application.",
            },
            {
                image: "/group-call-icon.svg",
                title: "Group Voice Call",
                desc: "Additionally, our app utilizies the advanced capabilities of WebRTC technology. WebRTC takes real-time communication to the next level by enabling not only voice calls but also group calls. This feature empowers our users with the ability to engage in group discussions, making our app a versatile and dynamic platform for a wide range of conversations.",
            },
            {
                image: "/voice-note-icon.svg",
                title: "Voice notes",
                desc: "We also offers the convenience of voice notes, enhancing the richness and versatility of our platform. With voice notes, users can easily send and receive voice messages, allowing for a more personal and expressive way to communicate. Whether it's a quick voice memo, a heartfelt message, or conveying complex information, our voice notes feature ensures that every message is delivered with clarity and emotion,",
            },
        ];
    }



    setup() {        
        return {
            cards: this.cards,
        }
    }
}