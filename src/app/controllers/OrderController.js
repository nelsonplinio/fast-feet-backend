import * as Yup from 'yup';
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
    const orders = await Delivery.findAll({
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
      ],
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
      ],
    });
    return res.json(orders);
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
