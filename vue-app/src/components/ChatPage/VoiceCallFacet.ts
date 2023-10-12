import { Ref, ref } from 'vue';
import SocketIoClient from '../../utilites/SocketIoClient';
import SocketPeer from '../../utilites/SocketPeer';
import Peer from 'simple-peer';
import User from '../../models/User';


export default class VoiceCallFacet {
    public activeConversationId: number;
    public socketPeers: SocketPeer[] = [];
    public stream: any = null;
    public activeConversationUsers = [];
    public someoneIsCalling: Ref<boolean> = ref(false);
    public pendingPeers: {second_peer_email: string, data: any}[] = [];

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

    public async onCall() {
        if (!this.stream) {
            await this.getUserMedia();
        }
        SocketIoClient.getConversationParticipant({
            conversationId: this.activeConversationId,
        });
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

    public waitForAnswer(args) {
        this.someoneIsCalling.value = true;
        this.pendingPeers.push(args);
    }

    public async onAnswer() {
        if (!this.stream) {
            await this.getUserMedia();
        }
        this.pendingPeers.forEach((pendingPeer) => {
            console.log(pendingPeer);
            
            const peer = new Peer({ stream: this.stream });
            const socketPeer = new SocketPeer({ 
                peer,
                activeConversationId: this.activeConversationId,
                secondPeerEmail: pendingPeer.second_peer_email,
                offer: pendingPeer.data,
            });
            socketPeer.connect();
            socketPeer.signal(pendingPeer.data);
            this.socketPeers.push(peer);
    
        })
    }

    constructor() {

    }

    public setup(props) {
        this.activeConversationId = props.activeConversationId;

        return {
            onCall: this.onCall.bind(this),
            onAnswer: this.onAnswer.bind(this),
            someoneIsCalling: this.someoneIsCalling,
        }
    }
}