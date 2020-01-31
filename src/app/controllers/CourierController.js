import * as Yup from 'yup';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fail. Some data is missing',
      });
    }

    const courier = await Courier.create(req.body);

    return res.json(courier);
  }

  async index(req, res) {
    const couriers = await Courier.findAll({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'name', 'url'],
        },
      ],
    });

    return res.json(couriers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fail. Some data is missing',
      });
    }

    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(404).json({
        error: 'Courier not found',
      });
    }

    const { name, email, avatar_id } = await courier.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    await Courier.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json();
  }
}

export default new CourierController();
