import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import api from './api';

async function init(): Promise<void> {
  const serviceAccountKey = require('./serviceAccountKey.json');
  const config = functions.config().firebase;
  config.credential = admin.credential.cert(serviceAccountKey);
  admin.initializeApp(config);
}

init().catch((err) => {
  console.error(err);
});

export {api};
