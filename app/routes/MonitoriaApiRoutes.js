'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');

module.exports = function(app) {
  var metodosAlun = require('../controllers/AlunoController');
  var metodosProf = require('../controllers/ProfessorController');
  var metodosMon = require('../controllers/MonitoriaController');


  // todoList Routes
  app.get('/', function(req, res) {
    Aluno.find({}, function(err,alunos) {
      if (err)
        res.json(err);
      res.render('index', { "alunos": alunos });
    });
  });

  app.get('/alunos/deletar/:alunoId', function(req, res) {
    Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
      if (err)
        res.json(err);
      //res.json({ message: 'Offer Deleted!'});
      else
        console.log('Aluno deletado com sucesso');
        res.redirect('/');
    });
  });

  app.post('/', function(req, res) {
    //  Cria novo objeto Aluno
    var aluno_cadastro = new Aluno();
    //  Salva todos as info da requisição em cada componente de Aluno
    aluno_cadastro.nome = req.body.nome;
    aluno_cadastro.matricula = req.body.matricula;
    aluno_cadastro.telefone = req.body.telefone;
    aluno_cadastro.login = req.body.login;
    aluno_cadastro.senha = req.body.senha;
    aluno_cadastro.nota = req.body.nota;
    //  Salva aluno no BD
    aluno_cadastro.save(function(err, aluno) {
      //  ERRO
      if (err)
        res.json(err);
      //  SUCESSO
      else
        console.log('Aluno cadastrado com sucesso');
        res.redirect('/');
    });
  });

  app.route('/alunos')
    .get(metodosAlun.listar_todos_objetos)
    .post(metodosAlun.criar_objeto);

  app.route('/alunos/:alunoId')
    .get(metodosAlun.ler_objeto)
    .put(metodosAlun.atualizar_objeto)
    .delete(metodosAlun.deletar_objeto);

  app.route('/professores')
    .get(metodosProf.listar_todos_objetos)
    .post(metodosProf.criar_objeto);

  app.route('/professores/:professorId')
    .get(metodosProf.ler_objeto)
    .put(metodosProf.atualizar_objeto)
    .delete(metodosProf.deletar_objeto);

  app.route('/monitorias')
    .get(metodosMon.listar_todos_objetos)
    .post(metodosMon.criar_objeto);

  app.route('/monitorias/:monitoriaId')
    .get(metodosMon.ler_objeto)
    .put(metodosMon.atualizar_objeto)
    .delete(metodosMon.deletar_objeto);
};
