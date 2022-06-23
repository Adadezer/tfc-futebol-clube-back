import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {describe, it, before, after} from 'mocha';

import { app } from '../app';
import * as bcryptjs from 'bcryptjs';
import UsersModel from '../database/models/users';
import TeamsModel from '../database/models/teams';
import { allTeams, team } from './mocks/mockTeams';
import MatchesModel from '../database/models/matches';
import IMatchesCustom from '../interfaces/IMatchesCustom';
import { matchesFull, matchesTrue, matchesFalse, matchCreatedProgressTrue, matchCreatedProgressFalse, matchCreatedFullProgressFalse } from './mocks/mockMatches';
import { homeLeaderboard, awayLeaderboard, leaderboard } from './mocks/mockLeaderboard';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('ROTA LOGIN', () => {
  /**
     * Exemplo do uso de stubs com tipos
     */

  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UsersModel, "findOne")
      .resolves({
        id: 1,
        username: 'user1',
        role: 'admin',
        email: 'admin@admin.com',
        password: 'secret_admin'
    } as UsersModel);
  });

  after(()=>{
    (UsersModel.findOne as sinon.SinonStub).restore();
  })

  describe('POST', () => {
    it('verifica mensagem de erro quando apenas o email é passado', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({email: 'admin@admin.com'});
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('verifica mensagem de erro quando apenas a senha é passada', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({password: 'pass'});
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('verifica se o email está no formato correto', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email.com.br',
        password: 'secret_admin'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('verifica se a senha está no formato correto', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'pass'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('verifica se a senha de login está correta', async () => {
      sinon
      .stub(bcryptjs, "compare")
      .resolves(false);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'secret_admin'
      });
      
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('email or password not exist');
    });

    it('verifica se o login é válido', async () => {
      (bcryptjs.compare as sinon.SinonStub).restore();
      (UsersModel.findOne as sinon.SinonStub).restore();
      sinon
      .stub(bcryptjs, "compare")
      .resolves(true);

      sinon
      .stub(UsersModel, "findOne")
      .resolves({
        id: 1,
        username: 'user1',
        role: 'admin',
        email: 'admin@admin.com',
        password: 'secret_admin'
      } as UsersModel);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'secret_admin'
      });
      
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body.user).to.be.keys('id', 'username', 'role', 'email');
      expect(chaiHttpResponse.body.token).to.an('string');
    });

    it('verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (bcryptjs.compare as sinon.SinonStub).restore();
      (UsersModel.findOne as sinon.SinonStub).restore();
      sinon
        .stub(UsersModel, "findOne")
        .throws('');

      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'secret_admin'
      });

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('GET', () => {
    it('caso o token não exista', async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate').send();

      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('caso o token esteja errado', async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate')
      .set({ authorization: 'sdfnçdsfbsd' });

      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('expired or invalid token');
    });

    it('verifica o retorno do token', async () => {
      (UsersModel.findOne as sinon.SinonStub).restore();
      sinon
      .stub(UsersModel, "findOne")
      .resolves({
        id: 1,
        username: 'user1',
        role: 'admin',
        email: 'admin@admin.com',
        password: 'secret_admin'
    } as UsersModel);
      
      chaiHttpResponse = await chai.request(app).get('/login/validate')
      .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUwOTExNjEzLCJleHAiOjE2NTYwOTU2MTN9._HI8UvFthcoxTqDJ8LtDP2QU--H-Y_DiwvKNnjDt2SA'});

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.equal('admin');
    });
  });
});

