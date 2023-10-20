import http from 'http';
import  express  from 'express';
import ChatServer from './lib/ChatServer';
import router from './routes';

const app = express();

app.use('/', router);

const server = http.createServer(app);
const chatServer = new ChatServer(server);

chatServer.listen();
server.listen(3000);

console.log('server is listening on 3000');


