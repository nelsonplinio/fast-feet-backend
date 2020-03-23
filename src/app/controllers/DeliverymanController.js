import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fail. Some data is missing',
      });
    }

    const develiverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (develiverymanExists) {
      return res.status(400).json({
        error: 'Error delivery already exists.',
      });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
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

    let totalPage = await Deliveryman.count({
      where,
    });

    totalPage = Math.max(Math.ceil(totalPage / pageSize), 1);

    const deliverymans = await Deliveryman.findAll({
      where,
      limit,
      offset,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'name', 'url'],
        },
      ],
    });

    return res.json({
      list: deliverymans,
      page: Number(page),
      totalPage,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'name', 'url'],
        },
      ],
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fail. Some data is missing',
      });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({
        error: 'Deliveryman not found',
      });
    }

    const { name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    await Deliveryman.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json();
  }
}

export default new DeliverymanController();
