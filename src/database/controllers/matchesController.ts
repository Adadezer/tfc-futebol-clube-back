import { Request, Response, NextFunction } from 'express';
import MatchesService from '../services/matchesService';

export default class MatchesController {
  constructor(private matchesService: MatchesService) {}

  public async getAllMatches(req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const { inProgress } = req.query;
      // console.log('progress Controller: ', inProgress);

      const matches = await this.matchesService.getAllMatches();

      if (inProgress) {
        const progressBoolean = inProgress === 'true'; // vai retornar o booleano true, ou o booleano false caso a string nao seja 'true';
        const progress = matches.filter((el) => el.inProgress === progressBoolean);
        return res.status(200).json(progress);
      }
      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }

  public async createMatchProgressTrue(req: Request, res: Response)
    :Promise<Response | void> {
    try {
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;

      if (homeTeam === awayTeam) {
        return res.status(401).json({
          message: 'It is not possible to create a match with two equal teams',
        });
      }

      const matchData = { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress };

      const matchCreated = await this.matchesService.createMatchProgressTrue(matchData);

      return res.status(201).json(matchCreated);
    } catch (error) {
      return res.status(404).json({ message: 'There is no team with such id!' });
      // cai no erro pois homeTeam e awayTeam são foreinKey da tabela Team, se a requisição nao achar o id na tabela, ele nao cria a partida e da o erro
    }
  }

  public async updateMatchProgressFalse(req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const { id } = req.params;

      const matchUpdated = await this.matchesService.updateMatchProgressFalse(id);

      return res.status(200).json(matchUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async updateMatchProgressTrue(req: Request, res: Response, next: NextFunction)
    :Promise<Response | void> {
    try {
      const { id } = req.params;

      const { homeTeamGoals, awayTeamGoals } = req.body;

      const matchUpdated = await this.matchesService.updateMatchProgressTrue(
        id,
        { homeTeamGoals, awayTeamGoals },
      );

      return res.status(200).json(matchUpdated);
    } catch (error) {
      next(error);
    }
  }
}
