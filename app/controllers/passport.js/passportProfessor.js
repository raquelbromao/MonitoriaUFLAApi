"use strict";
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Professor = mongoose.model("Professores");

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'senha'
    }, 
    function (login, senha, cb) {
        return Professor.findOne({login, senha})
           .then(professor => {
               if (!professor) {
                   return cb(null, false, {message: 'Login ou senha incorretos!'});
               }
               return cb(null, professor, {message: 'Logado com sucesso'});
          })
          .catch(err => cb(err));
    }
))