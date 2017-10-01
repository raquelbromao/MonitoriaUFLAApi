'use strict';

module.exports = function(app) {
  var metodosAlun = require('../controllers/AlunoController');
  var metodosProf = require('../controllers/ProfessorController')

  // todoList Routes
  app.get('/', function(req, res, next) {
    res.render('index')
      /*// This isn't part of API and is just used from a browser or curl to test that
      var testObject = {
          "AppName": "MonitoriaUFLAApi",
          "Version": '1.0'
      }
      res.json(testObject);*/
  });

  app.route('/alunos')
    .get(metodosAlun.listar_todos_objetos)
    .post(metodosAlun.criar_objeto);

  app.route('/alunos/:alunoId')
    .get(metodosAlun.ler_objeto)
    .put(metodosAlun.atualizar_objeto)
    .delete(metodosAlun.deletar_objeto);

  app.route('/professores')
    .get(metodosProf.listar_todos_objetos)
    .post(metodosProf.criar_objeto);

  app.route('/professores/:professorId')
    .get(metodosProf.ler_objeto)
    .put(metodosProf.atualizar_objeto)
    .delete(metodosProf.deletar_objeto);

  /*app.route('/monitorias')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  /*app.route('/monitorias/:monitoriaId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
};
