import Knex from "knex";
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  return knex('items').insert([
    {
      id: '6a461aa1-7425-4487-9b08-cec8b2f5fa38',
      title: 'Lâmpadas',
      image: 'lampadas.svg',
    },
    {
      id: '83e1d99e-46b4-4030-b07a-4f7bd22f6168',
      title: 'Pilhas e Baterias',
      image: 'baterias.svg',
    },
    {
      id: 'f340220a-5bb9-4e33-ae38-5527cd82da44',
      title: 'Papéis e Papelão',
      image: 'papeis-papelao.svg',
    },
    {
      id: '9c80bb49-4cbc-49bb-bd8e-387607e522e6',
      title: 'Resíduos Eletrônicos',
      image: 'eletronicos.svg',
    },
    {
      id: 'fdf2a42b-0cda-437e-b915-704e1b00352f',
      title: 'Resíduos Orgânicos',
      image: 'organicos.svg',
    },
    {
      id: 'c0e82615-a47f-4822-8d3b-30b190c8be97',
      title: 'Óleo de Cozinha',
      image: 'oleo.svg',
    },
  ]);
}
