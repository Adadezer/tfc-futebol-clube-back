import { Router } from 'express';
import UserController from '../database/controllers/userController';
import UserService from '../database/services/userService';

import validationLogin from '../middlewares/loginMiddleware';
import authUser from '../middlewares/authUser';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/validate', authUser, (req, res) => userController.getUser(req, res));

router.post(
  '/',
  validationLogin,
  async (req, res, next) => userController.getLogin(req, res, next),
);

export default router;
