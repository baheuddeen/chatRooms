import peer from 'simple-peer';
import SocketIoClient from './SocketIoClient';
import * as process from 'process';
import User from '../models/User';

export default class SocketPeer {
    public peer: any;
    public activeConversationId: number;
    public secondPeerEmail: string;
    public offer?: any;

    constructor({peer, activeConversationId, secondPeerEmail, offer} :{peer?: any, activeConversationId: number, secondPeerEmail: string, offer?: any}) {
        if (!window['process']) {
            window['process'] = process;
        }
        this.peer = peer;
        this.activeConversationId = activeConversationId;        
        this.secondPeerEmail = secondPeerEmail;
        this.offer = offer;
    }

    public connect() {    
        this.peer.on('signal', data => {
            console.log('wow data', data);   

            if (data.type == 'offer') {
                SocketIoClient.requestVoiceCall({
                    data,
                    activeConversationId: this.activeConversationId,
                    secondPeerEmail: this.secondPeerEmail,
                });
            }

            if (data.type == 'answer') {
                SocketIoClient.acceptVoiceCall({ 
                    data,
                    activeConversationId: this.activeConversationId,
                    secondPeerEmail: this.secondPeerEmail,
                });
            }
        });

        this.peer.on('connect', () => {
            console.log('wow connected !');
            // wait for 'connect' event before using the data channel
            this.peer.send('hey, how is it going?')
        });

        this.peer.on("data", (data) => console.log("data:", data));

        this.peer.on("stream", (stream) => {
            console.log('recieved stram !');
            
            console.log(stream);
            let video = document.getElementById("auido-stram") as HTMLAudioElement;
            video.srcObject = stream;
            video.play();
            // but it somewhere eles!
            var myAudio = new Audio('/assets/one-minute-of-sielnce.ogg'); 
            myAudio.addEventListener('ended', function() {
                console.log('i will reborn again!')
                this.currentTime = 0;
                this.play();
            }, false);
            myAudio.play();
        })

        this.peer.on("error", (err) => console.log("error", err));
    }

    public signal(args) {
        this.peer.signal(args);
    }
}