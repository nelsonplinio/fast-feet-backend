import Delivery from '../models/Delivery';
import File from '../models/File';

class FinishDeliveryController {
  async store(req, res) {
    const delivery = await Delivery.findOne({
      where: {
        deliveryman_id: req.params.deliveryman_id,
        id: req.params.delivery_id,
        end_date: null,
        signature_id: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery no avaliable to finish.',
      });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const { id: signature_id } = file;

    await delivery.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json(delivery);
  }
}

export default new FinishDeliveryController();
