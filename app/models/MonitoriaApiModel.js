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

var prgSchema = new Schema ({
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
  }
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
  monitorID: {
    type: Schema.Types.ObjectId,
    ref: 'Monitor'
  },
  monitorNome: {
    type: String
  },
  professorNome: { 
    type: String 
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
  tiposAtividades: [{
    type: String
  }],
  alunosInscritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Aluno'
  }],
  planoDeTrabalho: [{
    type: Schema.Types.ObjectId,
    ref: 'Atividade'
  }],
  atividadesRegistradas: [{
    type: Schema.Types.ObjectId,
    ref: 'AtividadeRegistrada'
  }]
});

var AtividadeSchema = new Schema ({
  tipo: {
    type: String,
    required: true
  },
  titulo: {
    type: String
  },
  observacoes: {
    type: String
  },
  horasTotais: {
    type: Number,
    required: true
  },
  horasContabilizadas: {
    type: Number
  },
  atividadesRegistradas: [{
    type: Schema.Types.ObjectId,
    ref: 'AtividadeRegistrada'
  }]
});

var AtividadeRegistradaSchema = new Schema ({
  tipo: {
    type: String,
    required: true
  },
  titulo: {
    type: String
  },
  observacoes: {
    type: String
  },
  contagemAtendimento: {
    type: Number
  },
  data: {
    dia: String,
    hora: String
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaTermino: {
    type: String,
    required: true
  },
  horasRegistradas: {
    type: Number
  }
});

//  CRIA VARIÁVEIS PARA SEREM REFERENCIADAS EM OUTROS MODELOS
var Aluno = mongoose.model('Alunos', AlunoSchema);
var Professor = mongoose.model('Professores', ProfessorSchema);
var PRG = mongoose.model('PRG', prgSchema);
var Monitor = mongoose.model('Monitores', MonitorSchema);
var Monitoria = mongoose.model('Monitorias', MonitoriaSchema);
var Atividade = mongoose.model('Atividades', AtividadeSchema);
var AtividadeRegistrada = mongoose.model('AtividadesRegistradas', AtividadeRegistradaSchema);

//  EXPORTA OS MODELOS PARA SEREM USADOS EM OUTROS ARQUIVOS
module.exports = mongoose.model('Alunos', AlunoSchema);
module.exports = mongoose.model('Professores', ProfessorSchema);
module.exports = mongoose.model('PRG', prgSchema);
module.exports = mongoose.model('Monitores', MonitorSchema);
module.exports = mongoose.model('Monitorias', MonitoriaSchema);
module.exports = mongoose.model('Atividades', AtividadeSchema);
module.exports = mongoose.model('AtividadesRegistradas', AtividadeRegistradaSchema);