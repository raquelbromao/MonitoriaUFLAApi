"use strict";

var mongoose = require("mongoose");
var Professor = mongoose.model("Professores");
var Monitoria = mongoose.model('Monitorias');


/*
  Lista todos os professores presentes no BD
*/
exports.listarProfessores = function(req, res) {
  Professor.find({}, function(err, professores) {
    if (err) {
      res.json(err);
    } else {
      res.render("adm/professores", { professores: professores });
    }
  });
};

/*
  Cadastra professores no BD
*/
exports.criarProfessor = function(req, res) {
  var professor_cadastro = new Professor();

  professor_cadastro.nome = req.body.nome;
  professor_cadastro.codigo = req.body.codigo;
  professor_cadastro.telefone = req.body.telefone;
  professor_cadastro.login = req.body.login;
  professor_cadastro.senha = req.body.senha;

  professor_cadastro.save(function(err, professor) {
    if (err) {
      res.json(err);
    } else {
      console.log("Professor cadastrado com sucesso");
      res.redirect("/adm/professores");
    }
  });
};

/*
  Deleta Professor do BD
*/
exports.deletarProfessor = function(req, res) {
  Professor.remove({ _id: req.params.professorId }, function(err, professor) {
    if (err) {
      res.json(err);
    } else {
      console.log("Professor deletado com sucesso");
      res.redirect("/adm/professores");
    }
  });
};

/*
  Mostra Professor da edição
*/
exports.mostrarProfessorEdicao = function(req, res) {
  Professor.find({ _id: req.params.professorId }, function(err, professor) {
    if (err) {
      res.json(err);
    } else {
      //  parametro aluno é um array de alunos, então para pegar um único se acessa a posição 0
      res.render("edicao/edicaoProfessor", { professor: professor[0] });
    }
  });
};

/*
  Edita Professor e salva mudanças no BD
*/
exports.editarProfessor = function(req, res) {
  var nome = req.body.nome;
  var codigo = req.body.codigo;
  var telefone = req.body.telefone;
  var login = req.body.login;
  var senha = req.body.senha;

  Professor.findOneAndUpdate(
    { _id: req.params.professorId },
    { nome, codigo, telefone, login, senha },
    function(err, professor) {
      if (err) {
        return console.log(err);
      }
      res.redirect("/adm/professores");
    }
  );
};

/*
  Mostra Professor do index
*/
exports.mostrarProfIndex = function(req, res) {
  //  Array criado para adicionar as Ids das monitorias no qual o professor é responsável
  var arrayIds = [];

  Professor.findById({ _id: req.params.professorId }, function(err, professor) {
    if (err) {
      res.json(err);
    } else {
      //  Percorre o array das monitorias 
      for (var i = 0; i < professor.monitorias.length; i++) {
        arrayIds.push(professor.monitorias[i]);
      }

      //  Encontra cada monitoria e adiciona num array
      Monitoria.find({_id:{ $in: arrayIds }}, function(err, monitorias) {
        if (err) {
          res.json(err);
        } else {

          if(monitorias == null) {
            res.render('index/indexProfessores', {"professor": professor, "monitorias": null});
          }
          //console.log(monitorias);
          //console.log(professor);
          res.render('index/indexProfessores', {"professor": professor, "monitorias": monitorias});
        }
      });

    }

  });
  
};

exports.listar_todos_objetos = function(req, res) {
  Professor.find({}, function(err, professor) {
    if (err) res.send(err);
    res.json(professor);
  });
};

exports.criar_objeto = function(req, res) {
  var novo_prof = new Professor(req.body);
  novo_prof.save(function(err, professor) {
    if (err) res.send(err);
    res.json(professor);
  });
};

exports.ler_objeto = function(req, res) {
  Professor.findById(req.params.professorId, function(err, professor) {
    if (err) res.send(err);
    res.json(professor);
  });
};

exports.atualizar_objeto = function(req, res) {
  Professor.findOneAndUpdate(
    { _id: req.params.professorId },
    req.body,
    { new: true },
    function(err, professor) {
      if (err) res.send(err);
      res.json(professor);
    }
  );
};

exports.deletar_objeto = function(req, res) {
  Professor.remove({ _id: req.params.professorId }, function(err, professor) {
    if (err) res.send(err);
    res.json({ message: "Professor foi deleteado com sucesso" });
  });
};
