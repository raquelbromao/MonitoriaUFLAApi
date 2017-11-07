'use strict';

var mongoose = require('mongoose');
var Aluno = mongoose.model('Alunos');
var Professor = mongoose.model('Professores');

/*
  Autentica login e verifica tipo de usuário
*/
exports.autenticarLogin = function(req, res) {
  var tipo_usuario = req.body.tipo
  var login_acesso = req.body.login;
  var senha_acesso = req.body.senha;
  var erro;

  //  Analisa tipo de usuário que requeriu entrada no sistema
  if (tipo_usuario === 'aluno') {
    //console.log('[Usuário] Aluno identificado. Analisando Permissão...');
    //  VERIFICA SE ALUNO EXISTE PELO LOGIN
    Aluno.findOne({login: login_acesso}, function(err,aluno) {
      if (err) {
        //console.log(err);
        res.redirect('/login');
      } else if (aluno === null) {
        //console.log('Login não encontrado no banco de dados!');
        res.redirect('/login');
      } else {
        //console.log('Login aceito');
        //console.log(aluno);
        //  VERIFICA A SENHA CASO O LOGIN SEJA ACEITO (ENCONTRADO)
        if (aluno.senha === senha_acesso) {
          //console.log('Senha aceita!');
          res.redirect('/indexAlunos/' + aluno._id);
        } else {
          //console.log('Senha não aceita!');
          res.redirect('/login');
        }
      }
    });
  } else if (tipo_usuario === 'professor') {
    //console.log('[Usuário] Professor identificado. Analisando Permissão...');
    //  VERIFICA SE ALUNO EXISTE PELO LOGIN
    Professor.findOne({login: login_acesso}, function(err,professor) {
    //Professor.find({login: login_acesso, senha: senha_acesso}, function(err,professor) {
      if (err) {
        //console.log(err);
        res.redirect('/login');
      } else if (professor === null) {
        //console.log('Login não encontrado no banco de dados!');
        res.redirect('/login');
      } else {
        //console.log('Login aceito');
        //console.log(professor);
        //  VERIFICA A SENHA CASO O LOGIN SEJA ACEITO (ENCONTRADO)
        if (professor.senha === senha_acesso) {
          //console.log('Senha aceita!');
          res.redirect('/indexProfessores/' + professor._id);
        } else {
          //console.log('Senha não aceita!');
          res.redirect('/login');
        }
      }
    });
  } else if (tipo_usuario === 'prg') {
    console.log('[Usuário] PRG identificado. Analisando Permissão...');
    res.redirect('/login');
  } else {
    console.log('Tipo de usuário não identificado!');
    res.redirect('/login');
  }
};
