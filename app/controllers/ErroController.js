"use strict";

/**
 * Função identifica o erro por seu ID e reporta o usuário a sua página de erro
 * @param {*} req 
 * @param {*} res 
 */
exports.reportarErro = function(req,res) {
    console.log(req.params);
    console.log(req.body);
}