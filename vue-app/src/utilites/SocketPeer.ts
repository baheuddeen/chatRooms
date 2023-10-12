import peer from 'simple-peer';
import SocketIoClient from './SocketIoClient';
import  * as process from 'process';

export default class SocketPeer {
    private static peerClient: any = null;

    static isPeerinit: boolean = false;

    public static connect() {    

        const peer = SocketPeer.getPeer();
        peer.on('signal', data => {
            console.log('wow data', data);   

            if (data.type == 'offer' || data.type == 'answer') {
                SocketIoClient.sendPeer(data);
            }
        });

        peer.on('connect', () => {
            console.log('wow connected !');
            // wait for 'connect' event before using the data channel
            peer.send('hey, how is it going?')
        });

        peer.on("data", (data) => console.log("data:", data));

        peer.on("stream", (stream) => {
            console.log('recieved stram !');
            
            console.log(stream);
            let video = document.getElementById("auido-stram") as HTMLAudioElement;
            video.srcObject = stream;
            video.play();
        })

        peer.on("error", (err) => console.log("error", err));
    }

    public static setPeerInit(stream) {
        window['process'] = process;
        if (!SocketPeer.peerClient) {
            console.log('my stram', stream);
            
            SocketPeer.peerClient = new peer({ initiator: true, trickle: false, stream, });
            SocketPeer.isPeerinit = true;
        }
    }

    public static sendSignal(data) {
        const peer = SocketPeer.getPeer(); 
        window['peer'] = peer       
        peer.signal(data);
    }

    public static setPeer( { offer, }: {offer: any} ) {
        window['process'] = process;
        if (!SocketPeer.peerClient) {
            SocketPeer.peerClient = new peer();
            SocketPeer.connect();
            SocketPeer.sendSignal(offer);
        }
    }

    public static getPeer() {
        if (!SocketPeer.peerClient) {
            throw new Error('peer is not set yet');
        }
        return SocketPeer.peerClient;
    }
}