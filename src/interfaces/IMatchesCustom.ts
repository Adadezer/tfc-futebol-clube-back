import MatcheModel from '../database/models/matches';

export default interface IMatchesCustom extends MatcheModel{
  teamHome: {
    teamName: string
  },
  teamAway: {
    teamName: string
  }
}
