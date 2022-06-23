import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/leaderboardService';
import TeamsService from '../services/teamsService';

export default class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  public teamService = new TeamsService();

  public async blankLeaderboard() {
    const allTeam = await this.teamService.getTeams();

    const boardInitial = allTeam.map((team) => ({
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }));
    return boardInitial;
  }

  public async getHomeLeaderboard(_req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const boardHome = await this.blankLeaderboard();
      const leaderboardHome = await this.leaderboardService.getHomeLeaderboard(boardHome);

      return res.status(200).json(leaderboardHome);
    } catch (error) {
      next(error);
    }
  }

  public async getAwayLeaderboard(_req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const boardAway = await this.blankLeaderboard();
      const leaderboardAway = await this.leaderboardService.getAwayLeaderboard(boardAway);

      return res.status(200).json(leaderboardAway);
    } catch (error) {
      next(error);
    }
  }

  public async getLeaderboard(_req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const board = await this.blankLeaderboard();
      const leaderboard = await this.leaderboardService.getLeaderboard(board);

      return res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
