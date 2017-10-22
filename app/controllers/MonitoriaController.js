'use strict';

var mongoose = require('mongoose');
var Monitoria = mongoose.model('Monitorias');

/*
  Lista todos as monitorias presentes no BD
*/
exports.listarMonitorias = function(req, res) {
  Monitoria.find({}, function(err, monitorias) {
    if (err) {
      res.json(err);
    } else {
      res.render('adm/monitorias', {"monitorias": monitorias});
    }
  });
};

/*
  Cadastra monitoria no BD
*/
exports.cadastrarMonitoria = function(req, res) {
  //  Cria novo objeto Monitoria
  var novaMonitoria = new Monitoria();
  //  Salva todos as info da requisição em cada componente de Aluno
  novaMonitoria.nome = req.body.nome;
  novaMonitoria.codigo = req.body.codigo;
  //novaMonitoria.alunos = req.body.alunos;
  //novaMonitoria.monitores = req.body.monitores;
  novaMonitoria.oferta = req.body.oferta;
  novaMonitoria.local = req.body.local;
  novaMonitoria.horarios = req.body.horarios;
  novaMonitoria.googlemaps = req.body.googlemaps;

  //  Salva Monitoria no BD
  novaMonitoria.save(function(err, monitoria) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      console.log('Monitoria cadastrada com sucesso');
      res.redirect('/adm/monitorias');
    }
  });
};

/*
  Deleta MONITORIA do BD
*/
exports.deletarMonitoria = function(req, res) {
  Monitoria.remove({_id: req.params.monitoriaId}, function(err, monitoria) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      console.log('Monitoria deletado com sucesso');
      res.redirect('/adm/monitorias');
    }
  });
};

/*
  Mostra Monitoria da edição
*/
exports.mostrarMonitoriaEdicao = function(req, res) {
  Monitoria.find({_id: req.params.monitoriaId}, function(err, monitoria) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
      res.render('edicaoMonitoria', {"monitoria": monitoria[0]} );
    }
  });
};

/*
  Edita monitoria e salva mudanças no BD
*/
exports.editarMonitoria = function(req, res) {
  //  Salva todos as info da requisição em cada componente de Aluno
  var nome = req.body.nome;
  var codigo = req.body.codigo;
  var local = req.body.local;
  var oferta = req.body.oferta;
  var horarios = null;
  var googlemaps = req.body.googlemaps;

  Monitoria.findOneAndUpdate({_id: req.params.monitoriaId}, {nome, codigo, local, oferta, horarios, googlemaps}, function(err, monitoria)  {
      if (err) {
        return console.log(err);
      }
      res.redirect('/adm/monitorias');
  });
};

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
