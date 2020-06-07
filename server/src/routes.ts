import { Server } from 'restify';
import { celebrate, Joi } from 'celebrate';

import ItemsController from './controllers/itemsController';
import PointsController from './controllers/pointsController';

import uploadMiddleware from './middlewares/upload';

const itemsController = new ItemsController();
const pointsController = new PointsController();

function Router(server: Server) {
  server.get('/items', itemsController.index);

  server.get('/points', pointsController.index);
  server.get('/points/:id', pointsController.show);
  server.post(
    '/points',
    uploadMiddleware,
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
        image: Joi.string().required(),
      }),
    }, {
      abortEarly: false,
    }) as any,
    pointsController.create,
  );
}

export default Router;
