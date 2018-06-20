"use strict";

module.exports = function(app) {
  //var metodosAluno      = require("../controllers/AlunoController");
  //var metodosMonitor    = require("../controllers/MonitorController");
  //var metodosProfessor  = require("../controllers/ProfessorController");
  //var metodosPRG        = require("../controllers/PrgController");
  //var metodosMonitoria  = require("../controllers/MonitoriaController");
  //var metodosADM        = require("../controllers/admController");
  var metodosRelatorios = require("../controllers/pdfController");
  
  /*
  app.route("/adm").get(function(req, res) {
    res.render("index/indexAdm");
  });

  app 
    .route("/adm/criptografarSenha/:tipoUsuario/:ID")
    .get(metodosADM.criptografarSenha.bind(metodosADM));

  app
    .route("/adm/alunos")
    .get(metodosAluno.listarAlunos)
    .post(metodosAluno.criarAluno);

  app 
    .route("/adm/discentes/cadastrarLote")
    .post(metodosADM.cadastrarDiscentesEmLote);      

  app
    .route("/adm/professores")
    .get(metodosProfessor.listarProfessores)
    .post(metodosProfessor.criarProfessor);

  app 
    .route("/adm/docentes/cadastrarLote/:Departamento")
    .post(metodosADM.cadastrarDocentesEmLote.bind(metodosADM));

    app
    .route("/adm/prg")
    .get(metodosPRG.listarPRG)
    .post(metodosPRG.criarPRG);  

  app
    .route("/adm/monitores")
    .get(metodosMonitor.listarMonitores)
    .post(metodosMonitor.criarMonitor);

  app 
    .route("/adm/monitores/cadastrarLote")
    .post(metodosADM.cadastrarMonitoresEmLote);    

  app
    .route("/adm/monitorias")
    .get(metodosMonitoria.listarMonitorias)
    .post(metodosMonitoria.criarMonitoria);

  app 
    .route("/adm/monitorias/cadastrarLote/:Departamento")
    .post(metodosADM.cadastrarMonitoriasEmLote.bind(metodosADM)); 
*/    
  app
    .route("/adm/gerarRelatorio/:monitoriaId/:professorId")  
    .get(metodosRelatorios.gerarHTML);

}