describe('ROTA TEAMS', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamsModel, "findAll")
      .resolves(allTeams as TeamsModel[]);
  });

  after(()=>{
    (TeamsModel.findAll as sinon.SinonStub).restore();
  })

  describe('GET', () => {
    it('(/teams) => verifica se é retornado o array de times', async () => {
      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(allTeams); // deep = igualdade profunda
    });

    it('(/teams) => verifica se retorna array vazio caso os times nao forem encontrados', async () => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(TeamsModel, "findAll")
        .resolves([] as TeamsModel[]);

      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('teams not found');
    });

    it('verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(TeamsModel, "findAll")
        .throws('');

      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });

    it('(/teams/:id) => verifica se é retornado o time pelo seu id', async () => {
      sinon
        .stub(TeamsModel, "findOne")
        .resolves(team as TeamsModel);
      chaiHttpResponse = await chai.request(app).get('/teams/:id').send({
        id: 5,
        teamName: 'Cruzeiro'
      });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(team); // deep = igualdade profunda
    });

    it('(/teams/:id) => verifica se retorna erro caso o time não seja encontrado', async () => {
      (TeamsModel.findOne as sinon.SinonStub).restore();
      sinon
        .stub(TeamsModel, "findOne")
        .resolves(null);
      chaiHttpResponse = await chai.request(app).get('/teams/:id').send({
        id: 17,
        teamName: 'Time Não Encontrado'
      });

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('team not found');
    });

    it('verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (TeamsModel.findOne as sinon.SinonStub).restore();
        
      sinon
      .stub(TeamsModel, "findOne")
      .throws('');

      chaiHttpResponse = await chai.request(app).get('/teams/:id').send({
        id: 5,
        teamName: 'Cruzeiro'
      });

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });
});

describe('ROTA MATCHES', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchesModel, "findAll")
      .resolves( matchesFull as IMatchesCustom[]);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  })

  describe('GET', () => {
    it('(/matches) => verifica se é retornado o array de matches corretamente', async () => {
      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchesFull);
    });

    it('(/matches?inProgress=true) => verifica se é retornado o array de matches: inProgress = true', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();

      sinon
      .stub(MatchesModel, "findAll")
      .resolves(matchesTrue as IMatchesCustom[]);

      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchesTrue);
    });

    it('(/matches?inProgress=false) => verifica se é retornado o array de matches: inProgress = false', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
        
      sinon
      .stub(MatchesModel, "findAll")
      .resolves(matchesFalse as IMatchesCustom[]);

      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchesFalse);
    });

    it('verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
        
      sinon
      .stub(MatchesModel, "findAll")
      .throws('');

      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('POST e PATCH', () => {
    before(async () => {
      sinon
        .stub(MatchesModel, "create")
        .resolves(matchCreatedProgressTrue as MatchesModel);

      sinon
        .stub(MatchesModel, "findOne")
        .resolves({
          id: 43,
          homeTeam: 11,
          homeTeamGoals: 0,
          awayTeam: 10,
          awayTeamGoals: 0,
          inProgress: false
        } as MatchesModel)
    });

    after(() => {
      (MatchesModel.create as sinon.SinonStub).restore();
      (MatchesModel.findOne as sinon.SinonStub).restore();
    });

    it('(/matches) => salva no banco uma partida com o inProgress = true', async () => {
      chaiHttpResponse = await chai.request(app).post('/matches')
        .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'})
        .send({
        homeTeam: 5,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
        inProgress: true
      });
      
      expect(chaiHttpResponse).to.have.status(201);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchCreatedProgressTrue); 
      expect(chaiHttpResponse.body).to.be.keys('id', 'homeTeam', 'awayTeam', 'homeTeamGoals', 'awayTeamGoals', 'inProgress');
      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('(/matches:id/finish) => salva no banco uma partida com o inProgress = false', async () => {     
      chaiHttpResponse = await chai.request(app).patch('/matches/43/finish')
        .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'});
      
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchCreatedProgressFalse); 
      expect(chaiHttpResponse.body).to.be.keys('id', 'homeTeam', 'awayTeam', 'homeTeamGoals', 'awayTeamGoals', 'inProgress');
      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('(/matches:id/finish) => verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findOne as sinon.SinonStub).restore();
        
      sinon
      .stub(MatchesModel, "findOne")
      .throws('');

      chaiHttpResponse = await chai.request(app).patch('/matches/43/finish')
      .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'});

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });

    it('(/matches) => verifica mensagem de erro ao passar times iguais', async () => {     
      chaiHttpResponse = await chai.request(app).post('/matches')
        .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'})
        .send({homeTeam: 5, awayTeam: 5});
      
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('It is not possible to create a match with two equal teams');
    });

    it('(/matches) => verifica mensagem de erro ao passar um time que não existe', async () => {
      (MatchesModel.create as sinon.SinonStub).restore();
      sinon
      .stub(MatchesModel, "create")
      .throws('');

      chaiHttpResponse = await chai.request(app).post('/matches')
        .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'})
        .send({
          homeTeam: 17,
          awayTeam: 18,
          homeTeamGoals: 2,
          awayTeamGoals: 2
        });
      
      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('There is no team with such id!');
    });

    it('(/matches:id) => atualiza uma partida em andamento', async () => {
      (MatchesModel.findOne as sinon.SinonStub).restore();

      sinon
        .stub(MatchesModel, "findOne")
        .resolves({
          id: 40,
          homeTeam: 12,
          homeTeamGoals: 3,
          awayTeam: 8,
          awayTeamGoals: 1,
          inProgress: false
        } as MatchesModel);
        
      chaiHttpResponse = await chai.request(app).patch('/matches/40')
        .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'})
        .send({
          "homeTeamGoals": 3,
          "awayTeamGoals": 1
        });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        id: 40,
        homeTeam: 12,
        homeTeamGoals: 3,
        awayTeam: 8,
        awayTeamGoals: 1,
        inProgress: false
      });
    });

    it('(/matches:id) => verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findOne as sinon.SinonStub).restore();
        
      sinon
      .stub(MatchesModel, "findOne")
      .throws('');

      chaiHttpResponse = await chai.request(app).patch('/matches/40')
      .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMjQxMTgxLCJleHAiOjE2NTY0MjUxODF9.TQ8bv-LTcaWq7XlDToAEFjE0Xfe7R07jcL-7Vvqt8lI'});

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });
});

