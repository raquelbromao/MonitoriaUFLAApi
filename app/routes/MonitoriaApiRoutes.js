'use strict';

module.exports = function(app) {
  //var todoList = require('../controllers/MonitoriaApiController');

  // todoList Routes
  app.get('/', function(req, res, next) {
    res.render('index')
      /*
      // This isn't part of API and is just used from a browser or curl to test that
      var testObject = {
          "AppName": "MonitoriaUFLAApi",
          "Version": '1.0'
      }
      res.json(testObject);*/
  });

  /*app.route('/alunos')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app.route('/professores')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app.route('/monitorias')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app.route('/teste')
    .get(function(req, res) {
        res.render('teste')
    });

  app.route('/alunos/:alunoId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);

  app.route('/professores/:professorId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);

  app.route('/monitorias/:monitoriaId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
};
