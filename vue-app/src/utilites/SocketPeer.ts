import peer from 'simple-peer';
import SocketIoClient from './SocketIoClient';
import * as process from 'process';
import User from '../models/User';

export default class SocketPeer {
    public peer: any;
    public activeConversationId: number;
    public secondPeerEmail: string;
    public stream: MediaStream;
    public otherStreams: MediaStream[] = [];

    constructor({ peer, activeConversationId} :{peer?: any, activeConversationId: number }) {
        if (!window['process']) {
            window['process'] = process;
        }
        this.peer = peer;
        this.activeConversationId = activeConversationId;        
    }

    public connect() {    
        this.peer.on('signal', data => {
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
            console.log('recieved stream !');
            if (this.stream.id == stream.id) {
                return;
            }
            this.otherStreams.push(stream);
            let audio =  new Audio();
            audio.setAttribute('id', stream.id);
            audio.srcObject = stream;
            document.body.appendChild(audio);            
            audio.play();
        });

        this.peer.on("track", (streamTrack: MediaStreamTrack) => {
            console.log('recieved track !');
            // console.log('test', (this.stream.getTracks()[0]));
            // console.log('mini', streamTrack);
            
           this.stream.addTrack(streamTrack);
            // let audio =  new Audio();
            // audio.setAttribute('id', stream.id);
            // audio.srcObject = stream;
            // document.body.appendChild(audio);            
            // audio.play();
        })

        this.peer.on("error", (err) => console.log("error", err));
    }

    public signal(args) {
        this.peer.signal(args);
    }
}