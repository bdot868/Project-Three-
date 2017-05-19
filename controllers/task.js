const
  Task = require('../models/List.js'),
  List = require('../models/List.js')

module.exports = {
  index: (req, res) => {
    List.findById(req.params.id, (err, list) => {
      var task = list.task
      console.log(task)
      res.json(task)
    })
  },
  create: (req, res) => {
    List.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, list) => {
      if(err) return console.log(err)
      var newTask = {}
      newTask.body = req.body.body
      console.log(newTask)
      newTask.completed = false
      list.task.push(newTask)
      list.save((err, list) => {
        res.json(list.task[list.task.length -1])
      })
    })
  },
  update: (req, res) => {
    List.findByIdAndUpdate(req.params.id, req.body,{new: true}, function(err, list){
      var newTask = list.task.id(req.params.taskId)
      var index = list.task.indexOf(newTask)
      list.task[index]= req.body
      console.log(list.task[index]);
      list.save((err, list) => {
        res.json({message: 'updated list', task: list.task[index]})
      })
    })
  },
  destroy: (req, res) => {
    List.findById(req.params.id, function(err, list){
      var task = list.task.id(req.params.taskId)
      var index = list.task.indexOf(task)
      list.task.splice(index, 1)
      list.save()
      // task.remove()
      res.json({message: 'Deleted'})
    })
  }
}