describe('LEADERBOARD', () => {
  describe('home Leaderboard', () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(MatchesModel, "findAll")
        .resolves(matchCreatedFullProgressFalse as IMatchesCustom[])

      // sinon
      //   .stub(LeaderBoardService, "sortLeaderboard")
      //   .resolves( homeLeaderboard as ILeaderboard[]);
    });

    after(()=>{
      (MatchesModel.findAll as sinon.SinonStub).restore();
    })

    it('(/home) => verifica se é retornado o leaderboard do home', async () => {
      chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderboard);
    });

    it('(/home) => verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(MatchesModel, "findAll")
        .throws('');

      chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('away Leaderboard', () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(MatchesModel, "findAll")
        .resolves(matchCreatedFullProgressFalse as IMatchesCustom[])
    });

    after(()=>{
      (MatchesModel.findAll as sinon.SinonStub).restore();
    })

    it('(/away) => verifica se é retornado o leaderboard do away', async () => {
      chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderboard);
    });

    it('(/away) => verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(MatchesModel, "findAll")
        .throws('');

      chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Leaderboard geral', () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(MatchesModel, "findAll")
        .resolves(matchCreatedFullProgressFalse as IMatchesCustom[])
    });

    after(()=>{
      (MatchesModel.findAll as sinon.SinonStub).restore();
    })

    it('(/) => verifica se é retornado o leaderboard geral', async () => {
      chaiHttpResponse = await chai.request(app).get('/leaderboard');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(leaderboard);
    });

    it('(/) => verifica se retorna mensagem padrão caso erro caia no catch', async () => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(MatchesModel, "findAll")
        .throws('');

      chaiHttpResponse = await chai.request(app).get('/leaderboard');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });
});