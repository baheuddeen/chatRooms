import GSAP from 'gsap';
export default class Util {
    private static gsap: GSAP;

    public static async getGSAP(): Promise<GSAP> {
        return new Promise((res, rej) => {
            if(Util.gsap) {
                res(Util.gsap);
                return;
            }
            const interval = setInterval(() => {
                if((window as any).gsap) {
                    Util.gsap = (window as any).gsap;
                    clearInterval(interval);
                    res(Util.gsap);
                }
            }, 100);
        });
    }
}