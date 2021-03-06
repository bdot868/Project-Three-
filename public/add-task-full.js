var tasksList = $('#tasks-list')
var taskInput = $('#task-input')
var addTask = $('#add-task')


///append all tasks to the list
function appendTask(task){
  var theLi = $('<li>').attr('id', task._id)
  theLi.html('<span>' + task.body + '</span>')
  var editButton = $('<button>').addClass('edit')
  editButton.text('Edit')
  var deleteButton = $('<button>').addClass('delete')
  deleteButton.text('Delete')
  theLi.append(editButton, deleteButton)
  tasksList.append(theLi)
}

///have all tasks show up at once
var requestSettings = {
  method: 'get',
  url: '/lists/<%=list.id%>/tasks'
}
$.ajax(requestSettings).done(function(allTasks){
  tasksList.html('')
  allTasks.forEach(function(task){
    appendTask(task)
  })
})
//create a task
addTask.on('click', function(){
  var requestSettings = {
    method: 'post',
    url: '/lists/<%=list.id%>/tasks',
    data: JSON.stringify({body: taskInput.val(), completed: false}),
    contentType: 'application/json'
  }
  $.ajax(requestSettings)
    .done(function(newTask){
      console.log(newTask)
      appendTask(newTask)
      taskInput.val('')
    })
})
// edit a task:
var editForm = $('<div>').attr('id', 'edit-form')
editForm.append('<input type="text" class="edit-input">')
editForm.append('<button>Update</button>')
editForm.hide()

tasksList.on('click', 'li button.edit', function(){
  $(this).parent().append(editForm)
  editForm.slideDown()
  $('.edit-input').val($(this).prev().text())
})

tasksList.on('click', '#edit-form button', function(){
  var id = $(this).parent().parent().attr('id')
  var requestSettings = {
    method: 'patch',
    url: '/lists/<%=list.id%>/tasks/'+id,
    data: JSON.stringify({body: $(this).prev().val()}),
    contentType: 'application/json'
  }
  $.ajax(requestSettings)
    .done(function(data){
      $('#' + id + ' span').text(data.task.body)
      editForm.slideUp()
      console.log(data)
    })
})

tasksList.on('click', 'li button.delete', function(){
  var id = $(this).parent().attr('id')
  var requestSettings = {
    method: 'delete',
    url: '/lists/<%=list.id%>/tasks/'+id,
  }
  $.ajax(requestSettings)
    .done(function(data){
      $('#'+id).remove()
    })
})
