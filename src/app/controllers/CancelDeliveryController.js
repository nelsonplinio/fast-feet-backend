import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class CancelDeliveryController {
  async store(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.problem_id);

    if (!problem) {
      return res.status(404).json({
        error: 'Problem not found',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: problem.delivery_id,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found or is canceled',
      });
    }

    delivery.update({
      canceled_at: new Date(),
    });

    return res.json(delivery);
  }
}

export default new CancelDeliveryController();
