'use strict';

var mongoose = require('mongoose');
var Professor = mongoose.model('Professores');

/*
  Lista todos os professores presentes no BD
*/
exports.listarProfessores = function(req, res) {
  Professor.find({}, function(err, professores) {
    if (err) {
      res.json(err);
    } else {
      res.render('adm/professores', {"professores": professores});
    }
  });
};

/*
  Cadastra professores no BD
*/
exports.criarProfessor = function(req, res) {
  //  Cria novo objeto Aluno
  var professor_cadastro = new Professor();
  //  Salva todos as info da requisição em cada componente de Aluno
  professor_cadastro.nome = req.body.nome;
  professor_cadastro.codigo = req.body.codigo;
  professor_cadastro.telefone = req.body.telefone;
  professor_cadastro.login = req.body.login;
  professor_cadastro.senha = req.body.senha;

  //  Salva professor no BD
  professor_cadastro.save(function(err, professor) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      console.log('Professor cadastrado com sucesso');
      res.redirect('/adm/professores');
    }
  });
};


/*
  Mostra Professor do index
*/
exports.mostrarProfIndex = function(req, res) {
  //  Array criado para adicionar as Ids das monitorias no qual o professor é responsável
  var arrayIds = [];
  //  Encontra professor que requisitou o login
  Professor.findById({_id: req.params.professorId}, function(err, professor) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      res.render('indexProfessores', {"professor": professor});
    }
  });
};

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
