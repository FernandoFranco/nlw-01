import { Request, Response } from 'restify';

import knex from '../database/connection';

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');
    const serializedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      image_url: `/assets/${item.image}`,
    }));
    return response.json(serializedItems);
  }
}

export default ItemsController;
