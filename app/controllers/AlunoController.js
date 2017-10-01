'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');
//var Professor = mongoose.model('Professores');
//var Monitoria = mongoose.model('Monitorias');

exports.listar_todos_objetos = function(req, res) {
  Aluno.find({}, function(err,aluno) {
    if (err)
      res.send(err);
    res.json(aluno);
  });
};

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
