"use strict";

var mongoose = require("mongoose");
var Monitor = mongoose.model("Monitores");
var Atividade = mongoose.model("Atividades");
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
  //  Cria novo objeto Aluno
  var monitor_cadastro = new Monitor();
  //  Salva todos as info da requisição em cada componente de Aluno
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
  var materiaMonitorada = req.body.materiaMonitorada;

  Monitor.findOneAndUpdate(
    { _id: req.params.monitorId },
    { nome, matricula, login, senha, materiaMonitorada },
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
  var atividadesIds = [];

  //  Encontra monitor que requisitou o login
  Monitor.findById({ _id: req.params.monitorId }, function(err, monitor) {
    if (err) {
      res.json(err);
    } else {
      //console.log(monitor);
      //console.log(monitor.materiaMonitorada);
      //  Encontra monitoria relacionada
      Monitoria.findById(monitor.materiaMonitorada, function(err, monitoria) {
        if (err) {
          res.json(err);
        } else {
          //console.log(monitoria);
          //  Verifica se a monitoria já possui atividades ou não
          if (monitoria.atividades != null) {
            //console.log(monitoria.atividades);
            for (var i = 0; i < monitoria.atividades.length; i++) {
                atividadesIds.push(monitoria.atividades[i]);
            }

            //console.log(atividadesIds);

            //  Encontra cada atividade que se encontra no array atividadesIds
            Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                if (err) {
                    res.json(err);
                } else {
                    //console.log(atividades);
                    res.render('index/indexMonitores', {"atividades": atividades, "monitor": monitor, "monitoria": monitoria });
                }
            });

          } else {
            console.log('Monitor sem atividades! Outra tela!')
            res.render('login');
          }
        }

      });
    }
  });

};
