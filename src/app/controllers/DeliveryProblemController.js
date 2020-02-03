import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async store(req, res) {
    const schema = Yup.object({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const checkDeliveryExists = await Delivery.findByPk(req.params.delivery_id);

    if (!checkDeliveryExists) {
      return res.status(400).json({
        error: 'Delivery do not exists',
      });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: req.params.delivery_id,
      description: req.body.description,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.delivery_id,
      },
    });

    return res.json(problems);
  }
}

export default new DeliveryProblemController();
