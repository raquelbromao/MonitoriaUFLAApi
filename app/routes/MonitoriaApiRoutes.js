'use strict';

//  REQUISITA BD
var mongoose = require('mongoose');
//  EXPORTA TODAS AS COLEÇÕES DO BD
var Aluno = mongoose.model('Alunos');
var Professor = mongoose.model('Professores');
var Monitoria = mongoose.model('Monitorias');

//  EXPORTA TODAS AS FUNÇÕES DE CADA CONTROLLER
module.exports = function(app) {
  var metodosAlun = require('../controllers/AlunoController');
  var metodosProf = require('../controllers/ProfessorController');
  var metodosMon = require('../controllers/MonitoriaController');
  var metodosLog = require('../controllers/LoginController');

  //  ROTAS DA API
  //  Mostra Index
  app.route('/adm')
    .get(function(req, res) {
    res.render('indexAdm');
  });

  //  Mostra alunos e oferece cadastro
  app.route('/adm/alunos')
    //  Encontra no BD todos os alunos e os lista
    .get(metodosAlun.listarAlunos)
    //  Cria e insere no BD um novo aluno
    .post(metodosAlun.criarAluno);

  //  Mostra alunos e oferece cadastro
  app.route('/adm/professores')
    //  Encontra no BD todos os professores e os lista
    .get(metodosProf.listarProfessores)
    //  Cria e insere no BD um novo aluno
    .post(metodosProf.criarProfessor);

  //  Deleta o aluno da lista com base em seu ID
  app.route('/alunos/deletar/:alunoId')
    .get(metodosAlun.deletarAluno);

  //  Edita aluno e salva no BD
  app.route('/alunos/editar/:alunoId')
    //  Coloca aluno em edição
    .get(metodosAlun.mostrarAlunoEdicao)
    //  Altera info do aluno e atualiza no BD
    .post(metodosAlun.editarAluno);

  //  Mostra monitorias e oferece cadastro
  app.route('/adm/monitorias')
    //  Encontra no BD todos as monitorias e as lista
    .get(metodosMon.listarMonitorias)
    //  Cria e insere no BD uma nova monitoria
    .post(metodosMon.criarMonitoria);

  //  Deleta a monitoria da lista com base em seu ID
  app.route('/monitorias/deletar/:monitoriaId')
    .get(metodosMon.deletarMonitoria);

  //  Edita aluno e salva no BD
  app.route('/monitorias/editar/:monitoriaId')
    //  Coloca monitoria em edição
    .get(metodosMon.mostrarMonitoriaEdicao)
    //  Altera info da monitoria e atualiza no BD
    .post(metodosMon.editarMonitoria);

  //  Realiza e autentica Login
  app.route('/login')
    //  Renderiza a página
    .get(function(req, res) {res.render('login');})
    //  Autentica o login e define tipo de usuário
    .post(metodosLog.autenticarLogin);

  //  Index do usuário tipo Aluno
  app.route('/indexAlunos/:alunoId')
    .get(metodosAlun.mostrarAlunoIndex);

  //  Index do usuário tipo Professor
  app.route('/indexProfessores/:professorId')
    .get(metodosProf.mostrarProfIndex);

  //  Pesquisa as monitorias existentes
  app.route('/monitorias/pesquisar/:alunoId')
    .get(metodosMon.pesquisarMonitoria);

  // Cadastra o aluno na monitoria para poder receber notificações e horários próximos
  app.route('/cadastrarMonitoria/:alunoId/:monitoriaId')
    .get(metodosAlun.cadastrarMonitoria);

  /*
    ██████   ██████  ████████  █████  ███████     ██████  ███████ ███████  █████  ██    ██ ██   ████████
    ██   ██ ██    ██    ██    ██   ██ ██          ██   ██ ██      ██      ██   ██ ██    ██ ██      ██
    ██████  ██    ██    ██    ███████ ███████     ██   ██ █████   █████   ███████ ██    ██ ██      ██
    ██   ██ ██    ██    ██    ██   ██      ██     ██   ██ ██      ██      ██   ██ ██    ██ ██      ██
    ██   ██  ██████     ██    ██   ██ ███████     ██████  ███████ ██      ██   ██  ██████  ███████ ██
  */

  /*app.route('/alunos')
    .get(metodosAlun.listar_todos_objetos)
    .post(metodosAlun.criar_objeto);

  app.route('/alunos/:alunoId')
    .get(metodosAlun.ler_objeto)
    .put(metodosAlun.atualizar_objeto)
    .delete(metodosAlun.deletar_objeto);

  app.route('/professores')
    .get(metodosProf.listar_todos_objetos)
    .post(metodosProf.criar_objeto);

  app.route('/professores/:professorId')
    .get(metodosProf.ler_objeto)
    .put(metodosProf.atualizar_objeto)
    .delete(metodosProf.deletar_objeto);

  app.route('/monitorias')
    .get(metodosMon.listar_todos_objetos)
    .post(metodosMon.criar_objeto);

  app.route('/monitorias/:monitoriaId')
    .get(metodosMon.ler_objeto)
    .put(metodosMon.atualizar_objeto)
    .delete(metodosMon.deletar_objeto);*/
};
