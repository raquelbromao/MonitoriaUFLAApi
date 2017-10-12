'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');

module.exports = function(app) {
  var metodosAlun = require('../controllers/AlunoController');
  var metodosProf = require('../controllers/ProfessorController');
  var metodosMon = require('../controllers/MonitoriaController');

  //  MonitoriaApi Routes
  //  Encontra no BD todos os alunos e os lista
  app.get('/', function(req, res) {
    Aluno.find({}, function(err,alunos) {
      if (err) {
        res.json(err);
      } else {
        res.render('index', {"alunos": alunos});
      }
    });
  });

  //  Cria e insere no BD um novo aluno
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

    //  Verifica se não existe aluno com mesma matrícula
    /*Aluno.find({matricula: aluno_cadastro.matricula}, function(err, aluno) {
      if (err) {
        res.json(err);
      } else {
        console.log('Aluno já existente com esta matrícula');
        var erro1 = true;
      }
    });*/

    //  Verifica se não existe aluno com mesmo login/matrícula
    /*Aluno.find({login: aluno_cadastro.login, matricula: aluno_cadastro.matricula}, function(err, aluno) {
      if (err) {
        res.json(err);
      } else {
        console.log('Aluno já existente com este login ou matrícula');
        var erro = true;
      }
    });

    if (erro == true) {
      console.log('Login ou matrícula já existentes!');
    }*/

    //  Salva aluno no BD
    aluno_cadastro.save(function(err, aluno) {
      //  ERRO
      if (err) {
        res.json(err);
      //  SUCESSO
      } else {
        console.log('Aluno cadastrado com sucesso');
        res.redirect('/');
      }
    });
  });

  //  Deleta o aluno da lista com base em seu ID
  app.get('/alunos/deletar/:alunoId', function(req, res) {
    Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
      //  ERRO
      if (err) {
        res.json(err);
      //  SUCESSO
      } else {
        console.log('Aluno deletado com sucesso');
        res.redirect('/');
      }
    });
  });

  //  Edita aluno e salva no BD
  app.get('/alunos/editar/:alunoId', function(req, res) {
      Aluno.find({_id: req.params.alunoId}, function(err, aluno) {
        //  ERRO
        if (err) {
          res.json(err);
        //  SUCESSO
        } else {
          //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
          res.render('edicao', {"aluno": aluno[0]} );
        }
      });
  });

  app.get('/login', function(req, res) {
    //  Verificar se é aluno, professor ou admnistrador
    res.render('login');
    var login_acesso = req.body.login;
    var senha_acesso = req.body.senha;

    Aluno.find({login: login_acesso, matricula: senha_acesso}, function(err, aluno) {
      if (err) {
        res.json(err);
      } else {
        console.log('Login aceito! Permissão concedida!');
        res.redirect('/');
      }
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
