"use strict";

var mongoose = require("mongoose");
var Atividade = mongoose.model("Atividades");
var AtividadeRegistrada = mongoose.model("AtividadesRegistradas");
var Monitoria = mongoose.model("Monitorias");
var Professor = mongoose.model("Professores");
var Monitor = mongoose.model("Monitores");

exports.listarAtividades = function(req,res) {
    //  Array criado para adicionar as Ids das atividades vinculadas a monitoria
    var atividadesIds = [];
    var atividadesRegIds = [];

    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        if (err) {
            res.json(err);
        } else {
            //  Verifica se a monitoria já possui plano de trabalho cadastrado ou não
            if (monitoria.planoDeTrabalho.length > 0) {

                for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
                    atividadesIds.push(monitoria.planoDeTrabalho[i]);
                }

                //  Verifica se a monitoria já possui atividades registradas pelo monitor ou não
                if (monitoria.atividadesRegistradas.length > 0) {

                    for (var i = 0; i < monitoria.atividadesRegistradas.length; i++) {
                        atividadesRegIds.push(monitoria.atividadesRegistradas[i]);
                    }

                    //console.log(atividadesRegIds);

                    //  Encontra cada tarefa registrada no Plano de Trabalho
                    Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                        if (err) {
                            res.json(err);
                        } else {
                            // Encontra cada tarefa registrada pelo monitor
                            AtividadeRegistrada.find({_id:{ $in: atividadesRegIds }},function(err,atividadesR) {
                                if(err) {
                                    res.json(err);
                                } else {
                                    res.render('atividades/PlanoDeTrabalho', {"flag": true, "possuiAtReg": true, "atividades": atividades, "atividadesR": atividadesR ,"monitoria": monitoria, "professor": req.params.professorId });
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
                            res.render('atividades/PlanoDeTrabalho', {"flag": true, "possuiAtReg": false, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
                        }
                    });

                }

            } else {
                res.render('atividades/PlanoDeTrabalho', {"flag": false, "monitoria": monitoria, "professor": req.params.professorId });
            }
        }
    });

};

exports.verPCadastro = function(req,res) {
    res.render('atividades/cadastroAtividades', {"monitoria": req.params.monitoriaId, "professor": req.params.professorId});
};

exports.cadastrarAtividade = function(req,res) {
    //  Cria novo objeto Atividade
    var atividadeNova = new Atividade();

    //  Salva todos as info da requisição em cada componente de Atividade
    atividadeNova.tipo = req.body.tipo;
    atividadeNova.observacoes = req.body.observacoes;
    atividadeNova.horasTotais = req.body.horasTotais;

    if (req.body.tipo == 'ATV01') {
        atividadeNova.titulo = 'Atendimento aos alunos';
    } 
    
    if (req.body.tipo == 'ATV02') {
        atividadeNova.titulo = 'Elaboração de material didático';
    }
    
    if (req.body.tipo == 'ATV03') {
        atividadeNova.titulo = 'Correção de avaliações';
    }
    
    if (req.body.tipo == 'ATV04') {
        atividadeNova.titulo = 'Monitoria em aula';
    }
    
    if (req.body.tipo == 'ATV05') {
        atividadeNova.titulo = 'Outros';
    }

    //  Salva atividade no BD
    atividadeNova.save(function(err, atividade) {
        if (err) {
        res.json(err);
        } else {
        // console.log('Atividade cadastrado com sucesso');
        // console.log('Nova atividade ID: ' + atividade._id);

        Monitoria.findByIdAndUpdate(req.params.monitoriaId, {$push: {planoDeTrabalho: atividade._id, tiposAtividades: atividade.tipo} }, function(err, monitoria) {
            if (err) {
                res.json(err);
            } else {
                res.redirect('/planoMonitoria/index/'+req.params.professorId+'/'+req.params.monitoriaId);
            }
        });

        }
    });
};

exports.excluirAtividade = function(req,res) {
    //  Remove atividade do Plano de Trabalho da monitoria
   Monitoria.findByIdAndUpdate(req.params.monitoriaId, { $pull: {planoDeTrabalho: req.params.atividadeId} }, function(err,monitoria) {
        if (err) {
            res.json(err);
        } else {

            //  Remove a atividade da sua coleção (documento)
            Atividade.findByIdAndRemove(req.params.atividadeId, function(err, atividade) {
                if (err) {
                    res.json(err);
                } else {
                    console.log('Atividade excluída com sucesso!');
                    res.redirect('/planoMonitoria/index/'+req.params.professorId+'/'+req.params.monitoriaId);
                }
            });
        }
    });    
};

