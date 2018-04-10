"use strict";

//  REQUISITA BD
var mongoose = require("mongoose");

//  EXPORTA TODAS AS COLEÇÕES DO BD
var Aluno = mongoose.model("Alunos");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");
var Monitoria = mongoose.model("Monitorias");

//  EXPORTA TODAS AS FUNÇÕES DE CADA CONTROLLER
module.exports = function(app) {
  var metodosAlun = require("../controllers/AlunoController");
  var metodosProf = require("../controllers/ProfessorController");
  var metodosMoni = require("../controllers/MonitorController");
  var metodosAtiv = require("../controllers/AtividadeController");
  var metodosMon = require("../controllers/MonitoriaController");
  var metodosLog = require("../controllers/LoginController");

  //  LOGIN

  //  Realiza e autentica Login
  app
    .route("/login")
    .get(function(req, res) {
      res.render("login");
    })
    .post(metodosLog.autenticarLogin);

  //  INDEX
  
  app.route("/adm").get(function(req, res) {
    res.render("index/indexAdm");
  });

  app
    .route("/adm/alunos")
    .get(metodosAlun.listarAlunos)
    .post(metodosAlun.criarAluno);

  app
    .route("/adm/professores")
    .get(metodosProf.listarProfessores)
    .post(metodosProf.criarProfessor);

  app
    .route("/adm/monitores")
    .get(metodosMoni.listarMonitores)
    .post(metodosMoni.criarMonitor);

  app
    .route("/adm/monitorias")
    .get(metodosMon.listarMonitorias)
    .post(metodosMon.criarMonitoria);

  // ALUNO

  app
    .route("/indexAlunos/:alunoId")
    .get(metodosAlun.mostrarAlunoIndex);

  app
    .route("/alunos/editar/:alunoId")
    .get(metodosAlun.mostrarAlunoEdicao)
    .post(metodosAlun.editarAluno);

  app
    .route("/alunos/deletar/:alunoId")
    .get(metodosAlun.deletarAluno);

  app
    .route("/cadastrarMonitoria/:alunoId/:monitoriaId")
    .get(metodosAlun.cadastrarMonitoria);

  //  PROFESSOR

  app
    .route("/indexProfessores/:professorId")
    .get(metodosProf.mostrarProfIndex);

  app
    .route("/professores/editar/:professorId")
    .get(metodosProf.mostrarProfessorEdicao)
    .post(metodosProf.editarProfessor);

  app
    .route("/professores/deletar/:professorId")
    .get(metodosProf.deletarProfessor);

  // MONITOR

  app
    .route("/indexMonitores/:monitorId")
    .get(metodosMoni.mostrarMonitorIndex);

  app
    .route("/monitores/editar/:monitorId")
    .get(metodosMoni.mostrarMonitorEdicao)
    .post(metodosMoni.editarMonitor);

  app
    .route("/monitores/deletar/:monitorId")
    .get(metodosMoni.deletarMonitor);

  //  MONITORIA

  app
    .route("/monitorias/editar/:monitoriaId")
    .get(metodosMon.mostrarMonitoriaEdicao)
    .post(metodosMon.editarMonitoria);

  app
    .route("/monitorias/pesquisar/:alunoId")
    .get(metodosMon.pesquisarMonitoria);

  app
    .route("/monitorias/associarProfessor/:monitoriaId")
    .get(metodosMon.mostrarMonitoriaEdicao)
    .post(metodosMon.editarMonitoria);

  app
    .route("/monitorias/deletar/:monitoriaId")
    .get(metodosMon.deletarMonitoria);

  //  ATIVIDADES DAS MONITORIAS

  app
    .route("/atividades/index/:professorId/:monitoriaId")
    .get(metodosAtiv.listarTarefas);   

  app
    .route("/atividades/cadastrar/:professorId/:monitoriaId")
    .get(metodosAtiv.verPCadastro)
    .post(metodosAtiv.cadastrarAtividade);

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
