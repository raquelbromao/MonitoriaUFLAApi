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

    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        if (err) {
            res.json(err);
        } else {
            //  Verifica se a monitoria já possui plano de trabalho cadastrado ou não
            if (monitoria.planoDeTrabalho.length > 0) {

                for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
                    atividadesIds.push(monitoria.planoDeTrabalho[i]);
                }

                //  Encontra cada tarefa registrada no Plano de Trabalho
                Atividade.find({_id:{ $in: atividadesIds }}, function(err, atividades) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.render('atividades/PlanoDeTrabalho', {"flag": true, "atividades": atividades, "monitoria": monitoria, "professor": req.params.professorId });
                    }
                });

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
        console.log('Atividade cadastrado com sucesso');
        console.log('Nova atividade ID: ' + atividade._id);

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

/*var verificaExistenciaDoPlanoDeCurso = function(monitoriaId, res) {
    var flag;
    Monitoria.findById(monitoriaId, function(err, monitoria) {
        if (err) {
            res.json(err);
        } else {
            //  Verifica se o plano de trabalho foi registrado
            if (monitoria.planoDeTrabalho.length > 0) {
                flag = true;
                return flag;
            } else {
                flag = false;
                return flag;
            } 
        }
    });
}*/

/*var buscaTiposDeAtividadeDoPlano = function(monitoriaId) {
    Monitoria.findById(req.params.monitoriaId, function(err, monitoria) {
        for (var i = 0; i < monitoria.planoDeTrabalho.length; i++) {
            atividadesIds.push(monitoria.planoDeTrabalho[i]);
        }

        //  Busca cada atividade registrada no plano de trabalho e adiciona o seu tipo a tiposAtividade[]
        for (var j = 0; j <= atividadesIds.length; j++) {
            Atividade.findById(atividadeIds[i], function(err, atividade) {
                tiposAtividade.push(atividade.tipo);
            });
        }
    });
};*/

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
            novaAtivRegistrada.data = new Date();

            novaAtivRegistrada.save(function(err, atividadeR) {
                if (err) {
                    res.json(err);
                } else {
       
                    Monitoria.findByIdAndUpdate(req.params.monitoriaId, {$push: {atividadesRegistradas: atividadeR._id} } ,function(err, monitoria) {
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

exports.excluirAtivReg = function(req,res) {
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
                console.log('Atividade excluída com sucesso!');
                res.redirect('/indexMonitores/'+req.params.monitorId);
            }
        });
    }
    });

};


