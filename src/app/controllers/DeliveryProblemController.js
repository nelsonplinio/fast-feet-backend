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
    const { page = 1 } = req.query;

    const pageSize = 5;
    const limit = pageSize;
    const offset = pageSize * (Number(page) - 1);

    let totalPage = await Delivery.count();

    totalPage = Math.max(Math.ceil(totalPage / pageSize), 1);

    const problems = await DeliveryProblem.findAll({
      limit,
      offset,
      where: {
        delivery_id: req.params.delivery_id,
      },
      include: [
        {
          model: Delivery,
          as: 'delivery',
        },
      ],
      order: [['id', 'DESC']],
    });

    return res.json({
      page: Number(page),
      totalPage,
      list: problems,
    });
  }
}

export default new DeliveryProblemController();
