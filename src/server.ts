import http from 'http';
import path from 'path';
import  express  from 'express';
import ChatServer from './lib/ChatServer';
import router from './routes'
const app = express();


app.use(express.static(path.join(__dirname, '..', 'vue-app', 'build')));
// TODO FIX THIS 
app.get('/:something', function (req, res, next) {
    if (req.url.startsWith('/api')) {
        next()
    }
    res.redirect('/');
});

app.use('/api', router);

const server = http.createServer(app);
const chatServer = new ChatServer(server);

chatServer.listen();
server.listen(3000);

console.log('server is listening on 3000');


