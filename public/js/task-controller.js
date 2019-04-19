function TaskController(task, app) {
  let self = this;
  self.clientService = app.services.clientService;
  self.app = app;
  
  self.data = task;
}

function showNotification() {
  let self = this;
  if (self.data.status === 'started') {
    Notification && Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification('Task Finished', {
          body: self.data.title,
          requireInteraction: true,
          renotify: self.progress < 110,
          tag: self.data._id
        });
      }
    });
  }
}

function refreshRow() {
  let self = this;

  let timeSpent = self.data.status === 'started' ?
    (new Date()).valueOf() - self.data.startTime + self.data.spent :
    self.data.spent;

  self.progress = Math.floor((timeSpent / self.data.goal) * 100);

  self.elem.find('#spent').text(moment.utc(timeSpent).format('HH:mm:ss'));
  self.elem.find('#goal').text(moment.utc(self.data.goal).format('HH:mm:ss'));
  //self.elem.find('#progress').text(`${progress} %`);

  self.refreshProgressBar();
}

function refreshProgressBar() {
  let self = this;
  self.elem.find('.progress').addClass(self.data.status);

  let pb = self.elem.find('#progress .progress-bar');
  let pbClass = ['progress-bar'];
  if (self.data.status === 'started') {
    pbClass.push('progress-bar-striped');
    pbClass.push('progress-bar-animated');
  }
  if (self.progress >= 100 ) {
    pbClass.push('bg-success');

    self.showNotification();
  }
  if (self.progress > 110) {
    pbClass.push('bg-danger');
  }

  pb.css('width', `${self.progress}%`);
  pb.addClass(pbClass.join(' '));
}

function renderTask() {
  let self = this;
  let playOrPause = self.data.status === 'started' ?
    '<i class="fas fa-pause-circle" id="pause"></i>' :
    '<i class="fas fa-play-circle" id="play"></i>';
  let taskDom = $(`
    <tr>
      <th scope="row">${_.get(self.data, 'title')}</th>
      <td id="spent"></td>
      <td id="goal"></td>
      <td id="progress">
        <div class="progress">
          <div class="progress-bar" 
               role="progressbar" 
               aria-valuenow="75" 
               aria-valuemin="0" 
               aria-valuemax="100" 
               style="width: 75%"></div>
        </div>
      </td>
      <td class="task-controls">
        ${playOrPause}
        <i class="fas fa-info-circle" id="info"></i>
        <i class="fas fa-sync-alt" id="reset"></i>
        <i class="fas fa-minus-circle" id="delete"></i>
      </td>
    </tr>`);

  taskDom.find('#play').click(() => self.startTask());
  taskDom.find('#pause').click(() => self.pauseTask());
  taskDom.find('#info').click(() => self.displayInfo());
  taskDom.find('#reset').click(() => self.resetTask());
  taskDom.find('#delete').click(() => self.deleteTask());

  self.elem = taskDom;

  self.refreshRow();

  return taskDom;
}

function startTask() {
  let self = this;
  self.data.status = 'started';
  self.data.startTime = (new Date()).valueOf();
  self.clientService.updateTask(self.data);
}

function pauseTask() {
  let self = this;
  self.data.status = 'stopped';
  self.data.spent += (new Date()).valueOf() - self.data.startTime;
  self.clientService.updateTask(self.data);
}

function displayInfo() {
  let self = this;
  let editController = new TaskEditController($('#editTaskModal'), self.app, self.data);
}

function resetTask() {
  let self = this;
  if (!confirm(`Reset '${self.data.title}'?`)) {
    return;
  }
  self.data.spent = 0;
  self.data.startTime = (new Date()).valueOf();
  self.clientService.updateTask(self.data);
}

function deleteTask() {
  let self = this;
  // TODO: add confirmation prompt here
  if (!confirm(`Delete '${self.data.title}'?`)) {
    return;
  }
  self.clientService.deleteTask(self.data);
}

TaskController.prototype = {
  refreshRow,
  renderTask,
  startTask,
  pauseTask,
  displayInfo,
  resetTask,
  deleteTask,
  refreshProgressBar,
  showNotification
};
