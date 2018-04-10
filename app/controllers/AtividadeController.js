"use strict";

var mongoose = require("mongoose");
var Atividade = mongoose.model("Atividades");
var Monitoria = mongoose.model("Monitorias");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");

exports.listarTarefas = function(req,res) {
    //  Array criado para adicionar as Ids das atividades vinculadas a monitoria
    var atividadesIds = [];

    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        if (err) {
            res.json(err);
        } else {
            //  Verifica se a monitoria já possui atividades ou não
            if (monitoria.atividades != null) {

                for (var i = 0; i < monitoria.atividades.length; i++) {
                    atividadesIds.push(monitoria.atividades[i]);
                }

                //  Encontra cada atividade que se encontra no array atividadesIds
                Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                    if (err) {
                        res.json(err);
                    } else {
                        //console.log(atividades);
                        res.render('atividades/admAtividades', {"atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
                    }
                });

            } else {
                console.log('Monitoria sem atividades! Outra tela!')
            }
        }
    });

};


exports.verPCadastro = function(req,res) {
    res.render('cadastroAtividade', {"monitoria": req.params.monitoriaId, "professor": req.params.professorId});
};

exports.cadastrarAtividade = function(req,res) {
    //  Cria novo objeto Atividade
    var atividadeNova = new Atividade();

    //  Salva todos as info da requisição em cada componente de Atividade
    atividadeNova.tipoDeAtividade = req.body.tipoDeAtividade;
    atividadeNova.descricao = req.body.descricao;
    atividadeNova.prazo = req.body.prazo;
    atividadeNova.foiTerminada = false;

    console.log(req.body);

    /**
     * Salva atividade no BD
    */
    atividadeNova.save(function(err, atividade) {
        if (err) {
        res.json(err);
        } else {
        //console.log('Atividade cadastrado com sucesso');
        //console.log('Nova atividade ID: ' + atividade._id);
        //res.redirect('/atividades/index/'+req.params.professorId+'/'+req.params.monitoriaId);

        Monitoria.findByIdAndUpdate(req.params.monitoriaId, {$push: {atividades: atividade._id}}, function(err, monitoria) {
            if (err) {
                res.json(err);
            } else {
                //console.log(monitoria);
                //console.log(monitoria.atividades)
                res.redirect('/atividades/index/'+req.params.professorId+'/'+req.params.monitoriaId);
            }
        });

        }
    });
};
