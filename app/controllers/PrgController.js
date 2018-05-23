'use strict';

var mongoose = require('mongoose');
var PRG = mongoose.model('PRG');
var Professor = mongoose.model('Professores');
var Monitor = mongoose.model('Monitores');
var Monitoria = mongoose.model('Monitorias');

/**
 * Lista os usuários do tipo PRG
 * @param {*} req 
 * @param {*} res 
 */
exports.listarPRG = function(req, res) {
  PRG.find({}, function(err, membrosPRG) {
    if (err) {
      res.json(err);
    } else {
      res.render('adm/prg', {"membrosPRG": membrosPRG});
    }
  });
};

/**
 * Cria e insere o usuário do tipo PRG no BD
 * @param {*} req 
 * @param {*} res 
 */
exports.criarPRG = function(req, res) {
  //    Cria novo objeto PRG
  var prg_cadastro = new PRG();
  
  //    Salva todos as info da requisição em cada componente de Aluno
  prg_cadastro.nome = req.body.nome;
  prg_cadastro.codigo = req.body.codigo;
  prg_cadastro.telefone = req.body.telefone;
  prg_cadastro.login = req.body.login;
  prg_cadastro.senha = req.body.senha;

  //    Salva membro da PRG no BD
  prg_cadastro.save(function(err, membroPRG) {
    if (err) {
      res.json(err);
    } else {
      console.log('Membro da PRG cadastrado com sucesso');
      res.redirect('/adm/prg');
    }
  });
};

/**
 * Deleta o usuário do tipo PRG do BD
 * @param {*} req 
 * @param {*} res 
 */
exports.deletarPRG = function(req, res) {
  PRG.remove({_id: req.params.prgId}, function(err, membroPRG) {
    if (err) {
      res.json(err);
    } else {
      console.log('Membro da PRG deletado com sucesso');
      res.redirect('/adm/prg');
    }
  });
};

/**
 * Exibe a página index do usuário tipo PRG
 * @param {*} req 
 * @param {*} res 
 */
exports.mostrarPRGIndex = function(req, res) {
  PRG.findById({_id: req.params.prgId}, function(err, prg) {
    if (err) {
      res.json(err);
    }
    res.render('index/indexPRG', {"prg": prg});
  });
};

/**
 * Mostra página de edição de info do usuário tipo PRG
 * @param {*} req 
 * @param {*} res 
 */
exports.mostrarPRGEdicao = function(req, res) {
  PRG.find({_id: req.params.prgId}, function(err, membroPRG) {
    if (err) {
      res.json(err);
    } else {
      res.render('edicao/edicaoPRG', {"membroPRG": membroPRG[0]} );
    }
  });
};

/**
 * Edita informações do usuário tipo PRG
 * @param {*} req 
 * @param {*} res 
 */
exports.editarPRG = function(req, res) {
  PRG.findOneAndUpdate({_id: req.params.alunoId}, 
    {nome: req.body.nome, codigo: req.body.codigo , telefone: req.body.codigo, login: req.body.login, senha: req.body.senha}, function(err, membroPRG)  {
      if (err) {
        return console.log(err);
      }
      res.redirect('/adm/prg');
  });
};

/**
 * Gera os relatórios para a PRG
 * @param {*} req 
 * @param {*} res 
 */
exports.gerarRelatorio = function(req, res) {
  //  OPÇÃO 1 DE RELATÓRIO: Listar Todas as Monitorias Vigentes
  if (req.params.opcaoId == 'op1') {
    Monitoria.find({}, function(err, monitorias) {
      if (err) {
        res.json(err);
      } 
      res.render('relatorios/listagemDeMonitorias', {"monitorias": monitorias})
    });
  
  //  OPÇÃO 2 DE RELATÓRIO: Listar Todas as Monitorias de Mesmas Disciplinas 
  //  -> TERMINAR TERMINAR TERMINAR TERMINAR TERMINAR TERMINAR TERMINAR TERMINAR 
  } else if (req.params.opcaoId == 'op2') {
    Monitoria.find({nomeDisciplina: req.body.nomeDisciplina}, function(err, monitorias) {
      if (err) {
        res.json(err);
      } 
      //res.render('relatorios/listagemDeMonitorias', {"monitorias": monitorias})
    });

  //  OPÇÃO 3 DE RELATÓRIO: Listar Todos os Orientadores  
  } else if (req.params.opcaoId == 'op3') {
    Professor.find({}, function(err, professores) {
      if (err) {
        res.json(err);
      } 
      res.render('relatorios/listagemDeOrientadores', {"professores": professores})
    });

  //  OPÇÃO 4 DE RELATÓRIO: Listar Todos os Monitores  
  } else if (req.params.opcaoId == 'op4') {
    Monitor.find({}, function(err, monitores) {
      if (err) {
        res.json(err);
      } 
      res.render('relatorios/listagemdeMonitores', {"monitores": monitores})
    });

  } else {
    console.log('OPÇÃO DE RELATÓRIO NÃO EXISTENTE');
    res.status(404).redirect('/IndexPrg/'+req.params.prgId);
  }
};