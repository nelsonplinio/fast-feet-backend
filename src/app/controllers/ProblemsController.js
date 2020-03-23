import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class ProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const pageSize = 5;
    const limit = pageSize;
    const offset = pageSize * (page - 1);

    let totalPage = await DeliveryProblem.count();

    totalPage = Math.max(Math.ceil(totalPage / pageSize), 1);

    const problems = await DeliveryProblem.findAll({
      limit,
      offset,
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

export default new ProblemsController();
