  
# ⚽ O que é a aplicação
 
Desenvolvido enquanto estudante da trybe no módulo de Back-End, foi disponiblizado pela Trybe um front-end já pronto. 
	O projeto é a integração do back com esse front, e ele mostra a classificação de um campeonato de futebol. Nele é possível, editar, atualizar, adicionar e ver o ranking do campeonato, isso se o usuário estiver logado, e com permissão para tal. 

# 🥅 Detalhes da aplicação  
  
A API foi desenvolvida na arquitetura MSC com TypeScript e POO. 

Foi feita com cobertura de testes com mais de 90% utilizando Mocha,Chai e Sinon.

Ela é responsável por:
 -   Criar e manipular um banco de dados para armazenar todos os dados;

 -   Autenticar usuários cadastrados através do login;

 -   Listar clubes cadastrados;   

 -   Listar partidas em andamento e partidas finalizadas;  

 -   Adicionar partidas em andamento;   

 -   Atualizar o placar das partidas em andamento    

 -   Finalizar partidas;  

 -   Gerar leaderboards ranqueadas e ordenadas baseadas no desempenho dos clubes nas partidas cadastradas, utilizando 5 critérios avaliativos e separando em 3 tipos de classificação (geral, mandante e visitante);

 -   Orquestrar tudo isso (banco de dados, backend e frontend) em containers  `Docker`  e executá-los de forma conjunta através de uma orquestração com  `Docker-Compose`.
 
# 💻 Tecnologias Utilizadas
	
Nesse projeto, foram utilizados as tecnologias:
	
 -   Node.js
 -   TypeScript
 -   Object-Oriented Programming (POO)
 -   Express
 -   MySQL
 -   PostgreSQL
 -   Sequelize
 -   Docker
 -   Mocha + Chai + Sinon
 -   Heroku
 
# 🖥️ Aplicação
	
Essa é uma demonstração do projeto
	
![gifpronto](https://user-images.githubusercontent.com/87549119/169073511-1c422faf-1b2c-4bf1-87eb-6d5d3eec1301.gif)

A aplicação pode ser acessada clicando [aqui](https://tfc-front-adadezer.herokuapp.com/leaderboard)

Caso queira logar na aplicação utilize o seguinte usuário:
```
login: admin@admin.com
senha: secret_admin 
```
A API pode ser acessada pela porta  `3001`

Ps: Caso seu navegador tente acessar a página através do protocolo HTTPS e acuse erro, será necessário alterar manualmente a URL para o protocolo HTTP.

# 🤷🏽‍♀️ Como Instalar e Utilizar
	
Caso queira rodar a aplicação localmente certifique-se de ter  [Docker](https://docs.docker.com/get-docker/)  e  [Docker-Compose](https://docs.docker.com/compose/install/)  instalados em sua máquina

Ps: O Docker e Docker-Compose utilizados no desenvolvimento e execução deste projeto estavam nas versões `20.10.13` e `1.29.2` respectivamente. 

Ps²: Verifique a versão do seu Node, a versão usada foi a v16.15.0, caso ocorra algum erro utilize essa versão

1- Abra o terminal, e clone o repositório 
 
 - `git clone git@github.com:Adadezer/tfc-futebol-clube-back.git`.

2- Entre na pasta do repositório que você acabou de clonar:
 - `cd tfc-futebol-clube-back`

 3- Instale as dependências:
 - `npm install`
  
 4- Execute o projeto
 - `npm start`

##
<span >
  <a href="https://www.linkedin.com/in/adadezer-iwazaki/" target="_blank"><img width="110em" src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
</span>
