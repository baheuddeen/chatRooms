import { Ref, watch, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';
import Peer from 'simple-peer';
import User from '../../models/User';


export default class VoiceCallFacet {
    public activeConversationId: Ref<number>;
    public activeVoiceCallId?: Ref<number>;
    public socketPeers: SocketPeer[] = [];
    public inVoiceCall: Ref<boolean>;
    public stream: any = null;
    public activeConversationUsers = [];
    public someoneIsCalling: Ref<boolean> = ref(false);

    public inactiveScreen() {
        document.addEventListener('visibilitychange', function(e){
            e.stopImmediatePropagation();            
        });
    }

    public answerCall({
        conversation_id,
        secondPeerEmail,
        data,
    }: {
        conversation_id,
        secondPeerEmail,
        data,
    }) {
        const peer = new Peer({ 
            initiator: false,
            trickle: false,
            stream: this.stream,
            config: { iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:wee-whisper.com:3478' },
                { urls: 'turn:wee-whisper.com:3478', username: 'turnuser', credential: '123456'},
            ] },
        });
        const socketPeer = new SocketPeer({ 
            peer,
            activeConversationId: conversation_id,
            secondPeerEmail: secondPeerEmail,
        });
        // remove this logic to socket peer
        socketPeer.stream = this.stream;
        this.socketPeers.push(socketPeer);
        socketPeer.connect();
        socketPeer.peer.signal(data);
    }

    public call({
        conversation_id,
        secondPeerEmail,
    }: {
        conversation_id,
        secondPeerEmail,
    }) {
        if (User.getUser().email == secondPeerEmail) {
            console.log('cannot call yourself');
            return;
        }
        console.log('calling', secondPeerEmail);
        const peer = new Peer({ 
            initiator: true,
            trickle: false,
            stream: this.stream,
            config: { iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:wee-whisper.com:3478' },
                { urls: 'turn:wee-whisper.com:3478', username: 'turnuser', credential: '123456'},
            ] },
        });
        const socketPeer = new SocketPeer({ 
            peer,
            activeConversationId: conversation_id,
            secondPeerEmail: secondPeerEmail,
            isInitiator: true,
        });
        socketPeer.stream = this.stream;
        this.socketPeers.push(socketPeer);
        socketPeer.connect();
    }

    public _micError (err){ 
        console.log(err);
    }

    public async onJoin() {
        await this.getUserMedia();
        this.activeVoiceCallId.value = this.activeConversationId.value;
        SocketIoClient.joinVoiceCall({
            conversation_id: this.activeConversationId.value,
        });
        this.inVoiceCall.value = true;
    }

    public removeSocketPeer({
        secondPeerEmail,
    }){
        const socketPeer = this.socketPeers.find((socketPeer) => {
            return socketPeer.secondPeerEmail == secondPeerEmail;
        });
        if (!socketPeer) {
            console.log('socketPeer not found..');
            return;
        }
        socketPeer.peer.destroy();
        this.socketPeers.splice(this.socketPeers.indexOf(socketPeer), 1);
        console.log('socketPeer removed', this.socketPeers);
        
    }

    private async getUserMedia() {
        const constraints = {
            video: false,
            audio: {
                autoGainControl: false,
                channelCount: 2,
                echoCancellation: false,
                latency: 0,
                noiseSuppression: false,
                sampleRate: {
                    ideal: 48000,
                    min: 44100,
                },
                sampleSize: 16,
                volume: 1.0
            }
          } as MediaStreamConstraints;
          try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
            // TODO: display your own video.
          }
        catch(err) {
            this._micError.bind(this);
        }
    }


    public onLeave() {
        this.activeVoiceCallId.value = null;
        this.socketPeers.forEach((socketPeer) => {
            socketPeer.peer.destroy();             
        });
        this.socketPeers = [];  
        this.stream.getTracks().forEach((track) => {
            track.stop();
            this.stream.removeTrack(track);
        });
        SocketIoClient.videos.streams.value = [];
        SocketIoClient.leaveVoiceCall();
        this.inVoiceCall.value = false;
    }
    constructor() {
        console.log('VoiceCallFacet');
        
        this.inVoiceCall = ref(false);
        this.activeVoiceCallId = ref(null);
        this.activeConversationId = ref(null);

        // move it some where else
        var myAudio = new Audio('/assets/one-minute-of-sielnce.ogg'); 
            myAudio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
        myAudio.play();
    }

    public setup(props: {
        activeConversationId: number,
    }) {
        this.inactiveScreen();
        this.activeConversationId.value = props.activeConversationId;
        watch(() => props.activeConversationId, (newVal) => {
            this.activeConversationId.value = newVal;
        });

        return {
            activeVoiceCallId: this.activeVoiceCallId,
            onJoin: this.onJoin.bind(this),
            onLeave: this.onLeave.bind(this),
            someoneIsCalling: this.someoneIsCalling,
            inVoiceCall: this.inVoiceCall,
        }
    }
}