import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import auth from './api/auth/auth';
import user from './handlers/User';
import cookies from 'cookie-parser';
import validateJWT from '../utilities/validateJWT';
import voiceMessageValidate from '../utilities/voiceMessagesValidate';
import path from 'path';
import joinConversation from './handlers/Conversation';
import history from 'connect-history-api-fallback';

const dirAbs = path.resolve();
var router = express.Router();

router.use(bodyParser.json());
router.use(cookies());

router.use('/private', voiceMessageValidate, express.static(path.join(dirAbs, 'private')));



router.get('/joinRoom/:id', joinConversation);


// users
router.use('/api/users', user);

router.use(history());

router.use(express.static(path.join(dirAbs, 'public')));

// TODO FIX THIS 
// router.get('/:something', history(), function (req, res, next) {
//     const whiteListedRoutes = [
//         '/api',
//         '/joinRoom',
//     ]
//     let isWhiteListedRoute = whiteListedRoutes.reduce((previous, current) => {
//         return req.url.startsWith(current) || previous
//     }, false);
//     console.log('isWhiteListed: ', isWhiteListedRoute);
    
//     if (isWhiteListedRoute) {
//         next();
//     }
//     res.redirect('/');
// });



// Authenication
router.use('/api/auth', validateJWT, auth);



export default router;