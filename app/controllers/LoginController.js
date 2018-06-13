"use strict";

var mongoose = require("mongoose");
var bcrypt   = require("bcrypt");

var Aluno     = mongoose.model("Alunos");
var Professor = mongoose.model("Professores");
var Monitor   = mongoose.model("Monitores");
var PRG       = mongoose.model("PRG");

/**
 * Autentica o login
 * @param {*} req 
 * @param {*} res 
 */
exports.autenticarLogin = function(req, res) {
  //  Analisa tipo de usuário que requeriu entrada no sistema
  if (req.body.tipo === "aluno") {
    //console.log("[Usuário] Aluno identificado. Analisando Permissão...");
    Aluno.findOne({ login: req.body.login }, function(err, aluno) {
      if (err) {
        res.redirect("/login");
      } else if (aluno === null) {
        console.log('null');
        res.redirect("/login");
      } else {
        if (bcrypt.compareSync(req.body.senha, aluno.senha)) {
          res.redirect("/indexAlunos/" + aluno._id);
        } else {
          console.log('falso');
          res.redirect("/login");
        }
      }
    });

  } else if (req.body.tipo === "professor") {
    //console.log("[Usuário] Professor identificado. Analisando Permissão...");
    Professor.findOne({ login: req.body.login }, function(err, professor) {
      if (err) {
        res.redirect("/login");
      } else if (professor === null) {
        console.log('null');
        res.redirect("/login");
      } else {
        if (bcrypt.compareSync(req.body.senha, professor.senha)) {  
          res.redirect("/indexProfessores/" + professor._id);
        } else {
          console.log('falso');
          res.redirect("/login");
        }
      }
    });

  } else if (req.body.tipo === "prg") {
    //console.log("[Usuário] PRG identificado. Analisando Permissão...");
    PRG.findOne({ login: req.body.login }, function(err, membroPRG) {
      if (err) {
        res.redirect("/login");
      } else if (membroPRG === null) {
        res.status(404).redirect("/login");
      } else {
        if (membroPRG.senha === req.body.senha) {
          res.status(200).redirect("/indexPRG/" + membroPRG._id);
        } else {
          res.status(401).redirect("/login");
        }
      }
    });

  } else if (req.body.tipo === "monitor") {
    //console.log("[Usuário] Monitor identificado. Analisando Permissão...");
    Monitor.findOne({ login: req.body.login }, function(err, monitor) {
      if (err) {
        res.redirect("/login");
      } else if (monitor === null) {
        console.log('null');
        res.redirect("/login");
      } else {
        if (bcrypt.compareSync(req.body.senha, monitor.senha)) {  
          res.redirect("/indexMonitores/" + monitor._id);
        } else {
          console.log('falso');
          res.redirect("/login");
        }
      }
    });
    
  } else {
    console.log("Tipo de usuário não identificado!");
    res.redirect("/login");
  }
};
