'use strict';

var mongoose = require('mongoose');
var Professor = mongoose.model('Professores');

exports.listar_todos_objetos = function(req, res) {
  Professor.find({}, function(err,professor) {
    if (err)
      res.send(err);
    res.json(professor);
  });
};

exports.criar_objeto = function(req, res) {
  var novo_prof = new Professor(req.body);
  novo_prof.save(function(err, professor) {
    if (err)
      res.send(err);
    res.json(professor);
  });
};

exports.ler_objeto = function(req, res) {
  Professor.findById(req.params.professorId, function(err, professor) {
    if (err)
      res.send(err);
    res.json(professor);
  });
};

exports.atualizar_objeto = function(req, res) {
  Professor.findOneAndUpdate({_id: req.params.professorId}, req.body, {new: true}, function(err, professor) {
    if (err)
      res.send(err);
    res.json(professor);
  });
};

exports.deletar_objeto = function(req, res) {
  Professor.remove({_id: req.params.professorId}, function(err, professor) {
    if (err)
      res.send(err);
    res.json({ message: 'Professor foi deleteado com sucesso' });
  });
};
