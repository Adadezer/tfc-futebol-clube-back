import { Router } from 'express';

import LeaderboardController from '../database/controllers/leaderboardController';
import LeaderboardService from '../database/services/leaderboardService';

const router = Router();

const leaderboardService = new LeaderboardService();
const leaderboardController = new LeaderboardController(leaderboardService);

router.get('/home', (req, res, next) => leaderboardController.getHomeLeaderboard(req, res, next));
router.get('/away', (req, res, next) => leaderboardController.getAwayLeaderboard(req, res, next));
router.get('/', (req, res, next) => leaderboardController.getLeaderboard(req, res, next));
export default router;
