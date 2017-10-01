'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlunoSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, entre com o nome do aluno'
  },
  matricula: {
    type: String,
    required: 'Por favor, entre com a matrícula do aluno',
    index: true,
    unique: true
  },
  telefone: {
    type: String,
    default: null
  },
  login: {
    type: String,
    unique: true,
    required: 'Por favor, entre com o login do aluno'
  },
  nota: {
    type: Number
  },
  senha: {
    type: String,
    required: 'Por favor, entre com a senha do aluno'
  }
});

var ProfessorSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, entre com o nome do professor'
  },
  codigo: {
    type: String,
    required: 'Por favor, entre com o código do professor',
    index: true,
    unique: true
  },
  telefone: {
    type: String,
    default: null
  },
  login: {
    type: String,
    unique: true,
    required: 'Por favor, entre com o login do professor'
  },
  senha: {
    type: String,
    required: 'Por favor, entre com a senha do professor'
  }
});

var MonitoriaSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, entre com o nome da monitoria'
  },
  codigo: {
    type: String,
    required: 'Por favor, entre com o código da monitoria',
    index: true,
    unique: true
  },
  oferta: {
    type: String
  },
  local: {
    type: String
  },
  Horarios: {
    type: [String],
  }
});

// create a model
//var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
//module.exports = User;

module.exports = mongoose.model('Alunos', AlunoSchema);
module.exports = mongoose.model('Professores', ProfessorSchema);
module.exports = mongoose.model('Monitorias', MonitoriaSchema);
