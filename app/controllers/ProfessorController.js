"use strict";

const mongoose  = require("mongoose");
const Atividade = mongoose.model("Atividades");
const Professor = mongoose.model("Professores");
const Monitoria = mongoose.model("Monitorias");
const Monitor   = mongoose.model("Monitores");

exports.exibirMonitoriasOrientadas = function(req, res) {
  if (req.session.user) {
    //  Array criado para adicionar as Ids das monitorias no qual o professor é responsável
    var arrayIds = [];

    //  Percorre o array das monitorias 
    for (var i = 0; i < req.session.user.usuario.monitorias.length; i++) {
      arrayIds.push(req.session.user.usuario.monitorias[i]);
    }

    //  Encontra cada monitoria e adiciona num array
    Monitoria.find({_id:{ $in: arrayIds }}, function(err, monitorias) {
      if (err) {
        res.json(err);
      } else {

        if (monitorias == null) {
          res.render('professores/listaMonitorias', {"perfil": req.session.user.perfilUsuario, "monitorias": null});
        }

        res.render('professores/listaMonitorias', {"perfil": req.session.user.perfilUsuario, "monitorias": monitorias});
      }
    });
  } else {
    res.redirect('/login');
  }
};

exports.exibirMonitoria = function(req, res) {
  if (req.session.user) {
     //  Encontra monitoria requisitada
     Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
      if (err) {
        res.json(err);
      } else {

        // Encontra monitor responsável
        Monitor.findById(monitoria.monitorID, function(err, monitor) {
          if (err) {
            res.json(err);
          } else {
            res.render('professores/indexMonitoriaOrientada', {"perfil": req.session.user.perfilUsuario, "monitoria": monitoria, "monitor": monitor});
          }
        });

      }
    });
  } else {
    res.redirect('/login');
  }
};

//TODO:
exports.exibirAtividades = function(req, res) {
  if (req.session.user) {
     //  Encontra monitoria requisitada
     Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
      if (err) {
        res.json(err);
      } else {

      }
    });
  } else {
    res.redirect('/login');
  }
};

exports.exibirPlanoDeTrabalho = function(req, res) {
  if (req.session.user) {
    //  Array criado para adicionar as Ids das atividades vinculadas a monitoria
    var atividadesIds = [];
    //  Flag criada para identificar se já existe plano de trabalho registrado
    var flagPlanoT = false;

    //  Encontra monitoria requisitada
    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
      if (err) {
        res.json(err);
      } else {

        if (monitoria.planoDeTrabalho.length > 0) {
          flagPlanoT = true;

          for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
            atividadesIds.push(monitoria.planoDeTrabalho[i]);
          }

          //  Encontra cada tarefa registrada no Plano de Trabalho
          Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
            if (err) {
                res.json(err);
            } else {
              res.render('professores/planoDeTrabalho', {"perfil": req.session.user.perfilUsuario, "possuiPlano": flagPlanoT, "atividades": atividades, "monitoria": monitoria});
            }
          });
        } else {
          res.render('professores/planoDeTrabalho', {"perfil": req.session.user.perfilUsuario, "possuiPlano": flagPlanoT, "monitoria": monitoria});
        } 

      }
    });
  } else {
    res.redirect('/login');
  }
};

//TODO:
exports.exibirHorarioAtendimento = function(req, res) {
  if (req.session.user) {
     //  Encontra monitoria requisitada
     Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
      if (err) {
        res.json(err);
      } else {

      }
    });
  } else {
    res.redirect('/login');
  }
};

//TODO: Refatorar função
exports.cadastrarAtividadePlano = function(req, res) {
  if (req.session.user) {

  } else {
    res.redirect('/login');
  }
  res.render('professores/cadastroAtividade', {"perfil": req.session.user.perfilUsuario});
};


/*
exports.listarProfessores = function(req, res) {
  Professor.find({}, function(err, professores) {
    if (err) {
      res.json(err);
    } else {
      res.render("adm/professores", { professores: professores });
    }
  });
};

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

          if (monitorias == null) {
            res.render('index/indexProfessores', {"professor": professor, "monitorias": null});
          }

          //console.log(monitorias);
          res.render('index/indexProfessores', {"professor": professor, "monitorias": monitorias});
        }
      });

    }

  });
  
};
*/
