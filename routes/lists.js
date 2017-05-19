const
  express = require('express'),
  mongoose = require('mongoose'),
  listRouter = express.Router(),
  List = require('../models/List.js'),
  tasksController = require('../controllers/task.js'),
  listsController = require('../controllers/list.js')
//routes for the list
listRouter.route('/')
  .get(listsController.index)

listRouter.route('/:id/copy/:user_id')
  .get((req, res) => {
    console.log(req.params);
    List.findById(req.params.id).exec(
      function(err, doc){
        doc._id = mongoose.Types.ObjectId();
        doc.isNew = true;
        doc.user = req.params.user_id
        doc.save(function(err, doc){
          if(err){
            console.log(err)
          }else{
            // res.json(doc)
            console.log('it saved! cool')
          }
        })
        res.redirect('/lists')

      }
    )
  })

listRouter.route('/:id')
  .get(listsController.show)
  .patch(listsController.update)
  .delete(listsController.destroy)

listRouter.route('/:id/edit')
  .get(listsController.edit)
//routes for the tasks
listRouter.route('/:id/tasks')
  .get(tasksController.index)
  .post(tasksController.create)

listRouter.route('/:id/tasks/:taskId')
  .patch(tasksController.update)
  .delete(tasksController.destroy)


module.exports = listRouter
