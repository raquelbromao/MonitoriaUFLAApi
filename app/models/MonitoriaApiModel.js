'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 █████  ██      ██    ██ ███    ██  ██████  ███████
██   ██ ██      ██    ██ ████   ██ ██    ██ ██
███████ ██      ██    ██ ██ ██  ██ ██    ██ ███████
██   ██ ██      ██    ██ ██  ██ ██ ██    ██      ██
██   ██ ███████  ██████  ██   ████  ██████  ███████
*/

var AlunoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  matricula: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    default: null
  },
  login: {
    type: String,
    required: true
  },
  nota: {
    type: Number,
    default: null
  },
  senha: {
    type: String,
    required: true
  }
});

/*
██████  ██████   ██████  ███████ ███████ ███████ ███████  ██████  ██████  ███████ ███████
██   ██ ██   ██ ██    ██ ██      ██      ██      ██      ██    ██ ██   ██ ██      ██
██████  ██████  ██    ██ █████   █████   ███████ ███████ ██    ██ ██████  █████   ███████
██      ██   ██ ██    ██ ██      ██           ██      ██ ██    ██ ██   ██ ██           ██
██      ██   ██  ██████  ██      ███████ ███████ ███████  ██████  ██   ██ ███████ ███████
*/

var ProfessorSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, entre com o nome do professor'
  },
  codigo: {
    type: String,
    required: 'Por favor, entre com o código do professor',
  },
  telefone: {
    type: String,
    default: null
  },
  login: {
    type: String,
    required: 'Por favor, entre com o login do professor'
  },
  senha: {
    type: String,
    required: 'Por favor, entre com a senha do professor'
  }
});

/*
███    ███  ██████  ███    ██ ██ ████████  ██████  ██████  ██  █████  ███████
████  ████ ██    ██ ████   ██ ██    ██    ██    ██ ██   ██ ██ ██   ██ ██
██ ████ ██ ██    ██ ██ ██  ██ ██    ██    ██    ██ ██████  ██ ███████ ███████
██  ██  ██ ██    ██ ██  ██ ██ ██    ██    ██    ██ ██   ██ ██ ██   ██      ██
██      ██  ██████  ██   ████ ██    ██     ██████  ██   ██ ██ ██   ██ ███████
*/

var MonitoriaSchema = new Schema({
  nome: {
    type: String,
    required: 'Por favor, entre com o nome da monitoria'
  },
  codigo: {
    type: String,
    required: 'Por favor, entre com o código da monitoria',
  },
  /*alunos: [{
    type: Schema.Types.ObjectId,
    ref: 'Alunos'
  }],
  monitores: [{
    type: Schema.Types.ObjectId,
     ref: 'Alunos'
  }],*/
  oferta: {
    type: String,
    default: '2017-02'
  },
  local: {
    type: String,
    default: null
  },
  googlemaps: {
    type: String,
    default: null
  },
  Horarios: {
    type: [String],
    default: null
  }
});

module.exports = mongoose.model('Alunos', AlunoSchema);
module.exports = mongoose.model('Professores', ProfessorSchema);
module.exports = mongoose.model('Monitorias', MonitoriaSchema);
