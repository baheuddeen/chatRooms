import { Ref, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';
import Peer from 'simple-peer';
import User from '../../models/User';


export default class VoiceCallFacet {
    public activeConversationId: number;
    public activeVoiceCallId?: Ref<number>;
    public socketPeers: SocketPeer[] = [];
    public inVoiceCall: Ref<boolean>;
    public stream: any = null;
    public activeConversationUsers = [];
    public someoneIsCalling: Ref<boolean> = ref(false);
    public pendingPeers: {second_peer_email: string, data: any}[] = [];

    public inactiveScreen() {
        document.addEventListener('visibilitychange', function(e){
            e.stopImmediatePropagation();
            console.log('visibilitychange');
            
            // alert('i am not active')
        });
    }

    public call({
        users,
        conversation_id,
    }: {
        users: [any],
        conversation_id,
    }) {
        for (const user of users) {
            if (user.email == User.getUser().email) {
                continue;
            }
            console.log('un', user.email);

            const peer = new Peer({ initiator: true, trickle: false, stream: this.stream, });
            const socketPeer = new SocketPeer({ 
                peer,
                activeConversationId: conversation_id,
                secondPeerEmail: user.email,
            });
            socketPeer.connect();
            this.socketPeers.push(socketPeer);

        }
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

    public answer(args) {
            
        const peer = new Peer({ stream: this.stream, trickle: false, });
        const socketPeer = new SocketPeer({ 
            peer,
            activeConversationId: this.activeConversationId,
            secondPeerEmail: args.second_peer_email,
            offer: args.data,
        });
        socketPeer.connect();
        socketPeer.signal(args.data);
        this.socketPeers.push(peer);
    }

    public async onAnswer() {
        if (!this.stream) {
            await this.getUserMedia();
        }
        this.pendingPeers.forEach((pendingPeer) => {
            
        });
    }
    public onLeave() {
        this.activeVoiceCallId.value = null;
        this.socketPeers.forEach((socketPeer, index) => { 
            if (socketPeer.peer) {
                socketPeer.peer.destroy();    
                this.socketPeers.splice(index, 1);  
                console.log('peer is destroyed!');
                          
            }     else {
                console.log('peer not found!');
                
            }      
        });
        
        SocketIoClient.leaveVoiceCall();
        this.inVoiceCall.value = false;
    }
    constructor() {
        this.inVoiceCall = ref(false);
        this.activeVoiceCallId = ref(null);
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