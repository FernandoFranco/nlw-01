import path from 'path';

import restify, { Request, Response } from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import { errors } from 'celebrate';

import routes from './routes';

const server = restify.createServer({
  name: 'ecoleta',
  version: '1.0.0',
});

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['http://localhost:3001'],
  allowHeaders: [],
  exposeHeaders: [],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

routes(server);

server.get('/assets/*',
  restify.plugins.serveStaticFiles(
    path.resolve(__dirname, '..', 'assets')
  )
);

server.get('/uploads/*',
  restify.plugins.serveStaticFiles(
    path.resolve(__dirname, '..', 'uploads')
  )
);

server.on('restifyError', (request: Request, response: Response, error: any, callback: Function) => {
  if (!error.joi) {
    callback(error);
    return;
  }

  response.json(422, {
    statusCode: 422,
    error: 'Unprocessable Entity',
    message: error.message,
    validation: {
      source: error.meta.source,
      keys: error.joi.details.map((detail: any) => detail.context.key),
    },
  });
});

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
