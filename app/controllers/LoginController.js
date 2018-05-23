"use strict";

var mongoose = require("mongoose");
var Aluno = mongoose.model("Alunos");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");
var PRG = mongoose.model("PRG");

/**
 * Autentica o login
 * @param {*} req 
 * @param {*} res 
 */
exports.autenticarLogin = function(req, res) {
  var tipo_usuario = req.body.tipo;
  var login_acesso = req.body.login;
  var senha_acesso = req.body.senha;
  var erro;

  //  Analisa tipo de usuário que requeriu entrada no sistema
  if (tipo_usuario === "aluno") {
    //console.log("[Usuário] Aluno identificado. Analisando Permissão...");
    Aluno.findOne({ login: login_acesso }, function(err, aluno) {
      if (err) {
        res.redirect("/login");
      } else if (aluno === null) {
        res.redirect("/login");
      } else {
        if (aluno.senha === senha_acesso) {
          res.redirect("/indexAlunos/" + aluno._id);
        } else {
          res.redirect("/login");
        }
      }
    });

  } else if (tipo_usuario === "professor") {
    //console.log("[Usuário] Professor identificado. Analisando Permissão...");
    Professor.findOne({ login: login_acesso }, function(err, professor) {
      if (err) {
        res.redirect("/login");
      } else if (professor === null) {
        res.redirect("/login");
      } else {
        if (professor.senha === senha_acesso) {
          res.redirect("/indexProfessores/" + professor._id);
        } else {
          res.redirect("/login");
        }
      }
    });

  } else if (tipo_usuario === "prg") {
    //console.log("[Usuário] PRG identificado. Analisando Permissão...");
    PRG.findOne({ login: login_acesso }, function(err, membroPRG) {
      if (err) {
        res.redirect("/login");
      } else if (membroPRG === null) {
        res.status(404).redirect("/login");
      } else {
        if (membroPRG.senha === senha_acesso) {
          res.status(200).redirect("/indexPRG/" + membroPRG._id);
        } else {
          res.status(401).redirect("/login");
        }
      }
    });

  } else if (tipo_usuario === "monitor") {
    //console.log("[Usuário] Monitor identificado. Analisando Permissão...");
    Monitor.findOne({ login: login_acesso }, function(err, monitor) {
      if (err) {
        res.redirect("/login");
      } else if (monitor === null) {
        res.redirect("/login");
      } else {
        if (monitor.senha === senha_acesso) {
          res.redirect("/indexMonitores/" + monitor._id);
        } else {
          res.redirect("/login");
        }
      }
    });
    
  } else {
    console.log("Tipo de usuário não identificado!");
    res.redirect("/login");
  }
};
