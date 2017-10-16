'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');
var Professor = mongoose.model('Professores');

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
    Aluno.findOne({matricula: aluno_cadastro.matricula}, function(err, aluno) {
      if (err) {
        res.json(err);
      } else {
        console.log('Aluno já existente com esta matrícula');
      }
    });

    //  Verifica se não existe aluno com mesmo login/matrícula
    Aluno.findOne({login: aluno_cadastro.login, matricula: aluno_cadastro.matricula}, function(err, aluno) {
      if (err) {
        res.json(err);
      } else {
        console.log('Aluno já existente com este login ou matrícula');
      }
    });

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

  app.post('/alunos/editar/:alunoId', function(req, res) {
    //  Salva todos as info da requisição em cada componente de Aluno
    var nome = req.body.nome;
    var matricula = req.body.matricula;
    var telefone = req.body.telefone;
    var login = req.body.login;
    var senha = req.body.senha;
    var nota = req.body.nota;

    Aluno.findOneAndUpdate({_id: req.params.alunoId}, {nome, matricula, telefone, login, senha, nota}, function(err, aluno)  {
        if (err) {
          return console.log(err);
        }
        res.redirect('/');
    });
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', function(req, res) {
    var tipo_usuario = req.body.tipo
    var login_acesso = req.body.login;
    var senha_acesso = req.body.senha;
    var erro;

    //  Analisa tipo de usuário que requeriu entrada no sistema
    if (tipo_usuario === 'aluno') {
      console.log('[Usuário] Aluno identificado. Analisando Permissão...');
      //  VERIFICA SE ALUNO EXISTE PELO LOGIN
      Aluno.findOne({login: login_acesso}, function(err,aluno) {
        if (err) {
          console.log(err);
          res.redirect('/login');
        } else if (aluno === null) {
          console.log('Login não encontrado no banco de dados!');
          res.redirect('/login');
        } else {
          console.log('Login aceito');
          console.log(aluno);
          //  VERIFICA A SENHA CASO O LOGIN SEJA ACEITO (ENCONTRADO)
          if (aluno.senha === senha_acesso) {
            console.log('Senha aceita!');
            res.redirect('/');
          } else {
            console.log('Senha não aceita!');
            res.redirect('/login');
          }
        }
      });
    } else if (tipo_usuario === 'professor') {
      console.log('[Usuário] Professor identificado. Analisando Permissão...');
      //  VERIFICA SE ALUNO EXISTE PELO LOGIN
      Professor.findOne({login: login_acesso}, function(err,professor) {
        if (err) {
          console.log(err);
          res.redirect('/login');
        } else if (professor === null) {
          console.log('Login não encontrado no banco de dados!');
          res.redirect('/login');
        } else {
          console.log('Login aceito');
          console.log(professor);
          //  VERIFICA A SENHA CASO O LOGIN SEJA ACEITO (ENCONTRADO)
          if (professor.senha === senha_acesso) {
            console.log('Senha aceita!');
            res.redirect('/');
          } else {
            console.log('Senha não aceita!');
            res.redirect('/login');
          }
        }
      });
    } else if (tipo_usuario === 'prg') {
      console.log('[Usuário] PRG identificado. Analisando Permissão...');
    } else {
      console.log('Tipo de usuário não identificado!');
    }
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
