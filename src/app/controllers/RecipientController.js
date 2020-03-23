import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8),
      street: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8),
      street: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    let recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipent not found' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipients = await Recipient.findByPk(id);

    return res.json(recipients);
  }

  async index(req, res) {
    const { q = '', page = 1 } = req.query;

    const where = {
      name: {
        [Op.like]: `%${q}%`,
      },
    };

    const pageSize = 5;
    const limit = pageSize;
    const offset = pageSize * (Number(page) - 1);

    let totalPage = await Recipient.count({
      where,
    });

    totalPage = Math.max(Math.ceil(totalPage / pageSize), 1);

    const recipients = await Recipient.findAll({
      limit,
      offset,
      where,
    });

    return res.json({ list: recipients, totalPage, page: Number(page) });
  }
}

export default new RecipientController();
