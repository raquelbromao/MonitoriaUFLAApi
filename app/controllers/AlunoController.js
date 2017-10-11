'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');

/*
  Lista todos os objetos do BD da coleção Alunos
*/
exports.listar_todos_objetos = function(req, res) {
  Aluno.find({}, function(err,alunos) {
    if (err)
      res.send(err);
    res.json(alunos);
  });
};

/*
  Cria objetos do tipo ALuno
*/
exports.criar_objeto = function(req, res) {
  var new_task = new Aluno(req.body);
  new_task.save(function(err, aluno) {
    if (err)
      res.send(err);
    res.json(aluno);
  });
};

exports.ler_objeto = function(req, res) {
  Aluno.findById(req.params.alunoId, function(err, aluno) {
    if (err)
      res.send(err);
    res.json(aluno);
  });
};

exports.atualizar_objeto = function(req, res) {
  Aluno.findOneAndUpdate({_id: req.params.alunoId}, req.body, {new: true}, function(err, aluno) {
    if (err)
      res.send(err);
    res.json(aluno);
  });
};

exports.deletar_objeto = function(req, res) {
  Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
    if (err)
      res.send(err);
    res.json({ message: 'Aluno foi deletado com sucesso' });
  });
};

exports.deletar_objetoID = function(req, res) {
  Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
    if (err)
      res.send(err);
    //res.json({ message: 'Offer Deleted!'});
    console.log('Aluno deletado com sucesso');
    res.redirect('/');
  });
};

exports.lista_alunos = function(req, res) {
  Aluno.find({}, function(err, alunos) {
    if (err)
      res.send(err);
    callback(err, alunos);
  });
};
