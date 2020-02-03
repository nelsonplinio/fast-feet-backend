import { Op } from 'sequelize';
import { isAfter, isBefore, setHours, startOfDay, endOfDay } from 'date-fns';
import Delivery from '../models/Delivery';

class WithdrawalController {
  async store(req, res) {
    const { delivery_id, deliveryman_id } = req.params;

    /**
     * check if the time is between the valid time
     */
    const today = new Date();
    const checkTimeIsValid =
      isAfter(today, setHours(today, 8)) &&
      isBefore(today, setHours(today, 18));

    if (!checkTimeIsValid) {
      return res.status(400).json({
        error: 'Time not valid. You do this action between 08:00h and 18:00h',
      });
    }

    const checkDeliveriesCount = await Delivery.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(today), endOfDay(today)],
        },
      },
    });

    if (checkDeliveriesCount.count >= 5) {
      return res.status(400).json({
        error: 'cannot withdraw more than 4 deliveries',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
      },
    });

    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found',
      });
    }

    /**
     * check if the delivery has already been withdrawn
     */
    const checkIfDeliveryHasAlready = delivery.start_date !== null;

    if (checkIfDeliveryHasAlready) {
      return res.status(400).json({
        error: 'Delivery has already been withdrawn',
      });
    }

    await delivery.update({
      start_date: new Date(),
    });

    return res.json(delivery);
  }
}

export default new WithdrawalController();
