import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliveryman_id,
        canceled_at: null,
        end_date: req.query.delivered === 'true' ? { [Op.ne]: null } : null,
      },
    });

    return res.json(deliveries);
  }
}

export default new DeliveryController();
