'use strict';

//  BANCO DE DADOS
exports.uriMongo = "mongodb://pipoca:123456@ds141464.mlab.com:41464/api_monitoria";
exports.uriMongoLocal = "mongodb://localhost/MonitoriaUflaDB";

//  Bcrypt
exports.saltosCriptografia = 10;
exports.senhaPadrao = "123456";

//  JWT-Token
exports.segredo = "D34gjsk6cw75hgu";

//  CÓDIGOS
exports.ultimosCodigos = {
    DCC: 4,
    DEX: 0,
    Discentes: 0
};