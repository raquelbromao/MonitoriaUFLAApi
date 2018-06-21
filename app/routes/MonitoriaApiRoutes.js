"use strict";

module.exports = function(app) {
  var metodosAluno            = require("../controllers/AlunoController");
  var metodosMonitor          = require("../controllers/MonitorController");
  var metodosProfessor        = require("../controllers/ProfessorController");
  var metodosPRG              = require("../controllers/PrgController");
  var metodosMonitoria        = require("../controllers/MonitoriaController");
  var metodosPlanodeMonitoria = require("../controllers/PlanoMonitoriaController");
  var metodosPesquisa         = require("../controllers/pesquisaController");
  var metodosLogin            = require("../controllers/LoginController");
  var metodosPesquisa         = require("../controllers/pesquisaController");
  var metodosErro             = require("../controllers/ErroController");

  //Sessao
  app
    .route("/verSessao")
    .get(function(req, res) {
      res.send(req.session);
    });

  app
    .route("/sessaoAluno")
    .get(function(req, res) {
      if (!req.session.user) {
        res.send('Faça login!');
      } else {
        //res.send('Login feito');
        if (req.session.user.perfilUsuario === 'Aluno') {
          res.send('Autorizado');
        } else {
          res.send('Não autorizado');
        }
      }
    });  

  app
    .route("/logoutSessao")
    .get(function(req, res) {
      req.session.destroy(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send(req.session);
        }
      });
    });

  //  INDEX DO SISTEMA
  app
    .route("/")
    .get(function(req, res) {
      res.render("index/index");
    });

  //  LOGIN
  app
    .route("/login")
    .get(function(req, res) {
      res.render("login");
    })
    .post(metodosLogin.autenticarLogin);
  
  app
    .route("/index")
    .get(metodosLogin.exibirPaginaPrincipal);    

    app
    .route("/logout")
    .get(metodosLogin.sairSistema);  


  // PESQUISA 
  app
    .route("/pesquisarMonitorias")
    .get(function(req, res) {
      if (req.session.user) {
        res.render("pesquisa/pesquisaMonitorias", {"perfil": req.session.user.perfilUsuario, "ID": req.session.user.usuario._id});
      } else {
        res.redirect('/login');
      }
    });

  app
    .route("/pesquisarMonitorias/resultados")
    .get(metodosPesquisa.pesquisarMonitorias);    


  // ALUNO
  app
    .route("/cadastrarMonitoria/:monitoriaId")
    .get(metodosAluno.cadastrarMonitoria);

  app
    .route("/removerCadastro/:monitoriaId")
    .get(metodosAluno.removerCadastroMonitoria); 
    
  app
    .route("/monitoriasCadastradas")
    .get(metodosAluno.listarMonitoriasCadastradas);  

  app
    .route("/monitoriasCadastradas/:monitoriaId")
    .get(metodosAluno.informacaoMonitoriaCadastrada);  

  //  PROFESSOR

  app
    .route("/monitoriasOrientadas")
    .get(metodosProfessor.exibirMonitoriasOrientadas);

  app
    .route("/monitoriaOrientada/:monitoriaId")
    .get(metodosProfessor.exibirMonitoria);
    
  app
    .route("/monitoriaOrientada/:monitoriaId/planoDeTrabalho")
    .get(metodosProfessor.exibirPlanoDeTrabalho);  

  //TODO:  
  app
    .route("/monitoriaOrientada/planoDeTrabalho/editarAtividade/:atividadeId")
    .post();  

  //TODO:  
  app
    .route("/monitoriaOrientada/planoDeTrabalho/excluirAtividade/:atividadeId")
    .get();  
  
  //TODO:  
  app
    .route("/monitoriaOrientada/:monitoriaId/planoDeTrabalho/cadastrarAtividade")
    .get();

  //TODO:  
  app
    .route("/monitoriaOrientada/:monitoriaId/atividades")
    .get();  
  
  //TODO:  
  app
    .route("/monitoriaOrientada/:monitoriaId/atividades/pesquisar")
    .get();   
    
    

  /*app
    .route("/professores/editar/:professorId")
    .get(metodosProfessor.mostrarProfessorEdicao)
    .post(metodosProfessor.editarProfessor);

  app
    .route("/professores/deletar/:professorId")
    .get(metodosProfessor.deletarProfessor);*/

  
  // PRG  
  app
    .route("/relatorios")
    .get(); 
    
  app
    .route("/relatorio/:relatorioId")
    .get();  
      
  // MONITOR
  app
    .route("/monitoriaVigente")
    .get(metodosMonitor.exibirMonitoriaVigente)

  app
    .route("/monitoriaVigente/planoDeTrabalho")  
    .get(metodosMonitor.exibirPlanoDeTrabalho);

  app
    .route("/monitoriaVigente/atividades") 
    .get(metodosMonitor.exibirAtividades);
  
  app
    .route("/monitoriaVigente/atividades/pesquisar") 
    .post(metodosMonitor.pesquisarAtividades);  

  app
    .route("/monitoriaVigente/atividades/registrarAtividade")
    .get(metodosMonitor.exibirCadastroAtividade)
    .post(metodosMonitor.registrarAtividade);   
  
  app
    .route("/monitoriaVigente/atividades/excluirAtividade/:atividadeRegistradaId")
    .get(metodosMonitor.excluirAtividade);  
    
  app
    .route("/monitoriaVigente/horarioAtendimento")
    .get(metodosMonitor.exibirHorarioDeAtendimento);
  
  //  MONITORIA
  app
    .route("/monitorias/editar/:monitoriaId")
    .get(metodosMonitoria.mostrarMonitoriaEdicao)
    .post(metodosMonitoria.editarMonitoria);

  app
    .route("/monitorias/informacoes/:monitoriaId")
    .get(metodosMonitoria.informacoesMonitoria);
  
  app
    .route("/monitorias/criarHorarioDeAtendimento/:professorId/:monitoriaId")
    .get(metodosMonitoria.mostrarCadastroHorario)
    .post(metodosMonitoria.cadastrarHorarioMonitor);

    app
    .route("/monitorias/HorarioDeAtendimento/:professorId/:monitoriaId/:horarioId")
    .get(metodosMonitoria.mostrarHorarioDeAtendimento);

  //  PLANO DE TRABALHO DAS MONITORIAS E ATIVIDADES REGISTRADAS PELOS MONITORES
  app
    .route("/planoMonitoria/index/:professorId/:monitoriaId")
    .get(metodosPlanodeMonitoria.listarAtividades);   

  app
    .route("/planoMonitoria/cadastrarAtividade/:professorId/:monitoriaId")
    .get(metodosPlanodeMonitoria.verPCadastro)
    .post(metodosPlanodeMonitoria.cadastrarAtividade);

  app
    .route("/planoMonitoria/excluirAtividade/:professorId/:monitoriaId/:atividadeId")  
    .get(metodosPlanodeMonitoria.excluirAtividade);
  
  app
    .route("/planoMonitoria/editarAtividade/:professorId/:monitoriaId/:atividadeId")  
    .get(metodosPlanodeMonitoria.mostrarAtivEdicao)
    .post(metodosPlanodeMonitoria.editarAtividade);

  app
    .route("/planoMonitoria/registrarAtividade/:monitorId/:monitoriaId")
    .get(metodosPlanodeMonitoria.mostrarPaginaAtivRegistro)
    .post(metodosPlanodeMonitoria.registrarAtividade);

  app
    .route("/planoMonitoria/excluirAtividadeRegistrada/:monitorId/:monitoriaId/:atividadeRegistradaId")
    .get(metodosPlanodeMonitoria.excluirAtivRegM);

    app
    .route("/planoMonitoria/excluirAtividadeRegistradaP/:professorId/:monitoriaId/:atividadeRegistradaId")
    .get(metodosPlanodeMonitoria.excluirAtivRegP);  

  app
    .route("/testes")
    .get(metodosPlanodeMonitoria.testarString);  
 
  //  ERROS

  app
    .route("/erro/:erroId")
    .post(metodosErro.reportarErro);

  // TESTES  

  app 
    .route("/teste/dataAtividade")
    .get();  
};