exports.mostrarAtivEdicao = function(req,res) {
    Atividade.findById(req.params.atividadeId, function(err, atividade) {
        if (err) {
            res.json(err);
        } else {
            res.render('atividades/edicaoAtividade', {"atividade": atividade, "professor": req.params.professorId, "monitoria": req.params.monitoriaId});  
        }
    });
};

exports.editarAtividade = function(req,res) {
    Atividade.findByIdAndUpdate(req.params.atividadeId, 
        { observacoes: req.body.observacoes, horasTotais: req.body.horasTotais },
        function(err, atividade){
            if (err) {
                res.json(err);
            } else {
                res.redirect('/planoMonitoria/index/'+req.params.professorId+'/'+req.params.monitoriaId);
            }
    });

};

exports.mostrarPaginaAtivRegistro = function(req, res) {
    var atividadesIds = [];

    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        if (err) {
            res.json(err);
        } else {
            //  Verifica se o plano de trabalho foi registrado
            if (monitoria.planoDeTrabalho.length > 0) {

                //  Pesquisa todas as atividades do plano de trabalho
                for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
                    atividadesIds.push(monitoria.planoDeTrabalho[i]);
                }

                //  Encontra cada tarefa registrada no Plano de Trabalho
                Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.render('atividades/registroAtividade', {"flag": true, "atividades": atividades, "monitoria": monitoria, "monitor": req.params.monitorId });
                    }
                });
            
            //  Caso não haja plano de trabalho cadastrado ainda
            } else {
                res.render('atividades/registroAtividade', {"flag": false, "monitoria": monitoria, "monitor": req.params.monitorId});
            } 
        }
    });
};

exports.registrarAtividade = function(req,res) {
    var novaAtivRegistrada = new AtividadeRegistrada();

    var teste = new Date();
    var aux_data = teste.toLocaleDateString().split("-");
    var aux_tempo = teste.toLocaleTimeString().split(":");

    var aux = "";
    var data = aux.concat(aux_data[2],"/",aux_data[1],"/",aux_data[0]);

    var aux1 = "";
    var tempo = aux1.concat(aux_tempo[0],":",aux_tempo[1]);

    Atividade.findById(req.body.atividadeEscolhida, function(err, atividade) {
        if (err) {
            res.json(err);
        } else {
            novaAtivRegistrada.tipo = atividade.tipo;
            novaAtivRegistrada.titulo = atividade.titulo;
            novaAtivRegistrada.observacoes = req.body.observacoes;
            novaAtivRegistrada.contagemAtendimento = req.body.contagemAtendimento;
            novaAtivRegistrada.horaInicio = req.body.horaInicio;
            novaAtivRegistrada.horaTermino = req.body.horaTermino;
            novaAtivRegistrada.data.hora = tempo;
            novaAtivRegistrada.data.dia = data;

            //  Tratamento de horas
            let aux_tempo1 = req.body.horaInicio.split(":");
            let aux_tempo2 = req.body.horaTermino.split(":");

            var horaInicial = new Date(0,0,0,aux_tempo1[0],aux_tempo1[1]).getTime();
            var horaFinal = new Date(0,0,0,aux_tempo2[0],aux_tempo2[1]).getTime();

            novaAtivRegistrada.horasRegistradas = (horaFinal - horaInicial) / 3600000;

            //  Cálculo de porcentagem
            var porc = (novaAtivRegistrada.horasRegistradas * 100) / atividade.horasTotais;

            novaAtivRegistrada.save(function(err, atividadeR) {
                if (err) {
                    res.json(err);
                } else {
                    //console.log(atividadeR);

                    Monitoria.findByIdAndUpdate(req.params.monitoriaId, {$push: {atividadesRegistradas: atividadeR._id} } ,function(err, monitoria) {
                        if (err) {
                            res.json(err);
                        } else {
                            Atividade.findByIdAndUpdate(req.body.atividadeEscolhida, {$push: {atividadesRegistradas: atividadeR._id}, $inc: {horasContabilizadas: atividadeR.horasRegistradas}, $inc: {porcentagem: porc} }, function(err, atividade) {
                                if (err) {
                                    res.json(err);
                                } else {
                                    res.redirect('/indexMonitores/'+req.params.monitorId);
                                }
                            });    
                            
                        }
                    });

                }    
            });
        
        }
    });
};

