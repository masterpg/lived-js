import * as express from 'express';
import * as server from 'lived-js/lib/server';

export default function publicHello(req: express.Request, res: express.Response) {
  const message = req.query.message;
  res.send(`Hello ${message}`);
}

server.router.public.get('/publicHello', publicHello);
