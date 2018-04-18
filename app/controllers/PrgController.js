'use strict';

var mongoose = require('mongoose');
var PRG = mongoose.model('PRG');

/*
  Lista todos os membros da PRG presentes no BD
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

/*
  Cadastra membros da PRG no BD
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

/*
  Deleta membro da PRG do BD
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

/*
  Mostrar membro da PRG para edição
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

/*
  Edita membro da PRG e salva mudanças no BD
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