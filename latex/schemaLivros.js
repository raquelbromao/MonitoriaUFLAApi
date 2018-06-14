var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LivroSchema = new Schema({
  ISBN: {
    type: String,
    required: true
  },
  Titulo: {
    type: String,
    required: true,
    maxlength: 100
  },
  Autor: [{
    nome: {
        type: String,
        maxlength: 100
    },
    email: {
        type: String,
        maxlength: 50
    },
    endereco: {
        type: String,
        maxlength: 200
    }
  }],
  Editora: {
    nome: String,
    maxlength: 100
  }
});

var livroNovo = new LivroSchema({
    ISBN: 9788531902222,
    Titulo: "E O Vento Levou",
    Autor: {
        nome: "Margaret Mitchell",
        email: "margaretmitchell@essex.net.br",
        endereco: "990 Peachtree St NE, Atlanta, GA 30309-3901"
    },
    Editora: {
        nome: "BestBolso"
    }
})

livroNovo.save(function(err, livro) {
    if (err) {
      return err;
    } else {
      return livro;
    }
});

livroNovo.find({ISBN:"9788531902222"}, function(err,livro) {
    if (err) {
        return err;
    } else {
        return livro;
    }
});

livroNovo.update(
    {ISBN:"9788531902222"}, 
    { $set: {Editora: "Pinguin Books"}}, 
    function(err)  {
        if (err) {
            return err;
        }    
});

livroNovo.remove({ISBN:"9788531902222"}, function(err) {
    if (err) {
        return err;
    } 
});
