// @ts-ignore.
import Peer from 'simple-peer';
import ISocket from '../models/ISocket';
import wrtc from 'wrtc';
import ChatServer from './ChatServer';

export default class SocketPeer {
    public peer: any;
    public activeConversationId: number;
    public secondPeerEmail: string;
    public offer?: any;
    public socket: ISocket;
    public stream: MediaStream;

    constructor({ conversationId, secondPeerEmail, socket} :{ conversationId: number, secondPeerEmail: string, socket: ISocket }) {
        this.socket = socket;
        this.peer = new Peer({  initiator: true, wrtc, });
        this.peer.on
        this.activeConversationId = conversationId;        
        this.secondPeerEmail = secondPeerEmail;
        this.connect();
    }

    private connect() {    
        this.peer.on('signal', data  => {
            // console.log('wow data', data);   

            this.socket.emit('answerVoiceCall', { 
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

        this.peer.on("stream", this._onStream.bind(this));

        this.peer.on("error", (err) => console.log("error", err));
    }

    public signal(args) {
        this.peer.signal(args);
    }

    public _onStream(stream: MediaStream) {
        const otherSocketPeers = ChatServer.voiceCallSessions.find((session) => {
            return session.conversation_id == this.activeConversationId
        }).socketPeers;
        // console.log('otherSockets', otherSocketPeers);
        this.stream = stream;
        // this.peer.addStream(stream);

        otherSocketPeers.forEach((socketPeer) => {
            if(socketPeer.secondPeerEmail == this.socket.user_data.email) {
                return;
            }
            // don't send me back my stream !
            console.log('it should add Track !');
            if(socketPeer.peer.destroyed) {
                return;
            } 
            const track = stream?.getTracks()[0] as any;
            if (!socketPeer.stream) {
                // console.log('peer stream not found!');
                return;
            }
            track.peerEmail = this.secondPeerEmail;  
            try {
                socketPeer.peer.addTrack(track, this.stream);        
                if (socketPeer.stream?.getTracks()[0]) {
                    this.peer.addStream(socketPeer.stream);                
                }
            } catch(err) {
                console.log('something bad happened');
            }
            
        })
    }
}

