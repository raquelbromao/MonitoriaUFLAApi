"use strict";

const bcrypt   = require("bcrypt");
const config   = require("../config/configTeste");
const mongoose = require("mongoose");
const PDF      = require("pdfkit");
const fs       = require("fs")
const jwt      = require("jsonwebtoken");
const moment   = require('moment')

const Aluno     = mongoose.model("Alunos");
const Monitor   = mongoose.model("Monitores");
const Professor = mongoose.model("Professores");
const Monitoria = mongoose.model("Monitorias");

const listaDocentesDCC   = require('../../docs/listaDocentes').docentesDCC;
const listaDocentesDEX   = require('../../docs/listaDocentes').docentesDEX;
const listaDiscentes     = require('../../docs/listaDiscentes').Discentes;
const listaMonitores     = require('../../docs/listaDiscentes').Monitores;
const listaMonitoriasDCC = require('../../docs/listaMonitorias').MonitoriasDCC;
const listaMonitoriasDEX = require('../../docs/listaMonitorias').MonitoriasDEX;

//  TESTE DOS TOKENS
//  TODO: Inserir token nos cookies
exports.realizarLogin = function(req,res) {
  console.log("\n\tVerificando credenciais...");
  Professor.findOne({login: req.body.login}, function(err, professor) {
      //  CASO DÊ ERRO
    if (err) {
      console.log("\tERRO!");
      res.status(500).json({"STATUS": "ERRO", "MENSAGEM": err});

      //  CASO NÃO SEJA ENCONTRADO
    } else if (professor === null) {
        console.log("\tNão encontrado!");
        res.status(202).json({"STATUS": "OK", "MENSAGEM": "Professor não encontrado no BD!"});

      // CASO SEJA ENCONTRADO
    } else {
      // CASO SENHA ESTEJA CERTA
      if (bcrypt.compareSync(req.body.senha, professor.senha)) {
        console.log("\tAutorizado!\n\tCriando token...");
        //Adiciona data de expiração para o token
        var expires = moment().add(7,'days').valueOf();
        //Cria token
        var token = jwt.encode({iss: professor._id, exp: expires}, config.segredo);
        res.status(200).json({"STATUS": "OK", "USUARIO": professor.nome, "TOKEN": token});
      } else {
        console.log("\tNão Autorizado!");
        res.status(401).json({"STATUS": "ERRO", "MENSAGEM": "não autorizado"});
      }
    }
  });

}

exports.verficarToken = function(req, res, next) {
  console.log('entrou');
  //  Coleta valor do token contido no header
  const bearerHeader = req.headers['authorization'];
  // checa se o campo do header está indefinido
  if (typeof bearerHeader !== 'undefined') {
    const aux = bearerHeader.split(' ');
    const bearerToken = aux[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403);
  }
};

exports.enviarDados = function(req,res) {
  res
    .status(200)
    .json({"STATUS": "OK", "DADOS": "Ullam esse quam vel. Culpa nesciunt ea. Nobis sint incidunt qui eum recusandae quas quia laborum.Accusantium aut illum sint ut repellendus laudantium ut perspiciatis tenetur. Et voluptatibus reprehenderit saepe eum sequi natus dolorem velit rerum. Nam velit occaecati. Dolor et cumque accusantium velit eveniet.Necessitatibus qui quia hic dolores. Iusto quidem laboriosam voluptatem voluptas. Quas dignissimos molestiae impedit repellat quia suscipit. Qui voluptatem minima debitis aperiam saepe."});
};

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
    // TODO: Testar else if
  } else if ((req.params.tipoUsuario) == 3) {
    this.criptografarPRG(req, res, req.params.ID);
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
        .json({"status": "OK", "discenteID": idAluno, "senhaOriginal": aluno.senha, "senhaCriptografada": senhaCriptografada});
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
        .json({"status": "OK", "docenteID": idProfessor, "senhaOriginal": professor.senha, "senhaCriptografada": senhaCriptografada});
    }
  });
};

//  TODO: Fazer essa função
exports.criptografarPRG = function(req, res, idPRG) {

};

exports.testarGerarRelatorio = function(req, res) {
  console.log('epa');
  this.criaPDF();
  res.status(200).json({"status": "OK"});
};

//  TODO: Criar teste de PDF para relatórios de monitores
exports.criaPDF = function() {
  listaMonitores.forEach(docente => {
    let doc = new PDF();
    doc.pipe(fs.createWriteStream('pdfs/relatorio_'+docente.matricula+'.pdf'));
    doc.text('Nome: '+docente.nome+' \nLogin: '+docente.login+' \nSenha: 123456', 100, 100);
    doc.end();
    console.log('PDF criado para '+docente.nome+'!');
  });
}