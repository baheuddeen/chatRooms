import peer from 'simple-peer';
import SocketIoClient from './SocketIoClient';
import * as process from 'process';
import User from '../models/User';

export default class SocketPeer {
    public peer: any;
    public activeConversationId: number;
    public secondPeerEmail: string;
    public stream: MediaStream;

    constructor({ peer, activeConversationId} :{peer?: any, activeConversationId: number }) {
        if (!window['process']) {
            window['process'] = process;
        }
        this.peer = peer;
        this.activeConversationId = activeConversationId;        
    }

    public connect() {    
        this.peer.on('signal', data => {
            console.log('wow data', data);   

                SocketIoClient.requestVoiceCall({
                    data,
                    activeConversationId: this.activeConversationId,
                });

        });

        this.peer.on('connect', () => {
            console.log('wow connected !');
            // wait for 'connect' event before using the data channel
            this.peer.send('hey, how is it going?')
        });

        this.peer.on("data", (data) => console.log("data:", data));

        this.peer.on("stream", (stream: MediaStream) => {
            console.log('recieved stram !');
            if (this.stream.id == stream.id) {
                return;
            }
            console.log((stream.getTracks()[0] as any));
            let video =  new Audio();
            video.setAttribute('id', stream.id);
            video.srcObject = stream;
            document.body.appendChild(video);
            console.log('video,', video);
            
            video.play();
            // but it somewhere eles!   
        })

        this.peer.on("addTrack", (stream: MediaStream) => {
            console.log('recieved track !');
            // if (this.stream.id == stream.id) {
            //     return;
            // }
            console.log((stream));
            // stream.removeTrack(stream.getTracks()[0]);
            // let video =  new Audio();
            // video.setAttribute('id', stream.id);
            // video.srcObject = stream;
            // document.body.appendChild(video);
            // console.log('video,', video);
            
            // video.play();
            // but it somewhere eles!   
        })

        this.peer.on("error", (err) => console.log("error", err));
    }

    public signal(args) {
        this.peer.signal(args);
    }
}