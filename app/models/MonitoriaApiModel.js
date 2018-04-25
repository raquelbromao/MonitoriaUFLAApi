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
  }],
  horarioAtendimento: {
    type: Schema.Types.ObjectId,
    ref: 'HorarioMonitoria'
  }
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
    type: Number,
    default: 0
  },
  porcentagem: {
    type: Number,
    default: 0
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

var HorarioMonitoriaSchema = new Schema ({
  monitoria: {
    type: Schema.Types.ObjectId,
    ref: 'Monitor'
  },
  monitor: {
    type: Schema.Types.ObjectId,
    ref: 'Monitor'
  },
  segunda: [{
    type: String
  }],
  terca: [{
    type: String
  }],
  quarta: [{
    type: String
  }],
  quinta: [{
    type: String
  }],
  sexta: [{
    type: String
  }]
});

//  CRIA VARIÁVEIS PARA SEREM REFERENCIADAS EM OUTROS MODELOS
var Aluno = mongoose.model('Alunos', AlunoSchema);
var Professor = mongoose.model('Professores', ProfessorSchema);
var PRG = mongoose.model('PRG', prgSchema);
var Monitor = mongoose.model('Monitores', MonitorSchema);
var Monitoria = mongoose.model('Monitorias', MonitoriaSchema);
var Atividade = mongoose.model('Atividades', AtividadeSchema);
var AtividadeRegistrada = mongoose.model('AtividadesRegistradas', AtividadeRegistradaSchema);
var HorarioMonitoria = mongoose.model('HorariosMonitorias', HorarioMonitoriaSchema);

//  EXPORTA OS MODELOS PARA SEREM USADOS EM OUTROS ARQUIVOS
module.exports = mongoose.model('Alunos', AlunoSchema);
module.exports = mongoose.model('Professores', ProfessorSchema);
module.exports = mongoose.model('PRG', prgSchema);
module.exports = mongoose.model('Monitores', MonitorSchema);
module.exports = mongoose.model('Monitorias', MonitoriaSchema);
module.exports = mongoose.model('Atividades', AtividadeSchema);
module.exports = mongoose.model('AtividadesRegistradas', AtividadeRegistradaSchema);
module.exports = mongoose.model('HorariosMonitorias', HorarioMonitoriaSchema);