import { Request, Response } from 'restify';
import { v4 as uuidv4 } from 'uuid';

import knex from '../database/connection';

class PointsController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      image,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const transaction = await knex.transaction();

    const point = {
      id: uuidv4(),
      image,
      name,
      email,
      whatsapp,
      latitude: Number(latitude),
      longitude: Number(longitude),
      city,
      uf,
    };
    await transaction('points').insert(point);

    const pointItems = items
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => !!item)
      .map((item_id: number) => ({
        id: uuidv4(),
        item_id,
        point_id: point.id,
      }));
    await transaction('point_items').insert(pointItems);

    transaction.commit();

    return response.json(point);
  }

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items).split(',').map((item) => item.trim());

    const result = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedItems = result.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      whatsapp: item.whatsapp,
      latitude: item.latitude,
      longitude: item.longitude,
      city: item.city,
      image_url: `/uploads/${item.image}`,
    }));
    return response.json(serializedItems);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex('points').where('id', String(id)).first();

    if (!point) {
      return response.json(404, {
        message: 'Point not found',
      });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({
      ...point,
      image: `/uploads/${point.image}`,
      items,
    });
  }
}

export default PointsController;
