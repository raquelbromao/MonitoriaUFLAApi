"use strict";

const bcrypt   = require("bcrypt");
const config   = require("../config/configTeste");
const mongoose = require("mongoose");

const Aluno     = mongoose.model("Alunos");
const Monitor   = mongoose.model("Monitores");
const Professor = mongoose.model("Professores");
const Monitoria = mongoose.model("Monitorias");
const PRG       = mongoose.model("PRG");

const listaDocentesDCC   = require('../../docs/listaDocentes').docentesDCC;
const listaDocentesDEX   = require('../../docs/listaDocentes').docentesDEX;
const listaDiscentes     = require('../../docs/listaDiscentes').Discentes;
const listaMonitores     = require('../../docs/listaDiscentes').Monitores;
const listaMonitoriasDCC = require('../../docs/listaMonitorias').MonitoriasDCC;
const listaMonitoriasDEX = require('../../docs/listaMonitorias').MonitoriasDEX;

// CADASTRO EM LOTES
exports.cadastrarDocentesEmLote = function(req,res) {
  if ((req.params.Departamento) == 1) {
    this.cadastrarDCC();
    res.status(200).json({"status": "OK", "ulitmoCodDCC": config.ultimosCodigos.DCC});
  } else if((req.params.Departamento) == 2) {
    this.cadastrarDEX(); 
    res.status(200).json({"status": "OK", "ulitmoCodDEX": config.ultimosCodigos.DEX});
  } else {
    res.status(404).json({"status": "ERROR"});
  }
};

exports.cadastrarDCC = function() {
  listaDocentesDCC.forEach(docente => {
    //  Cria novo docente e insere no BD
    var numeroNovo = 1 + (config.ultimosCodigos.DCC);
    var codigoNovo = numeroNovo.toString()+'dcc';
    config.ultimosCodigos.DCC = numeroNovo;

    var docenteNovo = new Professor({
      nome: docente.nome,
      login: docente.login,
      senha: bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia),
      telefone: docente.telefone,
      codigo: codigoNovo
    });

    //console.log(docenteNovo);

    docenteNovo.save(function(err, docente) {
      if (err) {
        res.json(err);
      } else {
        console.log("docente cadastrado com sucesso");
      }
    });
  });
};

exports.cadastrarDEX = function() {
  listaDocentesDEX.forEach(docente => {
    //  Cria novo docente e insere no BD
    var numeroNovo = 1 + (config.ultimosCodigos.DEX);
    var codigoNovo = numeroNovo.toString()+'dex';
    config.ultimosCodigos.DEX = numeroNovo;

    var docenteNovo = new Professor({
      nome: docente.nome,
      login: docente.login,
      senha: bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia),
      telefone: docente.telefone,
      codigo: codigoNovo
    });

    //console.log(docenteNovo);

    docenteNovo.save(function(err, docente) {
      if (err) {
        res.json(err);
      } else {
        console.log("docente cadastrado com sucesso");
      }
    });
  });
};

exports.cadastrarDiscentesEmLote = function(req, res) {
    listaDiscentes.forEach(discente => {
        //  Cria novo discente e insere no BD    
        var discenteNovo = new Aluno({
          nome: discente.nome,
          matricula: discente.matricula,
          login: discente.login,
          senha: bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia),
          telefone: discente.telefone,
        });
    
        console.log(discenteNovo);
    
        discenteNovo.save(function(err, discente) {
          if (err) {
            res.json(err);
          } else {
            console.log("discente cadastrado com sucesso");
          }
        });
      });
    
      res.status(200).json({"status": "OK"});
};

exports.cadastrarMonitoresEmLote = function(req, res) {
  listaMonitores.forEach(monitor => {
      //  Cria novo discente e insere no BD    
      var monitorNovo = new Monitor({
        nome: monitor.nome,
        matricula: monitor.matricula,
        login: monitor.login,
        senha: bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia),
      });
  
      console.log(monitorNovo);
  
      monitorNovo.save(function(err, monitor) {
        if (err) {
          res.json(err);
        } else {
          console.log("monitor cadastrado com sucesso");
        }
      });
    });
  
    res.status(200).json({"status": "OK"});
};

exports.cadastrarMonitoriasEmLote = function(req, res) {
  if ((req.params.Departamento) == 1) {
    this.cadastrarMonitoriasDCC();
    res.status(200).json({"status": "OK"});
  } else if((req.params.Departamento) == 2) {
    this.cadastrarMonitoriasDEX();
    res.status(200).json({"status": "OK"});
  } else {
    res.status(404).json({"status": "ERROR"});
  }
};

