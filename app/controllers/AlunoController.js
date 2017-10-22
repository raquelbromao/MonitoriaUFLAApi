'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');

/*
  Lista todos os alunos presentes no BD
*/
exports.listarAlunos = function(req, res) {
  Aluno.find({}, function(err, alunos) {
    if (err) {
      res.json(err);
    } else {
      res.render('adm/alunos', {"alunos": alunos});
    }
  });
};

/*
  Cadastra alunos no BD
*/
exports.cadastraAluno = function(req, res) {
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
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      console.log('Aluno cadastrado com sucesso');
      res.redirect('/adm/alunos');
    }
  });


  /*var erro1 = new Boolean(false);
  var erro2 = new Boolean(false);

  //  Verifica se não existe aluno com mesma matrícula
  Aluno.find({matricula: aluno_cadastro.matricula}, function(err, aluno) {
    if (err) {
      res.json(err);
    } else {
      erro1 = true;
    }
  });

  //  Verifica se não existe aluno com mesmo login
  Aluno.find({login: aluno_cadastro.login}, function(err, aluno) {
    if (err) {
      res.json(err);
    } else {
      console.log('Aluno já existente com este login ou matrícula');
      erro2 = true;
    }
  });*/

    /*if (erro1) {
      console.log('Aluno já existente com esta matrícula');
      res.redirect('/');
    } else if (erro2) {
      console.log('Aluno já existente com este login');
      res.redirect('/');
    } else {
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
    }*/
};

/*
  Deleta aluno do BD
*/
exports.deletarAluno = function(req, res) {
  Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      console.log('Aluno deletado com sucesso');
      res.redirect('/adm/alunos');
    }
  });
};

/*
  Mostra Aluno da edição
*/
exports.mostrarAlunoEdicao = function(req, res) {
  Aluno.find({_id: req.params.alunoId}, function(err, aluno) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
      res.render('edicaoAluno', {"aluno": aluno[0]} );
    }
  });
};

/*
  Edita aluno e salva mudanças no BD
*/
exports.editarAluno = function(req, res) {
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
      res.redirect('/adm/alunos');
  });
};

/*
  Mostra Aluno do index
*/
exports.mostrarAlunoIndex = function(req, res) {
  Aluno.find({_id: req.params.alunoId}, function(err, aluno) {
    //  ERRO
    if (err) {
      res.json(err);
    //  SUCESSO
    } else {
      //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
      res.render('indexAlunos', {"aluno": aluno[0]} );
    }
  });
};

exports.listar_todos_objetos = function(req, res) {
  Aluno.find({}, function(err,alunos) {
    if (err)
      res.send(err);
    res.json(alunos);
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

exports.deletar_objetoID = function(req, res) {
  Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
    if (err)
      res.send(err);
    //res.json({ message: 'Offer Deleted!'});
    console.log('Aluno deletado com sucesso');
    res.redirect('/');
  });
};
