"use strict";

var mongoose = require("mongoose");
var Monitoria = mongoose.model("Monitorias");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");
var horarioMonitor = mongoose.model("HorariosMonitorias");

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
          novaMonitoria.professorNome = professor.nome;

          //  Salva Monitoria no BD
          novaMonitoria.save(function(err, monitoria) {
            if (err) {
              res.json(err);
            } else {

              Monitoria.findById(monitoria._id, function(err, monitoria2) {
                if(err) {
                  res.json(err);
                } else {
                  
                  //  Cadastra monitoria no professor
                  Professor.findByIdAndUpdate(monitoria2.professor, {$push: {monitorias: monitoria2._id}}, function(err, professor2) {
                    if (err) {
                      res.json(err);
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

/**
 * Pesquisa a monitoria desejada e retorna uma página com suas informações e opção de cadastro
 * @param {*} req 
 * @param {*} res 
 */
exports.pesquisarMonitoria = function(req, res) {
  //  Recebe a query dada e armazena numa variável
  var monitoria = req.query.nomeMonitoria;
  console.log("MONITORIA: "+monitoria);
  console.log("ALUNO: "+req.params.alunoId);

  Monitoria.find({ nomeDisciplina: req.query.nomeMonitoria }, function(err, monitorias) {
    if (err) {
      res.json(err);
    } else {
      console.log(monitorias);
      res.render("resultado", { "monitorias": monitorias, "aluno": req.params.alunoId });
    }
  });
};

/**
 * Mostra a página de cadastro de horário de atendimento do monitor
 * @param {*} req 
 * @param {*} res 
 */
exports.mostrarCadastroHorario = function(req,res) {
  res.render("cadastroHorarioMonitor",  { monitoria: req.params.monitoriaId, professor: req.params.professorId } )
};

/**
 * Cadastrar horário de atendimento do monitor 
 * Feito pelo professor
 * @param {*} req 
 * @param {*} res 
 */
exports.cadastrarHorarioMonitor = function (req,res) {
  var horarioM = new horarioMonitor();
  horarioM.monitoria = req.params.monitoriaId;

  if (req.body.horaInicio1Seg != ''  && req.body.horaTermino1Seg != '') {
    console.log(req.body.horaInicio1Seg);
    console.log(req.body.horaTermino1Seg);
    var segunda1 = req.body.horaInicio1Seg+"-"+req.body.horaTermino1Seg;
    horarioM.segunda.push(segunda1);
  }

  if (req.body.horaInicio2Seg != ''  && req.body.horaTermino2Seg != '') {
    console.log(req.body.horaInicio2Seg);
    console.log(req.body.horaTermino2Seg);
    var segunda2 = req.body.horaInicio2Seg+"-"+req.body.horaTermino2Seg;
    horarioM.segunda.push(segunda2);
  }

  if (req.body.horaInicio1Ter != ''  && req.body.horaTermino1Ter != '') {
    console.log(req.body.horaInicio1Ter);
    console.log(req.body.horaTermino1Ter);
    var terca1 = req.body.horaInicio1Ter+"-"+req.body.horaTermino1Ter;
    horarioM.terca.push(terca1);
  }

  if (req.body.horaInicio2Ter != ''  && req.body.horaTermino2Ter != '') {
    console.log(req.body.horaInicio2Ter);
    console.log(req.body.horaTermino2Ter);
    var terca2 = req.body.horaInicio2Ter+"-"+req.body.horaTermino2Ter;
    horarioM.terca.push(terca2);
  }

  if (req.body.horaInicio1Qua != ''  && req.body.horaTermino1Qua != '') {
    console.log(req.body.horaInicio1Qua);
    console.log(req.body.horaTermino1Qua);
    var quarta1 = req.body.horaInicio1Qua+"-"+req.body.horaTermino1Qua;
    horarioM.quarta.push(quarta1);
  }

  if (req.body.horaInicio2Qua != ''  && req.body.horaTermino2Qua != '') {
    console.log(req.body.horaInicio2Qua);
    console.log(req.body.horaTermino2Qua);
    var quarta2 = req.body.horaInicio2Qua+"-"+req.body.horaTermino2Qua;
    horarioM.quarta.push(quarta2);
  }

  if (req.body.horaInicio1Qui != ''  && req.body.horaTermino1Qui != '') {
    console.log(req.body.horaInicio1Qui);
    console.log(req.body.horaTermino1Qui);
    var quinta1 = req.body.horaInicio1Qui+"-"+req.body.horaTermino1Qui;
    horarioM.quinta.push(quinta1);
  }

  if (req.body.horaInicio2Qui != ''  && req.body.horaTermino2Qui != '') {
    console.log(req.body.horaInicio2Qui);
    console.log(req.body.horaTermino2Qui);
    var quinta2 = req.body.horaInicio2Qui+"-"+req.body.horaTermino2Qui;
    horarioM.quinta.push(quinta2);
  }

  if (req.body.horaInicio1Sex != ''  && req.body.horaTermino1Sex != '') {
    console.log(req.body.horaInicio1Sex);
    console.log(req.body.horaTermino1Sex);
    var sexta1 = req.body.horaInicio1Sex+"-"+req.body.horaTermino1Sex;
    horarioM.sexta.push(sexta1);
  }

  if (req.body.horaInicio2Sex != ''  && req.body.horaTermino2Sex != '') {
    console.log(req.body.horaInicio2Sex);
    console.log(req.body.horaTermino2Sex);
    var sexta2 = req.body.horaInicio2Sex+"-"+req.body.horaTermino2Sex;
    horarioM.sexta.push(sexta2);
  }

  horarioM.save(function(err, horario) {
    if (err) {
      res.json(err);
    } else {

      Monitoria.findByIdAndUpdate(req.params.monitoriaId, {horarioAtendimento: horario._id}, function(err,monitoria) {
        if (err) {
          res.json(err);
        } 

        res.redirect('/planoMonitoria/index/'+req.params.professorId+'/'+req.params.monitoriaId);
      });

    }
  });
}

exports.mostrarHorarioDeAtendimento = function (req,res) {
  console.log(req.params);
  horarioMonitor.findById(req.params.horarioId, function(err, horario) {
    res.render("horarioMonitor", {"horarioMonitor": horario, "voltarTipo": req.params.tipoVoltar, "professor": req.params.professorId, "monitoria": req.params.monitoriaId});
  });
}
