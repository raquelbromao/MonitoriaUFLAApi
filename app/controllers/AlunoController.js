'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');
var Monitoria = mongoose.model('Monitorias');

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
exports.criarAluno = function(req, res) {
  //  Cria novo objeto Aluno
  var aluno_cadastro = new Aluno();
  //  Salva todos as info da requisição em cada componente de Aluno
  aluno_cadastro.nome = req.body.nome;
  aluno_cadastro.matricula = req.body.matricula;
  aluno_cadastro.telefone = req.body.telefone;
  aluno_cadastro.login = req.body.login;
  aluno_cadastro.senha = req.body.senha;
  aluno_cadastro.nota = req.body.nota;

/**
 * Salva aluno no BD
 */
  aluno_cadastro.save(function(err, aluno) {
    if (err) {
      res.json(err);
    } else {
      console.log('Aluno cadastrado com sucesso');
      res.redirect('/adm/alunos');
    }
  });
};

/*
  Deleta aluno do BD
*/
exports.deletarAluno = function(req, res) {
  Aluno.remove({_id: req.params.alunoId}, function(err, aluno) {
    if (err) {
      res.json(err);
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
    if (err) {
      res.json(err);
    } else {
      //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
      res.render('edicao/edicaoAluno', {"aluno": aluno[0]} );
    }
  });
};

/*
  Edita aluno e salva mudanças no BD
*/
exports.editarAluno = function(req, res) {
  var nome = req.body.nome;
  var matricula = req.body.matricula;
  var telefone = req.body.telefone;
  var login = req.body.login;
  var senha = req.body.senha;
  var nota = req.body.nota;
  var monitorias = req.body.monitorias;

  Aluno.findOneAndUpdate({_id: req.params.alunoId}, {nome, matricula, telefone, login, senha, nota, monitorias}, function(err, aluno)  {
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
  //  Array criado para adicionar as Ids das monitorias no qual o aluno se cadastrou
  var arrayIds = [];

  Aluno.findById({_id: req.params.alunoId}, function(err, aluno) {
    if (err) {
      res.json(err);
    } else {
      //  Percorre o array das monitorias cadastradas pelo aluno
      for (var i = 0; i < aluno.monitorias.length; i++) {
        arrayIds.push(aluno.monitorias[i])
      }

      //  Encontra cada monitoria e adiciona num array
      Monitoria.find({_id:{ $in: arrayIds }}, function(err, monitorias) {
        if (err) {
          res.json(err);
        } else {
          res.render('index/indexAlunos', {"aluno": aluno, "monitorias": monitorias});
        }
      });
    }

  });

};

/*
  Cadastra monitoria em aluno
*/
exports.cadastrarMonitoria = function(req, res) {
  var aluno = req.params.alunoId;
  var monitoria = req.params.monitoriaId;
  console.log('Aluno ID: ' + aluno);
  console.log('Monitoria ID: ' + monitoria);

  //  Encontra monitoria para cadastro
  Monitoria.findById({_id: req.params.monitoriaId}, function(err, monitoria) {
    if (err) {
      res.json(err);
    } else {
      //  Encontra aluno que quer se cadastrar na monitoria e atualiza seu campo Monitorias
      //  com a ID da monitoria desejada
      Aluno.findByIdAndUpdate(
        {_id: req.params.alunoId},
        {$push: {monitorias: req.params.monitoriaId}},
        {safe: true, upsert: true},
        function(err, aluno) {
          if (err) {
            console.log(err);
          } else {
            console.log(aluno.monitorias);
          }
      });
    }
  });

  //  Insere o aluno na lista de alunosInscritos da Monitoria
  /*Monitoria.findByIdAndUpdate(
    {_id: req.params.monitoriaId},
    {$push: {alunosInscritos: req.params.alunoId}},
    {safe: true, upsert: true},
    function(err, monitoria) {
      if (err) {
        console.log(err);
      } else {
        console.log(monitoria.alunosInscritos);
      }
  });*/

    res.redirect('/indexAlunos/' + req.params.alunoId);
};
