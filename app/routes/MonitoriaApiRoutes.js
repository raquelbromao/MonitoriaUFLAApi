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
  var metodosAlun  = require("../controllers/AlunoController");
  var metodosProf  = require("../controllers/ProfessorController");
  var metodosPRG   = require("../controllers/PrgController");
  var metodosMoni  = require("../controllers/MonitorController");
  var metodosPlano = require("../controllers/PlanoMonitoriaController");
  var metodosMon   = require("../controllers/MonitoriaController");
  var metodosLog   = require("../controllers/LoginController");
  var metodosErr   = require("../controllers/ErroController");
  var metodosADM   = require("../controllers/admController");

  //  TESTES DOS TOKENS
  app
    .route("/tokenLogin")
    .post(metodosADM.realizarLogin);

  app
    .route("/rotaProtegida")
    .post(metodosADM.verficarToken, metodosADM.enviarDados);  

  //  INDEX DO SISTEMA
  app
    .route("/")
    .get(function(req, res) {
      res.render("index/index");
    })

  //  LOGIN
  app
    .route("/login")
    .get(function(req, res) {
      res.render("login");
    })
    .post(metodosLog.autenticarLogin);

  //  ADMINISTRADOR
  
  app.route("/adm").get(function(req, res) {
    res.render("index/indexAdm");
  });

  app 
    .route("/adm/criptografarSenha/:tipoUsuario/:ID")
    .post(metodosADM.criptografarSenha.bind(metodosADM));

  app
    .route("/adm/alunos")
    .get(metodosAlun.listarAlunos)
    .post(metodosAlun.criarAluno);

  app 
    .route("/adm/discentes/cadastrarLote")
    .post(metodosADM.cadastrarDiscentesEmLote);      

  app
    .route("/adm/professores")
    .get(metodosProf.listarProfessores)
    .post(metodosProf.criarProfessor);

  app 
    .route("/adm/docentes/cadastrarLote/:Departamento")
    .post(metodosADM.cadastrarDocentesEmLote.bind(metodosADM));

    app
    .route("/adm/prg")
    .get(metodosPRG.listarPRG)
    .post(metodosPRG.criarPRG);  

  app
    .route("/adm/monitores")
    .get(metodosMoni.listarMonitores)
    .post(metodosMoni.criarMonitor);

  app 
    .route("/adm/monitores/cadastrarLote")
    .post(metodosADM.cadastrarMonitoresEmLote);    

  app
    .route("/adm/monitorias")
    .get(metodosMon.listarMonitorias)
    .post(metodosMon.criarMonitoria);

  app 
    .route("/adm/monitorias/cadastrarLote/:Departamento")
    .post(metodosADM.cadastrarMonitoriasEmLote.bind(metodosADM));      

  app 
    .route("/adm/monitorias/cadastrarLote")
    .post(metodosADM.cadastrarMonitoriasEmLote); 
    
  app 
    .route("/adm/relatorios/teste")
    .post(metodosADM.testarGerarRelatorio.bind(metodosADM));      

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

  app 
    .route("/IndexPrg/:prgId")
    .get(metodosPRG.mostrarPRGIndex);

  app
    .route("/prg/editar/:prgId")
    .get()
    .post();
    
  app
    .route("/prg/relatorios/:prgId/:opcaoId")
    .get(metodosPRG.gerarRelatorio);  
   
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
  
  app
    .route("/monitores/infoMonitoria/:monitorId/:monitoriaId")
    .get(metodosMoni.mostrarDetalhesMonitoria);  

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
  
  app
    .route("/monitorias/criarHorarioDeAtendimento/:professorId/:monitoriaId")
    .get(metodosMon.mostrarCadastroHorario)
    .post(metodosMon.cadastrarHorarioMonitor);

    app
    .route("/monitorias/HorarioDeAtendimento/:professorId/:monitoriaId/:horarioId")
    .get(metodosMon.mostrarHorarioDeAtendimento);

  //  PLANO DE TRABALHO DAS MONITORIAS E ATIVIDADES REGISTRADAS PELOS MONITORES

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
    .get(metodosPlano.excluirAtivRegM);

    app
    .route("/planoMonitoria/excluirAtividadeRegistradaP/:professorId/:monitoriaId/:atividadeRegistradaId")
    .get(metodosPlano.excluirAtivRegP);  

  app
    .route("/testes")
    .get(metodosPlano.testarString);  
 
  //  ERROS
  
  app
    .route("/err/:erroId")
    .post(metodosErr.reportarErro);
};