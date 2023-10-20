import { Ref, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';
import Peer from 'simple-peer';
import User from '../../models/User';


export default class VoiceCallFacet {
    public activeConversationId: number;
    public activeVoiceCallId?: Ref<number>;
    public socketPeer?: SocketPeer;
    public inVoiceCall: Ref<boolean>;
    public stream: any = null;
    public activeConversationUsers = [];
    public someoneIsCalling: Ref<boolean> = ref(false);

    public inactiveScreen() {
        document.addEventListener('visibilitychange', function(e){
            e.stopImmediatePropagation();
            console.log('visibilitychange');
            
            // alert('i am not active')
        });
    }

    public call({
        conversation_id,
    }: {
        conversation_id,
    }) {
        

        const peer = new Peer({ initiator: false, trickle: false, stream: this.stream, });
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
        if (!this.stream) {
            await this.getUserMedia();
        }
        SocketIoClient.joinVoiceCall({
            conversation_id: this.activeConversationId,
        });
        this.activeVoiceCallId.value = this.activeConversationId;
        this.inVoiceCall.value = true;
    }

    public removeStream({
        streamId
    }){
        console.log('socketpeer', this.socketPeer);
        const stream = this.socketPeer?.otherStreams.find((stream) => {
            return stream.id == streamId;
        });
        if (!stream) {
            console.log('can not find the stream!');
            
            return;
        }
        const streamIndex = (this.socketPeer.peer._remoteStreams as any []).indexOf(stream);
        if( streamIndex == -1) {
            console.log('can not find the stream in remote streams!');
            
            return;
        }
        console.log('will remove stream', stream.id);
        
        this.socketPeer.peer._remoteStreams.splice(streamIndex, 1);
    }

    private async getUserMedia() {
        const constraints = {
            video: false,
            audio: {
              channelCount: 1,
              echoCancellation: false,
            }
          }
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
                console.log('peer is destroy!');
                this.socketPeer = null;  
            } else {
                console.log('peer not found!');
                
            }      
        
        SocketIoClient.leaveVoiceCall();
        this.inVoiceCall.value = false;
    }
    constructor() {
        this.inVoiceCall = ref(false);
        this.activeVoiceCallId = ref(null);

        // move it some where else
        var myAudio = new Audio('/assets/one-minute-of-sielnce.ogg'); 
            myAudio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            myAudio.play();
    }

    public setup(props) {
        this.inactiveScreen();
        this.activeConversationId = props.activeConversationId;
        return {
            activeVoiceCallId: this.activeVoiceCallId,
            onJoin: this.onJoin.bind(this),
            onLeave: this.onLeave.bind(this),
            someoneIsCalling: this.someoneIsCalling,
            inVoiceCall: this.inVoiceCall,
        }
    }
}