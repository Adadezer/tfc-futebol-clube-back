import MatchesService from './matchesService';

import ILeaderboard from '../../interfaces/ILeaderboard';

export default class LeaderboardService {
  public matchesService = new MatchesService();

  public async finishedMatches() {
    const allMatches = await this.matchesService.getAllMatches();
    const finishedMatches = allMatches.filter((el) => el.inProgress === false);
    return finishedMatches;
  }

  public async teamHomeWinner(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const gameResults = leaderboard.find((winner) => match.teamHome.teamName === winner.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalPoints += 3;
        gameResults.totalGames += 1;
        gameResults.totalVictories += 1;
      }
    });
  }

  public async teamHomeLoser(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const gameResults = leaderboard.find((loser) => match.teamHome.teamName === loser.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalGames += 1;
        gameResults.totalLosses += 1;
      }
    });
  }

  public async teamHomeDraw(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const gameResults = leaderboard.find((draw) => match.teamHome.teamName === draw.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.homeTeamGoals;
        gameResults.goalsOwn += match.awayTeamGoals;
        gameResults.totalPoints += 1;
        gameResults.totalGames += 1;
        gameResults.totalDraws += 1;
      }
    });
  }

  public async goalsBalanceHome(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamHome.teamName === team.name);
      if (!teamData) return null;
      teamData.goalsBalance = (teamData.goalsFavor - teamData.goalsOwn);
    });
  }

  public async efficiencyHome(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamHome.teamName === team.name);
      if (!teamData) return null;
      const percentageUse = (teamData.totalPoints / (teamData.totalGames * 3)) * 100;
      teamData.efficiency = Number(percentageUse.toFixed(2));
    });
  }

  public async teamAwayWinner(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const gameResults = leaderboard.find((winner) => match.teamAway.teamName === winner.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.awayTeamGoals;
        gameResults.goalsOwn += match.homeTeamGoals;
        gameResults.totalPoints += 3;
        gameResults.totalGames += 1;
        gameResults.totalVictories += 1;
      }
    });
  }

  public async teamAwayLoser(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const gameResults = leaderboard.find((loser) => match.teamAway.teamName === loser.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.awayTeamGoals;
        gameResults.goalsOwn += match.homeTeamGoals;
        gameResults.totalGames += 1;
        gameResults.totalLosses += 1;
      }
    });
  }

  public async teamAwayDraw(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const gameResults = leaderboard.find((draw) => match.teamAway.teamName === draw.name);
        if (!gameResults) return null;
        gameResults.goalsFavor += match.awayTeamGoals;
        gameResults.goalsOwn += match.homeTeamGoals;
        gameResults.totalPoints += 1;
        gameResults.totalGames += 1;
        gameResults.totalDraws += 1;
      }
    });
  }

  public async goalsBalanceAway(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamAway.teamName === team.name);
      if (!teamData) return null;
      teamData.goalsBalance = (teamData.goalsFavor - teamData.goalsOwn);
    });
  }

  public async efficiencyAway(leaderboard: ILeaderboard[]) {
    (await this.finishedMatches()).forEach((match) => {
      const teamData = leaderboard.find((team) => match.teamAway.teamName === team.name);
      if (!teamData) return null;
      const percentageUse = (teamData.totalPoints / (teamData.totalGames * 3)) * 100;
      teamData.efficiency = Number(percentageUse.toFixed(2));
    });
  }

  public static sortLeaderboard(leaderboard: ILeaderboard[]) {
    // static para lidar com a falta do this
    (leaderboard).sort((a, b) => b.totalPoints - a.totalPoints).sort((a, b) => {
      if (a.totalPoints === b.totalPoints) { return b.totalVictories - a.totalVictories; } return 0;
    }).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)) {
        return b.goalsBalance - a.goalsBalance;
      } return 0;
    }).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance)) { return b.goalsFavor - a.goalsFavor; } return 0;
    })
      .sort((a, b) => {
        if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)) {
          return b.goalsOwn - a.goalsOwn;
        } return 0;
      });
    return leaderboard;
  }

  public async getHomeLeaderboard(leaderboardHome: ILeaderboard[]) {
    await Promise.all([
      this.teamHomeWinner(leaderboardHome),
      this.teamHomeLoser(leaderboardHome),
      this.teamHomeDraw(leaderboardHome),
    ]);
    await this.goalsBalanceHome(leaderboardHome);
    await this.efficiencyHome(leaderboardHome);
    LeaderboardService.sortLeaderboard(leaderboardHome);
    return leaderboardHome;
  }

  public async getAwayLeaderboard(leaderboardAway: ILeaderboard[]) {
    await Promise.all([
      this.teamAwayWinner(leaderboardAway),
      this.teamAwayLoser(leaderboardAway),
      this.teamAwayDraw(leaderboardAway),
    ]);
    await this.goalsBalanceAway(leaderboardAway);
    await this.efficiencyAway(leaderboardAway);
    LeaderboardService.sortLeaderboard(leaderboardAway);
    return leaderboardAway;
  }

  public async getLeaderboard(leaderboard: ILeaderboard[]) {
    await this.getHomeLeaderboard(leaderboard);
    await this.getAwayLeaderboard(leaderboard);
    return leaderboard;
  }
}
