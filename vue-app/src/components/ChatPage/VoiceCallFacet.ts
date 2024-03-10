import { Ref, watch, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';
import Peer from 'simple-peer';
import User from '../../models/User';


export default class VoiceCallFacet {
    public activeConversationId: Ref<number>;
    public activeVoiceCallId?: Ref<number>;
    public socketPeer?: SocketPeer;
    public inVoiceCall: Ref<boolean>;
    public stream: any = null;
    public activeConversationUsers = [];
    public someoneIsCalling: Ref<boolean> = ref(false);

    public inactiveScreen() {
        document.addEventListener('visibilitychange', function(e){
            e.stopImmediatePropagation();            
        });
    }

    public call({
        conversation_id,
    }: {
        conversation_id,
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
        });
        // remove this logic to socket peer
        socketPeer.stream = this.stream;
        this.socketPeer = socketPeer;
        socketPeer.connect();

    }

    public _micError (err){ 
        console.log(err);
    }

    public async onJoin() {
        await this.getUserMedia();
        console.log('onJoin stream', this.stream);
        console.log('tranks', this.stream.getTracks());

        this.activeVoiceCallId.value = this.activeConversationId.value;
        SocketIoClient.joinVoiceCall({
            conversation_id: this.activeConversationId.value,
        });
        this.inVoiceCall.value = true;
    }

    public removeStream({
        streamId
    }){
        const stream = this.socketPeer?.otherStreams.find((stream) => {
            return stream.id == streamId;
        });
        if (!stream) {
            return;
        }
        const streamIndex = (this.socketPeer.peer._remoteStreams as any []).indexOf(stream);
        if( streamIndex == -1) {            
            return;
        }
        
        this.socketPeer.peer._remoteStreams.splice(streamIndex, 1);
    }

    private async getUserMedia() {
        const constraints = {
            video: false,
            audio: {
              channelCount: 1,
              echoCancellation: false,
            }
          } as MediaStreamConstraints;
          try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
          }
        catch(err) {
            this._micError.bind(this);
        }
    }


    public onLeave() {
        this.activeVoiceCallId.value = null;
            if (this.socketPeer.peer) {                
                this.socketPeer.peer.destroy();    
                this.socketPeer = null;  
            } else {
                
            }      
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