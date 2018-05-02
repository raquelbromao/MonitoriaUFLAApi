"use strict";

var mongoose = require("mongoose");
var Monitor = mongoose.model("Monitores");
var Atividade = mongoose.model("Atividades");
var AtividadeRegistrada = mongoose.model("AtividadesRegistradas");
var Monitoria = mongoose.model("Monitorias");

/*
  Lista todos os alunos presentes no BD
*/
exports.listarMonitores = function(req, res) {
  Monitor.find({}, function(err, monitores) {
    if (err) {
      res.json(err);
    } else {
      res.render("adm/monitores", { monitores: monitores });
    }
  });
};

/*
  Cadastra monitores no BD
*/
exports.criarMonitor = function(req, res) {
  //  Cria novo objeto Monitor
  var monitor_cadastro = new Monitor();

  //  Salva todos as info da requisição em cada componente de Monitor
  monitor_cadastro.nome = req.body.nome;
  monitor_cadastro.matricula = req.body.matricula;
  monitor_cadastro.login = req.body.login;
  monitor_cadastro.senha = req.body.senha;

  monitor_cadastro.save(function(err, monitor) {
    if (err) {
      res.json(err);
    } else {
      console.log("Monitor cadastrado com sucesso");
      res.redirect("/adm/monitores");
    }
  });
};

/*
  Deleta aluno do BD
*/
exports.deletarMonitor = function(req, res) {
  Monitor.remove({ _id: req.params.monitorId }, function(err, monitor) {
    if (err) {
      res.json(err);
    } else {
      console.log("Monitor deletado com sucesso");
      res.redirect("/adm/monitores");
    }
  });
};

/*
  Mostra Monitor da edição
*/
exports.mostrarMonitorEdicao = function(req, res) {
  Monitor.find({ _id: req.params.monitorId }, function(err, monitor) {
    if (err) {
      res.json(err);
    } else {
      //  parametro monitor é um array de monitores, então para pegar um único se acessa a posição 0
      res.render("edicao/edicaoMonitor", { monitor: monitor[0] });
    }
  });
};

/*
  Edita monitor e salva mudanças no BD
*/
exports.editarMonitor = function(req, res) {
  var nome = req.body.nome;
  var matricula = req.body.matricula;
  var login = req.body.login;
  var senha = req.body.senha;

  Monitor.findOneAndUpdate(
    { _id: req.params.monitorId },
    { nome, matricula, login, senha },
    function(err, monitor) {
      if (err) {
        return console.log(err);
      }
      res.redirect("/adm/monitores");
    }
  );
};

/*
  Mostra Monitor do index
*/
exports.mostrarMonitorIndex = function(req, res) {
  //  Array criado para adicionar as Ids das monitorias no qual o aluno se cadastrou
  var atividadesRegistradasIds = [];

  //  Encontra monitor que requisitou o login
  Monitor.findById({ _id: req.params.monitorId }, function(err, monitor) {
    if (err) {
      res.json(err);
    } else {
      //  Encontra monitoria relacionada
      Monitoria.findById(monitor.materiaMonitorada, function(err, monitoria) {
        if (err) {
          res.json(err);
        } else {

          //  Verifica se a monitoria já possui atividades ou não
          if (monitoria.atividadesRegistradas.length > 0) {

            for (var i = 0; i < monitoria.atividadesRegistradas.length; i++) {
                atividadesRegistradasIds.push(monitoria.atividadesRegistradas[i]);
            }

            //  Encontra cada atividade que se encontra no array atividadesIds
            AtividadeRegistrada.find({_id:{ $in: atividadesRegistradasIds }}, function(err, atividadesR) {
                if (err) {
                    res.json(err);
                } else {

                  res.render('index/indexMonitores', {"flag": true, "atividadesR": atividadesR, "monitor": monitor, "monitoria": monitoria });
                }
            });

          } else {
            res.render('index/indexMonitores', {"flag": false, "monitor": monitor, "monitoria": monitoria });
          }
        }

      });
    }
  });

};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.mostrarDetalhesMonitoria = function(req,res) {
   //  Array criado para adicionar as Ids das atividades vinculadas a monitoria
   var atividadesIds = [];
   var atividadesRegIds = [];
   //  Flags criadas para identificar quais informações terão ou não na página
   var flagHorarioM = false;
   var flagPlanoT = false;
   var flagAtivReg = false;

   // Busca o ID da monitoria vinculada e suas informações correspondentes
   Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
    if (err) {
      res.json(err);
    } 

    //  Verifica se a monitoria já possui horario de atendimento do monitor
    if (monitoria.horarioAtendimento != []) {
      flagHorarioM = true;
    }

    //  Verifica se a monitoria já possui plano de trabalho cadastrado ou não
    if (monitoria.planoDeTrabalho.length > 0) {
        flagPlanoT = true;
        for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
            atividadesIds.push(monitoria.planoDeTrabalho[i]);
        }

        //  Verifica se a monitoria já possui atividades registradas pelo monitor ou não
        if (monitoria.atividadesRegistradas.length > 0) {
          flagAtivReg = true;
          for (var i = 0; i < monitoria.atividadesRegistradas.length; i++) {
              atividadesRegIds.push(monitoria.atividadesRegistradas[i]);
          }

          //  Encontra cada tarefa registrada no Plano de Trabalho
          Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
            if (err) {
                res.json(err);
            } else {
                // Encontra cada tarefa registrada pelo monitor
                AtividadeRegistrada.find({_id:{ $in: atividadesRegIds }},function(err,atividadesR) {
                    if(err) {
                        res.json(err);
                    } else {
                        res.render('infoMonitoria', {"possuiPlanoTra": flagPlanoT, "possuiHorarioM": flagHorarioM, "possuiAtivReg": flagAtivReg, "atividades": atividades, "atividadesR": atividadesR ,"monitoria": monitoria, "professor": req.params.professorId });
                    }
                });

            }
          });

        } else {
          //  Encontra cada tarefa registrada no Plano de Trabalho
          Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
            if (err) {
                res.json(err);
            } else {
                res.render('infoMonitoria', {"possuiPlanoTra": flagPlanoT, "possuiHorarioM": flagHorarioM, "possuiAtivReg": flagAtivReg, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
            }
          });
        }  

    } else {
      res.render('infoMonitoria', {"possuiPlanoTra": flagPlanoT, "possuiHorarioM": flagHorarioM, "possuiAtivReg": flagAtivReg, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
    }    

  });
}
