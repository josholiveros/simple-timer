function ClientService(app) {
  this.config = app.config;
  this.checkAuthentication();
  this.app = app;

  this.app.addAppEventListener('401', () => {
    localStorage.removeItem('authToken');
  });
}

function getAuthToken() {
  return localStorage.getItem('authToken');
}

function setAuthToken(authToken) {
  return localStorage.setItem('authToken', authToken);
}

function getBaseSettings(method, restObject) {
  let self = this;
  let settings = {
    'async': true,
    'crossDomain': true,
    'url': `${self.config.apiUrl}/${restObject}`,
    'method': method,
    'headers': self.getAuthHeaders(),
    'processData': false
  };

  return settings;
}

function getAuthHeaders() {
  let self = this;
  let header = {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache'
  };
  let authToken = self.getAuthToken();

  if (authToken) {
    header['Authorization'] = authToken;
  }
  return header;
}

function checkAuthentication() {
  let self = this;

  let settings = self.getBaseSettings('POST', 'authentication');
  settings.data = '';

  $.ajax(settings).then((response) => {
    self.app.dispatchEvent('authenticated');
  }, (err) => {
    console.error(err);
    self.app.dispatchEvent(err.status);
  });
}

function unAuthenticate() {
  this.app.dispatchEvent('401');
}

function authenticate(user) {
  let self = this;
  user = user || {};
  user.strategy = 'local';

  let settings = self.getBaseSettings('POST', 'authentication');
  settings.data = JSON.stringify(user);

  $.ajax(settings).then((response) => {
    if (response.accessToken) {
      self.setAuthToken(response.accessToken);
      self.app.dispatchEvent('authenticated');
      console.log('User Authenticated');
    } else {
      self.app.dispatchEvent('401');
    }
  }, (err) => {
    self.app.dispatchEvent(err.status);
  });
}

function getTasks(params = {}) {
  let self = this;
  let settings = self.getBaseSettings('GET', 'tasks?$sort[createdAt]=-1');

  return $.ajax(settings).then(function (response) {
    return _.get(response, 'data');
  });
}

function createTask(task) {
  let self = this;
  let settings = self.getBaseSettings('POST', 'tasks');
  settings.data = JSON.stringify(task);

  return $.ajax(settings).then(function (response) {
    self.app.dispatchEvent('task_created', response);
    return response;
  });
}

function updateTask(task) {
  if (_.isEmpty(task._id)) {
    console.error(`Task has no id: ${JSON.stringify(task)}`);
    return;
  }
  let self = this;
  let settings = self.getBaseSettings('PUT', `tasks/${task._id}`);
  settings.data = JSON.stringify(task);

  return $.ajax(settings).then(function (response) {
    self.app.dispatchEvent('task_updated', response);
    return response;
  });
}

function deleteTask(task) {
  if (_.isEmpty(task._id)) {
    console.error(`Task has no id: ${JSON.stringify(task)}`);
    return;
  }
  let self = this;
  let settings = self.getBaseSettings('DELETE', `tasks/${task._id}`);
  settings.data = '';

  return $.ajax(settings).then(function (response) {
    self.app.dispatchEvent('task_deleted', response);
    return response;
  });
}

ClientService.prototype = {
  authenticate,
  unAuthenticate,
  checkAuthentication,
  setAuthToken,
  getAuthToken,
  getAuthHeaders,
  getBaseSettings,
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
