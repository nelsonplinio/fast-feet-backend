import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import WithdrawalController from './app/controllers/WithdrawalController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:deliveryman_id/deliveries', DeliveryController.index);

routes.post(
  '/deliveryman/:deliveryman_id/deliveries/:delivery_id/withdrawal',
  WithdrawalController.store
);

routes.post(
  '/deliveryman/:deliveryman_id/deliveries/:delivery_id/finish-delivery',
  upload.single('file'),
  FinishDeliveryController.store
);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);
export default routes;
