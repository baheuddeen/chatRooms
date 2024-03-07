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
        this.activeConversationId = conversationId;        
        this.secondPeerEmail = secondPeerEmail;
        this.peer = new Peer({  
            initiator: true,
            trickle: true,
            wrtc,
            config: { iceServers: [
                { urls: 'turn:wee-whisper.com:3478', username: 'turnusesr', credential: '123456'},
            ] },
        });
        this.connect();
    }

    private connect() {
        this.peer.on('signal', data  => {
            // console.log('wow signal data', data);   

            this.socket.emit('signal', { 
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
        // console.log('otherSocketPeers', otherSocketPeers);
        
        this.stream = stream;
        // this.peer.addStream(stream);

        otherSocketPeers.forEach((socketPeer) => {
            // console.log('recieved stream', stream);

            if(socketPeer.peer.destroyed) {
                return;
            } 
            console.log('tracks', stream?.getTracks());
            
            if (!socketPeer.stream) {
                console.log('peer stream not found!');
                return;
            }
            try {
                // add other streams to my peer
                this.peer.addStream(socketPeer.stream); 
                // add my stream to other peers
                if(socketPeer.secondPeerEmail == this.socket.user_data.email) {
                    return;
                }
                socketPeer.peer.addStream(stream);               
            } catch(err) {
                console.log('something bad happened', err);
            }
            
        })
    }
}

