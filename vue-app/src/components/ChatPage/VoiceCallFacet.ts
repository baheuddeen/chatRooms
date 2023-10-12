import { Ref, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';

export default class VoiceCallFacet {
    public _micCaptured(stream) {
        SocketPeer.setPeerInit(stream);
        SocketPeer.connect();
        // const peer = SocketPeer.getPeer();
        // for (const track of stream.getTracks()) {
        //     peer.addTrack(track);
        // }
    }

    public _micError (err){ 
        console.log(err);
    }

    public onCall() {
        const constraints = {
            video: false,
            audio: {
              channelCount: 1,
              echoCancellation: false,
            }
          }
          
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this._micCaptured.bind(this))
        .catch(this._micError.bind(this))
    }

    public onAnswer() {
  
    }

    constructor() {
        
    }

    public setup() {
        return {
            onCall: this.onCall.bind(this),
            onAnswer: this.onAnswer.bind(this),
        }
    }
}