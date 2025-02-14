import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import OrderRegisteredMail from '../jobs/OrderRegisteredMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const delivery = await Delivery.create(req.body);

    await delivery.reload({
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });

    Queue.add(OrderRegisteredMail.key, { delivery });

    return res.json(delivery);
  }

  async index(req, res) {
    const { q = '', page = 1, status = '' } = req.query;

    let statusWhere;

    switch (status) {
      case 'canceled': {
        statusWhere = {
          canceled_at: {
            [Op.ne]: null,
          },
        };
        break;
      }

      case 'withdrawn': {
        statusWhere = {
          start_date: {
            [Op.ne]: null,
          },
        };
        break;
      }

      case 'delivered': {
        statusWhere = {
          end_date: {
            [Op.ne]: null,
          },
        };
        break;
      }

      case 'pending': {
        statusWhere = {
          start_date: null,
          canceled_at: null,
          end_date: null,
        };
        break;
      }

      default: {
        statusWhere = {};
      }
    }

    const where = {
      product: {
        [Op.like]: `%${q}%`,
      },
      ...statusWhere,
    };

    const pageSize = 5;
    const limit = pageSize;
    const offset = pageSize * (Number(page) - 1);

    let totalPage = await Delivery.count({
      where,
    });

    totalPage = Math.max(Math.ceil(totalPage / pageSize), 1);

    const orders = await Delivery.findAll({
      where,
      limit,
      offset,
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
        'status',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'postal_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
          attributes: ['id', 'name', 'email', 'avatar_id'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      list: orders,
      page: Number(page),
      totalPage,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const order = await Delivery.findByPk(id, {
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
        'status',
        'image_id',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'postal_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
          attributes: ['id', 'name', 'email', 'avatar_id'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const order = await Delivery.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Delivery not found',
      });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Delivery.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Delivery not found',
      });
    }

    await order.destroy();

    return res.json();
  }
}

export default new OrderController();
