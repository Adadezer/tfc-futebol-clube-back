import MatchesModel from '../models/matches';
import TeamModel from '../models/teams';
import IMatchesCustom from '../../interfaces/IMatchesCustom';
import IMatchesCreate from '../../interfaces/IMatchesCreate';
import IUpdateMatchProgressTrue from '../../interfaces/IUpdateMatchProgressTrue';

export default class MatchesService {
  constructor(private matchesModel = MatchesModel) {}

  public async getAllMatches(): Promise<IMatchesCustom[]> {
    const matches = await this.matchesModel.findAll({
      include: [
        /*  dentro da tabela matches, vou procurar o model de Team, onde ele é chamado de 'teamHome', buscar o conteudo da coluna 'teamName', e incluir esse resultado no resuldado trago pelo findAll (https://tableless.com.br/sequelize-a-solu%C3%A7%C3%A3o-para-seus-relacionamentos/) */
        { model: TeamModel, as: 'teamHome', attributes: ['teamName'] },
        { model: TeamModel, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    return matches as IMatchesCustom[];
  }

  public async createMatchProgressTrue(match: IMatchesCreate): Promise<object> {
    const matchCreate = await this.matchesModel.create(match);

    return matchCreate;
  }

  public async updateMatchProgressFalse(id: string): Promise<MatchesModel | null> {
    await this.matchesModel.update({ inProgress: false }, { where: { id } });

    const matchUpdated = await this.matchesModel.findOne({ where: { id } });
    return matchUpdated;
  }

  public async updateMatchProgressTrue(id: string, match: IUpdateMatchProgressTrue)
    :Promise<IUpdateMatchProgressTrue | null> {
    await this.matchesModel.update(
      { homeTeamGoals: match.homeTeamGoals, awayTeamGoals: match.awayTeamGoals },
      { where: { id } },
    );

    const matchUpdated = await this.matchesModel.findOne({ where: { id } });
    return matchUpdated;
  }
}
