import peer from 'simple-peer';
import SocketIoClient from './SocketIoClient';
import * as process from 'process';
import User from '../models/User';
import { IMediaStream } from '../components/ChatPage/VideosFacet';
import { log } from 'console';

export default class SocketPeer {
    public peer: any;
    public activeConversationId: number;
    public secondPeerEmail: string;
    public stream: IMediaStream;
    public otherStreams: IMediaStream[] = [];
    public isInitiator: boolean;

    constructor({ peer, activeConversationId, secondPeerEmail, isInitiator} :{peer?: any, activeConversationId: number, secondPeerEmail?: string, isInitiator?: boolean}) {
        if (!window['process']) {
            window['process'] = process;
        }
        this.peer = peer;
        this.secondPeerEmail = secondPeerEmail;
        this.activeConversationId = activeConversationId;   
        this.isInitiator = isInitiator;     
    }

    public connect() {    
        this.peer.on('signal', data => {
            SocketIoClient.signal({
                data,
                activeConversationId: this.activeConversationId,
                secondPeerEmail: this.secondPeerEmail,
            });
        });

        this.peer.on('connect', () => {
            console.log('wow connected !');
            // wait for 'connect' event before using the data channel
            this.peer.send('hey, how is it going?')
        });

        this.peer.on("data", (data) => console.log("data:", data));

        this.peer.on("stream", (stream: IMediaStream) => {
            console.log('recieved stream !', stream);
            // if (this.stream.id == stream.id) {
            //     return;
            // }            
            // this.otherStreams.push(stream);
            (window as any).x = stream;
            
            if (this.stream.id == stream.id) {
                // my stream
                // remove audio track
                stream.removeTrack(stream.getAudioTracks()[0]);
            } 
            stream.isMainStream = false;
            SocketIoClient.videos.streams.value.push(stream);
            // let videoElement = document.createElement('video');
            // videoElement.srcObject = stream;
            // document.body.appendChild(videoElement);
            // videoElement.play();
            // let audio =  new Audio();
            // audio.setAttribute('id', stream.id);
            // audio.srcObject = stream;
            // document.body.appendChild(audio);            
            // audio.play();
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