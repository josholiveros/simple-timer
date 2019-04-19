function TaskCreateController(parent, app) {
  let self = this;
  self.clientService = app.services.clientService;
  self.app = app;
  self.parent = parent;

  self.renderForm();

  self.app.addAppEventListener('task_created', () => {
    self.renderForm();
  });
}

function renderForm() {
  let self = this;
  let createForm = $(`
    <form class="form-inline" id="taskCreateForm">
      <label class="sr-only" for="taskTitle">Task</label>
      <input type="text" class="form-control mb-2 mr-sm-2" id="taskTitle" placeholder="Task">

      <label class="sr-only" for="taskGoal">Goal</label>
      <div class="input-group mb-2 mr-sm-2">
        <input type="text" class="form-control" id="taskGoal" placeholder="00:00:00">
      </div>

      <div class="form-check mb-2 mr-sm-2">
        <input class="form-check-input" type="checkbox" id="taskStartNow">
        <label class="form-check-label" for="taskStartNow">
          Start Now
        </label>
      </div>

      <button type="submit" class="btn btn-primary mb-2">Add</button>
    </form>`);
    
  createForm.on('submit', (evt) => {
    evt.preventDefault();

    let taskObj = {
      title: $('#taskTitle').val(),
      spent: 0,
      goal: moment.duration($('#taskGoal').val()).valueOf(),
      startTime: (new Date()).valueOf(),
      status: $('#taskStartNow').is(':checked') ? 'started' : 'stopped'
    };

    self.clientService.createTask(taskObj);
  });

  self.parent.html(createForm);
}

TaskCreateController.prototype = {
  renderForm
};
