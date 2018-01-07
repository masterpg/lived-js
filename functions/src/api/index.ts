import * as functions from 'firebase-functions';
import * as express from 'express';
import * as server from 'lived-js/lib/server';

import './controllers/publicHello';

const app = express();
app.use('/api', server.router.base);
app.use('/api', server.router.public);
app.use('/api', server.router.auth);
const api = functions.https.onRequest(app);

export default api;