exports.cadastrarMonitoriasDCC = function () {
  listaMonitoriasDCC.forEach(monitoria => {
    //  Cria monitoria e insere no BD
    var novaMonitoria = new Monitoria(monitoria);
    //console.log(novaMonitoria);

    //  Salva Monitoria no BD
    novaMonitoria.save(function(err, monitoria) {
      if (err) {
        res.status(404).json({"status": "ERROR", "err": err});
      } else {

        //  Cadastra monitoria no professor
        Professor.findByIdAndUpdate(monitoria.professor, {eOrientador: true, $push: {monitorias: monitoria._id}}, function(err, professor) {
          if (err) {
            res.json(err);
          } else {
            console.log(professor)
          }
        });

        //  Cadastra monitoria no monitor
        Monitor.findByIdAndUpdate(monitoria.monitorID, {materiaMonitorada: monitoria._id}, function(err, monitor) {
          if (err) {
            res.json(err);
          } else {
            console.log(monitor);
          }
        });

      }
    });  
  });
};

exports.cadastrarMonitoriasDEX = function() {
  listaMonitoriasDEX.forEach(monitoria => {
    //  Cria monitoria e insere no BD
    var novaMonitoria = new Monitoria(monitoria);
    //console.log(novaMonitoria);

    //  Salva Monitoria no BD
    novaMonitoria.save(function(err, monitoria) {
      if (err) {
        res.status(404).json({"status": "ERROR", "err": err});
      } else {

        //  Cadastra monitoria no professor
        Professor.findByIdAndUpdate(monitoria.professor, {eOrientador: true, $push: {monitorias: monitoria._id}}, function(err, professor) {
          if (err) {
            res.json(err);
          } else {
            console.log(professor)
          }
        });

        //  Cadastra monitoria no monitor
        Monitor.findByIdAndUpdate(monitoria.monitorID, {materiaMonitorada: monitoria._id}, function(err, monitor) {
          if (err) {
            res.json(err);
          } else {
            console.log(monitor);
          }
        });

      }
    });
  });
};

exports.criptografarSenha = function(req, res) {
  if ((req.params.tipoUsuario) == 1) {
    this.criptografarAluno(req, res, req.params.ID);
  } else if((req.params.tipoUsuario) == 2) {
    this.criptografarProfessor(req, res, req.params.ID);
  } else if ((req.params.tipoUsuario) == 3) {
    this.criptografarPRG(req, res, req.params.ID);
  } else if ((req.params.tipoUsuario) == 4) {  
    this.criptografarMonitor(req, res, req.params.ID);
  } else {
    res.status(404).json({"status": "ERROR"});
  }
};

exports.criptografarAluno = function(req, res, idAluno) {
  // cria senha nova criptografada
  var senhaCriptografada = bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia);

  //  Encontra discente e atualiza senha
  Aluno.findByIdAndUpdate(idAluno,{senha: senhaCriptografada}, function(err, aluno) {
    if (err) {
      res.status(404).json({"status": "ERRO", "erro": err});
    } else {      
      res
        .status(200)
        .json({"status": "OK", "discenteID": idAluno, "senhaOriginal": "123456", "senhaCriptografada": senhaCriptografada});
    }
  });
};

exports.criptografarProfessor = function(req, res, idProfessor) {
  // cria senha nova criptografada
  var senhaCriptografada = bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia);

  //  Encontra discente e atualiza senha
  Professor.findByIdAndUpdate(idProfessor,{senha: senhaCriptografada}, function(err, professor) {
    if (err) {
      res.status(404).json({"status": "ERRO", "erro": err});
    } else {      
      res
        .status(200)
        .json({"status": "OK", "docenteID": idProfessor, "senhaOriginal": "123456", "senhaCriptografada": senhaCriptografada});
    }
  });
};

exports.criptografarPRG = function(req, res, idPRG) {
  // cria senha nova criptografada
  var senhaCriptografada = bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia);

  //  Encontra discente e atualiza senha
  PRG.findByIdAndUpdate(idPRG,{senha: senhaCriptografada}, function(err, PRG) {
    if (err) {
      res.status(404).json({"status": "ERRO", "erro": err});
    } else {      
      res
        .status(200)
        .json({"status": "OK", "prgID": idPRG, "senhaOriginal": "123456", "senhaCriptografada": senhaCriptografada});
    }
  });
};

exports.criptografarMonitor = function(req, res, idMonitor) {
  // cria senha nova criptografada
  var senhaCriptografada = bcrypt.hashSync(config.senhaPadrao, config.saltosCriptografia);

  //  Encontra discente e atualiza senha
  Monitor.findByIdAndUpdate(idMonitor,{senha: senhaCriptografada}, function(err, monitor) {
    if (err) {
      res.status(404).json({"status": "ERRO", "erro": err});
    } else {      
      res
        .status(200)
        .json({"status": "OK", "monitorID": idMonitor, "senhaCriptografada": senhaCriptografada});
    }
  });
};