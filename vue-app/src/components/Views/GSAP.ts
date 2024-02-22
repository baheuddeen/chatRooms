import GSAP from 'gsap';
export default class Util {
    private static gsap: GSAP;

    public static getGSAP (){
        if(!Util.gsap) {
            Util.gsap = (window as any).gsap;
            Util.gsap.registerPlugin(ScrollTrigger);            
        }
        return Util.gsap;
    }
}