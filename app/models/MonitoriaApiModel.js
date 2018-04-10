'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlunoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  matricula: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  monitorias: [{
    type: Schema.Types.ObjectId,
    ref: 'Monitoria'
  }]
});

var ProfessorSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    default: null
  },
  login: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  monitorias: [{
    type: Schema.Types.ObjectId,
    ref: 'Monitorias'
  }]
});

var MonitoriaSchema = new Schema({
  nomeDisciplina: {
    type: String,
    required: true
  },
  codigoDisciplina: {
    type: String,
    required: true
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'Professor'
  },
  monitor: {
    type: Schema.Types.ObjectId,
    ref: 'Monitor'
  },
  oferta: {
    type: String,
    default: "2018-01"
  },
  local: {
    type: String,
    required: true
  },
  googlemaps: {
    type: String
  },
  alunosInscritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Aluno'
  }],
  atividades: [{
    type: Schema.Types.ObjectId,
    ref: 'Atividade'
  }]
});

var MonitorSchema = new Schema ({
  nome: {
    type: String,
    required: true
  },
  matricula: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  materiaMonitorada: {
    type: Schema.Types.ObjectId,
    ref: 'Monitoria'
  }
});

var AtividadeSchema = new Schema ({
  //  Necessário arrumar esse campo, precisa ser uma lista pré-definida
  tipoDeAtividade: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
  },
  prazo: {
    type: String,
  },
  foiTerminada: {
    type: Boolean,
    default: false  
  }
});

var Aluno = mongoose.model('Alunos', AlunoSchema);
var Professor = mongoose.model('Professores', ProfessorSchema);
var Monitor = mongoose.model('Monitores', MonitorSchema);
var Monitoria = mongoose.model('Monitorias', MonitoriaSchema);
var Atividade = mongoose.model('Atividades', AtividadeSchema);

module.exports = mongoose.model('Alunos', AlunoSchema);
module.exports = mongoose.model('Professores', ProfessorSchema);
module.exports = mongoose.model('Monitores', MonitorSchema);
module.exports = mongoose.model('Monitorias', MonitoriaSchema);
module.exports = mongoose.model('Atividades', AtividadeSchema);