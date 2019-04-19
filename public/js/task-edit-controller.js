function TaskEditController(editModal, app, data) {
  let self = this;
  self.clientService = app.services.clientService;
  self.app = app;
  self.data = data;
  self.editModal = editModal;

  self.renderForm();
  self.editModal.modal();
}

function renderForm() {
  let self = this;
  let timeSpent = self.data.status === 'started' ?
    (new Date()).valueOf() - self.data.startTime + self.data.spent :
    self.data.spent;
  let editElem = $(`
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="editTaskTitle" class="col-form-label">Task:</label>
              <input type="text" class="form-control" id="editTaskTitle" value="${self.data.title}">
            </div>
            <div class="form-group">
              <label for="editTaskSpent" class="col-form-label">Spent:</label>
              <input type="text" class="form-control" id="editTaskSpent" value="${moment.utc(timeSpent).format('HH:mm:ss')}">
            </div>
            <div class="form-group">
              <label for="editTaskGoal" class="col-form-label">Task:</label>
              <input type="text" class="form-control" id="editTaskGoal" value="${moment.utc(self.data.goal).format('HH:mm:ss')}">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="saveTaskEdit">Save</button>
        </div>
      </div>
    </div>`);

  editElem.find('#saveTaskEdit').on('click', (evt) => {
    evt.preventDefault();
    
    self.data.title = $('#editTaskTitle').val();
    self.data.spent = moment.duration($('#editTaskSpent').val()).valueOf();
    self.data.goal = moment.duration($('#editTaskGoal').val()).valueOf();
    if (self.data.status === 'started') {
      self.data.startTime = (new Date()).valueOf();
    }

    self.clientService.updateTask(self.data).then(() => {
      self.editModal.modal('hide');
    });
  });
  
  self.editModal.html(editElem);
}

TaskEditController.prototype = {
  renderForm
};
