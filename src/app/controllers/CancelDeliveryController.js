import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import DeliveryCanceled from '../jobs/DeliveryCanceledMail';

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
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });

    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found or is canceled',
      });
    }

    delivery.update({
      canceled_at: new Date(),
    });

    Queue.add(DeliveryCanceled.key, {
      delivery,
      problem,
    });

    return res.json(delivery);
  }
}

export default new CancelDeliveryController();