exports.excluirAtivRegM = function(req,res) {
    //  Remove atividade  de Atividades Registradas da monitoria
   Monitoria.findByIdAndUpdate(req.params.monitoriaId, { $pull: {atividadesRegistradas: req.params.atividadeRegistradaId} }, function(err,monitoria) {
    if (err) {
        res.json(err);
    } else {        
        //  Remove a atividade registrada da sua coleção (documento)
        AtividadeRegistrada.findByIdAndRemove(req.params.atividadeRegistradaId, function(err, atividadeR) {
            if (err) {
                res.json(err);
            } else {

                //  Cálculo de porcentagem
                var porc = (atividadeR.horasRegistradas * 100) / atividade.horasTotais;

                //  Remove a atividade registrada da sua atividade do plano de trabalho ao qual pertence
                Atividade.findOneAndUpdate({atividadesRegistradas: req.params.atividadeRegistradaId},{ $pull: {atividadesRegistradas: req.params.atividadeRegistradaId}, $inc: {horasContabilizadas: -(atividadeR.horasRegistradas) }, $inc: {porcentagem: -((atividadeR.horasRegistradas * 100) / atividade.horasTotais)} },function(err,atividade){
                    if (err) {
                        res.json(err);
                    } else {
                        res.redirect('/indexMonitores/'+req.params.monitorId);
                    }
                });
            }
        });
    }
    });

};

exports.excluirAtivRegP = function(req,res) {
    //  Remove atividade  de Atividades Registradas da monitoria
    Monitoria.findById(req.params.monitoriaId, function(err,monitoria) {
        if (err) {
            res.json(err);
        } else {        
            //  Remove a atividade registrada da sua coleção (documento)
            AtividadeRegistrada.findById(req.params.atividadeRegistradaId, function(err, atividadeR) {
                if (err) {
                    res.json(err);
                } else {
                    //  Remove a atividade registrada da sua atividade do plano de trabalho ao qual pertence
                    Atividade.findOne({atividadesRegistradas: req.params.atividadeRegistradaId}, function(err,atividade){
                        if (err) {
                            res.json(err);
                        } else {
                            console.log(monitoria);
                            console.log(atividadeR);
                            console.log(atividade);
                            res.redirect('/planoMonitoria/index/'+req.params.professorId+'/'+req.params.monitoriaId);
                        }
                    });

                }
            });
            
        }
    });

};

exports.testarString = function(req,res) {
    /*var teste = new Date();
    var aux_data = teste.toLocaleDateString().split("-");
    var aux_tempo = teste.toLocaleTimeString().split(":");

    var aux = "";
    var data = aux.concat(aux_data[2],"/",aux_data[1],"/",aux_data[0]);

    var aux1 = "";
    var tempo = aux1.concat(aux_tempo[0],":",aux_tempo[1]);

    var novaAtivRegistrada = new AtividadeRegistrada();

    novaAtivRegistrada.tipo = "ATV01";
    novaAtivRegistrada.titulo = "TESTE";
    novaAtivRegistrada.observacoes = "";
    novaAtivRegistrada.contagemAtendimento = 5;
    novaAtivRegistrada.horaInicio = "16:00";
    novaAtivRegistrada.horaTermino = "17:00";
    novaAtivRegistrada.data.hora = tempo;
    novaAtivRegistrada.data.dia = data;

    console.log(novaAtivRegistrada.data);*/

    //var teste = new Date();
    //var aux_tempo = teste.toLocaleTimeString();

    let tempo1 = "00:00";
    let tempo2 = "2:00";

    let aux_tempo1 = tempo1.split(":");
    let aux_tempo2 = tempo2.split(":");

    var data1 = new Date(null,null,null,aux_tempo1[0],aux_tempo1[1]);
    var data2 = new Date(0,0,0,aux_tempo2[0],aux_tempo2[1]);

    //var teste1 = new Date(0,0,0,aux_tempo1[0],aux_tempo1[1]).getTime();
    //var teste2 = new Date(0,0,0,aux_tempo2[0],aux_tempo2[1]).getTime();

    var totalHoras = (data2.getTime() - data1.getTime()) / 3600000;
    console.log(data1+"\n"+data2+"\n"+totalHoras);
};


