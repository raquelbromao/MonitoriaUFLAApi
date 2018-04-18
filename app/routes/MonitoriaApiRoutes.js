"use strict";

//  REQUISITA BD
var mongoose = require("mongoose");

//  EXPORTA TODAS AS COLEÇÕES DO BD
var Aluno     = mongoose.model("Alunos");
var Professor = mongoose.model("Professores");
var Monitor   = mongoose.model("Monitores");
var Monitoria = mongoose.model("Monitorias");

//  EXPORTA TODAS AS FUNÇÕES DE CADA CONTROLLER
module.exports = function(app) {
  var metodosAlun = require("../controllers/AlunoController");
  var metodosProf = require("../controllers/ProfessorController");
  var metodosPRG = require("../controllers/PrgController");
  var metodosMoni = require("../controllers/MonitorController");
  var metodosPlano = require("../controllers/PlanoMonitoriaController");
  var metodosMon  = require("../controllers/MonitoriaController");
  var metodosLog  = require("../controllers/LoginController");

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
    .route("/adm/prg")
    .get(metodosPRG.listarPRG)
    .post(metodosPRG.criarPRG);  

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


  // PRG
   
  // A SER FEITO
   
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

  //  PLANO DE TRABALHO DAS MONITORIAS E ATIVIDADES

  app
    .route("/planoMonitoria/index/:professorId/:monitoriaId")
    .get(metodosPlano.listarAtividades);   

  app
    .route("/planoMonitoria/cadastrarAtividade/:professorId/:monitoriaId")
    .get(metodosPlano.verPCadastro)
    .post(metodosPlano.cadastrarAtividade);

  app
    .route("/planoMonitoria/excluirAtividade/:professorId/:monitoriaId/:atividadeId")  
    .get(metodosPlano.excluirAtividade);
  
  app
    .route("/planoMonitoria/editarAtividade/:professorId/:monitoriaId/:atividadeId")  
    .get(metodosPlano.mostrarAtivEdicao)
    .post(metodosPlano.editarAtividade);

  app
    .route("/planoMonitoria/registrarAtividade/:monitorId/:monitoriaId")
    .get(metodosPlano.mostrarPaginaAtivRegistro)
    .post(metodosPlano.registrarAtividade);

  app
    .route("/planoMonitoria/excluirAtividadeRegistrada/:monitorId/:monitoriaId/:atividadeRegistradaId")
    .get(metodosPlano.excluirAtivReg);
 
  //  ERROS
  
  /*app
    .route("/err/:erroId")
    .get();*/
};