import http from 'http';
import path from 'path';
import  express  from 'express';
import ChatServer from './lib/ChatServer';
import router from './routes'
import voiceMessageValidate from './utilities/voiceMessagesValidate';
import joinConversation from './routes/handlers/Conversation';
const app = express();


app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/private', voiceMessageValidate, express.static(path.join(__dirname, '..', 'private')));


// TODO FIX THIS 
app.get('/:something', function (req, res, next) {
    if (req.url.startsWith('/api') || req.url.startsWith('/joinRoom')) {
        next()
    }
    res.redirect('/');
});

app.use('/joinRoom', joinConversation);


app.use('/api', router);

const server = http.createServer(app);
const chatServer = new ChatServer(server);

chatServer.listen();
server.listen(3000);

console.log('server is listening on 3000');


