function TaskListController(mainList, app) {
  let self = this;
  self.app = app;
  self.clientService = app.services.clientService;

  self.mainList = mainList;
  self.tasks = [];

  let refreshCallback = () => {
    self.refreshList();
  };

  self.app.addAppEventListener('task_created', refreshCallback);
  self.app.addAppEventListener('task_updated', refreshCallback);
  self.app.addAppEventListener('task_deleted', refreshCallback);
  self.app.addAppEventListener('authenticated', refreshCallback);

  self.refreshInterval = setInterval(() => {
    _.forEach(self.tasks, task => task.refreshRow());
  }, 3000);

  self.refreshListInterval = setInterval(refreshCallback, 10000);
}

function renderTasks(tasks) {
  let self = this;
  self.tasks = _.map(tasks, (task) => {
    return new TaskController(task, self.app);
  });
  self.mainList.children('tbody').html(
    _.map(self.tasks, task => task.renderTask())
  );
}

function refreshList() {
  let self = this;

  self.clientService.getTasks().then((tasks) => {
    self.renderTasks(tasks);
  });
}

function downloadTasks() {
  //"data:text/csv;charset=utf-8,"
  let self = this;
  let taskData = _.concat(
    [['Task', 'Time Spent', 'Goal', 'Progress']],
    _.map(self.tasks, (task) => {

      let timeSpent = task.data.status === 'started' ?
        (new Date()).valueOf() - task.data.startTime + task.data.spent :
        task.data.spent;

      return [
        `"${task.data.title}"`,
        `"${moment.utc(timeSpent).format('HH:mm:ss')}"`,
        `"${moment.utc(task.data.goal).format('HH:mm:ss')}"`,
        `"${Math.floor((timeSpent / task.data.goal) * 100)} %"`
      ].join(',')
    }));
  let data = 'data:text/csv;charset=utf-8,' + taskData.join('\n');

  window.open(encodeURI(data));
}

TaskListController.prototype = {
  renderTasks,
  refreshList,
  downloadTasks
};
