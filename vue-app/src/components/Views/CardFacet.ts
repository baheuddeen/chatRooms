import { Ref, onMounted, ref } from "vue";
import Util from "./GSAP";

export type Card = {
    image: string,
    title: string,
    desc: string,
}

export default class CardFacet {
    cardElement: Ref<HTMLElement>;

    constructor() {
    }

    async addAnimation() {
        const gsap = await Util.getGSAP();
        const leftSection = this.cardElement.value.querySelector('.left-section');
        const rightSection = this.cardElement.value.querySelector('.right-section');

        gsap.from(leftSection, {
            translateX: -400,
            scrollTrigger: this.cardElement.value,
            duration: 2,
            opacity: 0,
        });

        gsap.from(rightSection, {
            translateX: 400,
            scrollTrigger: this.cardElement.value,
            duration: 2,
            opacity: 0,
        });
    }

    setup() {
        this.cardElement = ref(null);
        onMounted(() => {
            this.addAnimation();
        })
        return {
            cardElement: this.cardElement,
        }
    }
}