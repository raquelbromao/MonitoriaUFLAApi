'use strict';

var mongoose = require('mongoose');
var Monitoria = mongoose.model('Monitorias');

exports.listar_todos_objetos = function(req, res) {
  Monitoria.find({}, function(err,monitoria) {
    if (err)
      res.send(err);
    res.json(monitoria);
  });
};

exports.criar_objeto = function(req, res) {
  var nova_mon = new Monitoria(req.body);
  nova_mon.save(function(err, monitoria) {
    if (err)
      res.send(err);
    res.json(monitoria);
  });
};

exports.ler_objeto = function(req, res) {
  Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
    if (err)
      res.send(err);
    res.json(monitoria);
  });
};

exports.atualizar_objeto = function(req, res) {
  Monitoria.findOneAndUpdate({_id: req.params.monitoriaId}, req.body, {new: true}, function(err, monitoria) {
    if (err)
      res.send(err);
    res.json(monitoria);
  });
};

exports.deletar_objeto = function(req, res) {
  Monitoria.remove({_id: req.params.monitoriaId}, function(err, monitoria) {
    if (err)
      res.send(err);
    res.json({ message: 'Monitoria foi deleteado com sucesso' });
  });
};
