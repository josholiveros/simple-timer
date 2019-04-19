function UserController(signinForm, app) {
  let self = this;
  self.clientService = app.services.clientService;
  self.app = app;

  signinForm.on('submit', (evt) => {
    evt.preventDefault();

    let user = {
      email: $('#inputEmail').val(),
      password: $('#inputPassword').val()
    };
    self.clientService.authenticate(user);
  });

  self.initializeUserControls(app);
}

function initializeUserControls(app) {
  app.addAppEventListener('authenticated', () => {
    let signOutBtn = $('<a class="nav-link" href="#" id="sign-out-link">Sign out</a>');
    signOutBtn.click(() => {
      app.services.clientService.unAuthenticate();
    });
    $('#sign-out-wrapper').html(signOutBtn);
  });
  app.addAppEventListener('401', () => {
    $('#sign-out-wrapper').html('');
  });
}

UserController.prototype = {
  initializeUserControls
};
