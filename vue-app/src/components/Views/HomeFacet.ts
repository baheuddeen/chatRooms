import { Ref, onMounted, ref } from "vue";
import Util from "./GSAP";

export default class {
    title: Ref<HTMLElement>;

    addAnimation() {
        this.animateTitle();
    }

    animateTitle() {
        const gsap = Util.getGSAP();
        const tl = gsap.timeline({
            duration: 0.2,
        });
        let direction = true;
        const words = (this.title.value.querySelector('.content') as HTMLElement).innerText.split(' ');
        words.map((word, wordIndex) => {
            const letters = word.split('').map((letter) => this.getLetterElement(letter));
            const wordElem = this.getWordElement(letters, wordIndex);
            this.title.value.appendChild(wordElem);
            letters.forEach((letter, letterIndex) => {
                tl.from(letter, {
                    rotateY: letterIndex % 2 == 0 ? 0 :360,
                    rotateX: letterIndex % 2 == 0 ? 360 :0,
                    translateX: letterIndex % 2 == 0 ? 20 : -20,
                    translateY: letterIndex % 2 == 0 ? 20 : -20,
                    opacity: 0,
                });
                if(letter.innerText === 'i' ) {
                    gsap.from(letter, {
                        rotateY: 360,
                        repeat: 50,
                        repeatDelay: 2,
                    });
                }
            });
        });        
    }

    getLetterElement(letter: string) {
        const elem = document.createElement('div');
        elem.innerHTML = `
            ${letter}
        `;
        return elem;
    }

    getWordElement(letters: HTMLElement[], index: number) {
        const elem = document.createElement('div');
        elem.classList.add('d-flex');
        elem.style.justifyContent = index % 2 == 0 ? 'left' : 'right';
        letters.forEach((letter) => {
            elem.appendChild(letter);
        })
        return elem;
    }

    
    setup() {
        this.title = ref(null);
        onMounted(() => {
            this.addAnimation();
        });

        return {
            title: this.title,
        }
    }
}