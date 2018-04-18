"use strict";

var mongoose = require("mongoose");
var Monitoria = mongoose.model("Monitorias");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");

var url = require("url");

/*
  Lista todos as monitorias presentes no BD
*/
exports.listarMonitorias = function(req, res) {
  Monitoria.find({}, function(err, monitorias) {
    if (err) {
      res.json(err);
    } else {
      res.render("adm/monitorias", { monitorias: monitorias });
    }
  });
};

/*
  Cadastra monitoria no BD
*/
exports.criarMonitoria = function(req, res) {
  var novaMonitoria = new Monitoria();
  novaMonitoria.nomeDisciplina = req.body.nomeDisciplina;
  novaMonitoria.codigoDisciplina = req.body.codigoDisciplina;
  novaMonitoria.oferta = req.body.oferta;
  novaMonitoria.local = req.body.local;
  novaMonitoria.googlemaps = req.body.googlemaps;

  Monitor.findOne({matricula: req.body.monitor}, function (err, monitor) {
    if(err) {
      res.json(err);
    } else {

      Professor.findOne({codigo: req.body.professor}, function(err, professor) {
        if (err) {
          res.json(err);
        } else {

          novaMonitoria.professor = professor._id;
          novaMonitoria.monitorID = monitor._id;
          novaMonitoria.monitorNome = monitor.nome;

          //  Salva Monitoria no BD
          novaMonitoria.save(function(err, monitoria) {
            if (err) {
              res.json(err);
            } else {

              console.log("Monitoria cadastrada com sucesso\n");
              //professor.monitorias.push(monitoria._id);
              //monitor.materiaMonitorada = monitoria._id;

              Monitoria.findById(monitoria._id, function(err, monitoria2) {
                if(err) {
                  res.json(err);
                } else {
                  console.log(monitoria2);

                  //  Cadastra monitoria no professor
                  Professor.findByIdAndUpdate(monitoria2.professor, {$push: {monitorias: monitoria2._id}}, function(err, professor2) {
                    if (err) {
                      res.json(err);
                    } else {
                      console.log(professor2);
                    }
                  });

                  //  Cadastra monitoria no monitor
                  Monitor.findByIdAndUpdate(monitoria2.monitorID, {materiaMonitorada: monitoria2._id}, function(err, monitor2) {
                    if (err) {
                      res.json(err);
                    } else {
                      console.log(monitor2);
                    }
                  });

                  res.redirect("/adm/monitorias");
                }
              });

            }
          });

        }
      });
    }
  }); 
};

/*
  Deleta MONITORIA do BD
*/
exports.deletarMonitoria = function(req, res) {
  Monitoria.remove({ _id: req.params.monitoriaId }, function(err, monitoria) {
    if (err) {
      res.json(err);
    } else {

      //  DELETAR MONITORIA DE PROFESSOR E MONITOR

      
      console.log("Monitoria deletado com sucesso");
      res.redirect("/adm/monitorias");
    }
  });
};

/*
  Mostra Monitoria da edição
*/
exports.mostrarMonitoriaEdicao = function(req, res) {
  Monitoria.find({ _id: req.params.monitoriaId }, function(err, monitoria) {
    if (err) {
      res.json(err);
    } else {
      //  parametro MONITORIA é um array de alunos, então para pegar um único se acessa a posição 0
      res.render("edicao/edicaoMonitoria", { monitoria: monitoria[0] });
    }
  });
};

/*
  Edita monitoria e salva mudanças no BD
*/
exports.editarMonitoria = function(req, res) {
  //  Salva todos as info da requisição em cada componente da Monitoria
  var nomeDisciplina = req.body.nomeDisciplina;
  var codigoDisciplina = req.body.codigoDisciplina;
  var local = req.body.local;
  var oferta = req.body.oferta;
  var professorCodigo = req.body.professorCodigo;
  var monitorMatricula = req.body.alunoMatricula;
  var googlemaps = req.body.googlemaps;


  Monitoria.findOneAndUpdate(
    { _id: req.params.monitoriaId },
    { nomeDisciplina, codigoDisciplina, local, oferta, googlemaps },
    function(err, monitoria) {
      if (err) {
        console.log(err);
      }
      //res.redirect('/adm/monitorias');
    }
  );

  if (professorCodigo != "") {
    console.log("Campo professor utilizado");
    //  Pesquisar professor
    Professor.findOne({ codigo: professorCodigo }, function(err, professor) {
      if (err) {
        console.log(err);
      } else if (professor != null) {
        //professorCodigo = professor._id;
        console.log("Professor _id: " + professor._id);

        Monitoria.findByIdAndUpdate(
          { _id: req.params.monitoriaId },
          { professor: professor._id },
          function(err, monitoria) {
            if (err) {
              console.log(err);
            } else {
              console.log("Professor cadastrado");
            }
          }
        );
      } else {
        console.log("Não existe professor com esse código cadastrado no BD!");
      }
    });
  } else {
    console.log("Campo professor vazio");
  }

  if (monitorMatricula != "") {
    console.log("Campo monitor utilizado");
    //  Pesquisar monitor
    Monitor.findOne({ matricula: monitorMatricula }, function(err, monitor) {
      if (err) {
        console.log(err);
      } else if (monitor != null) {
        console.log("Monitor _id: " + monitor._id);

        Monitoria.findByIdAndUpdate(
          { _id: req.params.monitoriaId },
          { monitor: monitor._id },
          function(err, monitoria) {
            if (err) {
              console.log(err);
            } else {
              console.log("Monitor cadastrado");
            }
          }
        );
      } else {
        console.log("Não existe monitor com essa matrícula cadastrado no BD");
      }
    });
  } else {
    console.log("Campo monitor vazio");
  }

  res.redirect("/adm/monitorias");
};

/*
  Pesquisa monitoria pelo nome
*/
exports.pesquisarMonitoria = function(req, res) {
  //  Recebe a query dada e armazena numa variável
  var monitoria = req.query.nomeMonitoria;
  //  Pega a url dada e separa o pathname que é a url - query
  //  Imprime a url
  //console.log(req.url);
  //  Analisa a url e separa cada coisa pelo seu campo
  var aux_url = url.parse(req.url, true);
  //  Separa o pathname da url que é a { url - query }
  //console.log(aux_url.pathname);
  //  Esse pathname é passado para uma string para sofrer split em '/' e
  //  retirar a id do aluno
  var endereco = aux_url.pathname;
  var aux = endereco.split("/");
  //console.log(aux);

  //  Separa a id do aluno e armazena numa variável
  var aluno;
  aux.forEach(function(entrada) {
    if ((entrada === "monitorias") === false && (entrada === "pesquisar") === false) {
      aluno = entrada.trim();
    }
  });

  Monitoria.find({ nome: req.query.nomeMonitoria }, function(err, monitorias) {
    if (err) {
      res.json(err);
    } else {
      res.render("resultado", { monitorias: monitorias, aluno: aluno });
    }
  });
};
