import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8)
        .max(8),
      street: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8)
        .max(8),
      street: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      number: Yup.string().notRequired(),
      complement: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    let recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipent not found' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
