import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import auth from './api/auth/auth';
import user from './handlers/User';
import cookies from 'cookie-parser';
import validateJWT from '../utilities/validateJWT';
import voiceMessageValidate from '../utilities/voiceMessagesValidate';
import path from 'path';
import joinConversation from './handlers/Conversation';

const dirAbs = path.resolve();
var router = express.Router();

router.use(bodyParser.json());
router.use(cookies());

router.use(express.static(path.join(dirAbs, 'public')));
router.use('/private', voiceMessageValidate, express.static(path.join(dirAbs, 'private')));

router.get('/joinRoom/:id', joinConversation);


// users
router.use('/api/users', user);

// TODO FIX THIS 
router.get('/:something', function (req, res, next) {
    if (req.url.startsWith('/api') || req.url.startsWith('/joinRoom')) {
        next()
    }
    res.redirect('/');
});



// Authenication
router.use('/api/auth', validateJWT, auth);



export default router;