'use strict';

var mongoose = require('mongoose');
var PRG = mongoose.model('PRG');

/**
 * 
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
 * 
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
 * 
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
 * 
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
 * 
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
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.editarPRG = function(req, res) {
  Aluno.findOneAndUpdate({_id: req.params.alunoId}, 
    {nome: req.body.nome, codigo: req.body.codigo , telefone: req.body.codigo, login: req.body.login, senha: req.body.senha}, function(err, membroPRG)  {
      if (err) {
        return console.log(err);
      }
      res.redirect('/adm/prg');
  });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.gerarRelatorio = function(req, res) {
  if (req.params.opcaoId == 'op1') {
    console.log('OPÇÃO 1 DE RELATÓRIO SELECIONADA');
    listarTodasMonitorias(req.params.prgId);
  } else if (req.params.opcaoId == 'op2') {
    console.log('OPÇÃO 2 DE RELATÓRIO SELECIONADA');
  } else if (req.params.opcaoId == 'op3') {
    console.log('OPÇÃO 3 DE RELATÓRIO SELECIONADA');
  } else {
    console.log('OPÇÃO DE RELATÓRIO NÃO EXISTENTE');
    res.status(404).redirect('/IndexPrg/'+req.params.prgId);
  }
};

function listarTodasMonitorias (prgId) {
  console.log(prgId);
  return 0;
};

