function AppController(config) {
  let self = this;
  self.config = config;
  self.listeners = {};
  
  self.addAppEventListener('401', (msg) => {
    $('#loginForm').show();
    $('#mainApp').hide();
  });
  self.addAppEventListener('authenticated', (msg) => {
    $('#loginForm').hide();
    $('#mainApp').show();
  });

  self.services = {
    clientService: new ClientService(self)
  };
  self.controllers = {
    user: new UserController($('#loginForm'), self),
    taskList: new TaskListController($('#mainList'), self),
    taskCreate: new TaskCreateController($('#createFormWrapper'), self)
  };

  $('#downloadBtn').click(() => {
    self.controllers.taskList.downloadTasks();
  });
}

function addAppEventListener(ev, cb) {
  this.listeners[ev] = this.listeners[ev] || [];

  this.listeners[ev].push(cb);
}

function dispatchEvent(ev, args) {
  let listeners = this.listeners[ev];

  for (let i in listeners) {
    listeners[i](args);
  }
}

AppController.prototype = {
  addAppEventListener,
  dispatchEvent
};

(function () {
  $(document).ready(function () {
    const config = {
      apiUrl: ''
    };

    let app = new AppController(config);
  });
})();
