"use strict";

const PDF      = require('html-pdf');
const ejs      = require('ejs');
const mongoose = require("mongoose");
const fs       = require('fs');

var Monitoria           = mongoose.model("Monitorias");
var Atividade           = mongoose.model("Atividades");
var AtividadeRegistrada = mongoose.model("AtividadesRegistradas");

var templateString = null;
var templateString = fs.readFileSync('C:/Users/Raquel/Desktop/monitoriaUflaApi/app/templates/relatorioMensalAluno.ejs', 'utf-8');

exports.criarPDF = function(html) {
    console.log('Session: '+req.session);
    console.log('req: '+req);
    
    PDF.create(html).toFile('./teste.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
      });
}

exports.gerarHTML = function(req, res) {
    //  Array criado para adicionar as Ids das atividades vinculadas a monitoria
    var atividadesIds = [];
    var atividadesRegIds = [];
    //  Flags criadas para identificar quais informações terão ou não na página
    var flagPlanoT = false;
    var flagAtivReg = false;

    // Busca o ID da monitoria vinculada e suas informações correspondentes
    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        if (err) {
        res.json(err);
        } 
        //  Verifica se a monitoria já possui plano de trabalho cadastrado ou não
        if (monitoria.planoDeTrabalho.length > 0) {
            flagPlanoT = true;
            for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
                atividadesIds.push(monitoria.planoDeTrabalho[i]);
            }

            //  Verifica se a monitoria já possui atividades registradas pelo monitor ou não
            if (monitoria.atividadesRegistradas.length > 0) {
            flagAtivReg = true;
            for (var i = 0; i < monitoria.atividadesRegistradas.length; i++) {
                atividadesRegIds.push(monitoria.atividadesRegistradas[i]);
            }

            //  Encontra cada tarefa registrada no Plano de Trabalho
            Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                if (err) {
                    res.json(err);
                } else {
                    // Encontra cada tarefa registrada pelo monitor
                    AtividadeRegistrada.find({_id:{ $in: atividadesRegIds }},function(err,atividadesR) {
                        if (err) {
                            res.json(err);
                        } else {
                            var html = ejs.render(templateString, {"flagPlanoT": flagPlanoT, "flagAtivReg": flagAtivReg, "atividades": atividades, "atividadesR": atividadesR ,"monitoria": monitoria, "professor": req.params.professorId});
                            PDF.create(html).toFile('./pdfs/teste.pdf', function(err, xxx) {
                                if (err) return console.log(err);
                                console.log(xxx); // { filename: '/app/businesscard.pdf' }
                            });
                        }
                    });

                }
            });

            } else {
            //  Encontra cada tarefa registrada no Plano de Trabalho
            Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                if (err) {
                    res.json(err);
                } else {
                    var html = ejs.render(templateString, {"flagPlanoT": flagPlanoT, "flagAtivReg": flagAtivReg, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
                    PDF.create(html).toFile('./pdfs/teste.pdf', function(err, xxx) {
                        if (err) return console.log(err);
                        console.log(xxx);
                    });
                }
            });
            }  

        } else {
            res.end(ejs.render(templateString, {"flagPlanoT": flagPlanoT, "flagAtivReg": flagAtivReg, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId }));
        }    

    });
}
    