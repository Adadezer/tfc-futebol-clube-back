import { Router } from 'express';

import MatchesController from '../database/controllers/matchesController';
import MatchesService from '../database/services/matchesService';
import authUser from '../middlewares/authUser';

const router = Router();

const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

router.patch(
  '/:id/finish',
  authUser,
  (req, res, next) => matchesController.updateMatchProgressFalse(req, res, next),
);

router.patch(
  '/:id',
  authUser,
  (req, res, next) => matchesController.updateMatchProgressTrue(req, res, next),
);

router.get('/', (req, res, next) => matchesController.getAllMatches(req, res, next));

router.post(
  '/',
  authUser,
  (req, res) => matchesController.createMatchProgressTrue(req, res),
);

export default router;
