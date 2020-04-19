import * as Yup from 'yup';

import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class DeliverymanSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.validate(req.body))) {
      return res.status(402).json({
        error: 'Invalid data!',
      });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id, {
      include: [
        {
          model: File,
          as: 'avatar',
        },
      ],
      attributes: ['id', 'email', 'name', 'avatar_id', 'created_at'],
    });

    if (!deliveryman) {
      return res.status(404).json({
        error: 'Deliveryman not found',
      });
    }

    return res.json({ deliveryman });
  }
}

export default new DeliverymanSessionController();
