import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class ProblemsController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      include: [
        {
          model: Delivery,
          as: 'delivery',
        },
      ],
      order: [['id', 'DESC']],
    });

    return res.json(problems);
  }
}

export default new ProblemsController();
