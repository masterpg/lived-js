import * as server from 'lived-js/lib/server';

server.router.public.get('/publicHello', (req, res) => {
  const message = req.query.message;
  res.send(`Hello ${message}`);
});
