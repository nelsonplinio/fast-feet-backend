import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { delivered = false, page = 1 } = req.query;

    const where = {
      deliveryman_id: req.params.deliveryman_id,
      canceled_at: null,
      end_date: delivered === 'true' ? { [Op.ne]: null } : null,
    };

    const pageSize = 5;
    const limit = pageSize;
    const offset = pageSize * (Number(page) - 1);

    const count = await Delivery.count({
      where,
    });

    const totalPage = Math.max(Math.ceil(count / pageSize), 1);

    const deliveries = await Delivery.findAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    return res.json({
      list: deliveries,
      page: Number(page),
      totalPage,
    });
  }
}

export default new DeliveryController();
