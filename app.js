var App = new Marionette.Application();

var RootView = Marionette.LayoutView.extend({
  el: 'body',
  regions: {
    mainRegion: '#main'
  }
});

var Model = Backbone.Model.extend({
  defaults: {
    full_name: 'Kensuke Nagae'
  },
  validation: {
    full_name: {
      required: true
    }
  }
});

var FormView = Marionette.ItemView.extend({
  template: '#template-form',
  events: {
    'submit form': 'onSubmit'
  },
  bindings: {
    '[name=full_name]': 'full_name'
  },
  ui: {
    alert: '.alert'
  },
  onShow: function() {
    this.stickit();
    console.log(this.cid, this.ui.alert);
    Backbone.Validation.bind(this, {
      valid: function(view, attr) {
        console.log(view.cid, view.ui.alert);
        view.ui.alert.hide();
      },
      invalid: function(view, attr, error) {
        view.ui.alert.show();
      }
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    if (this.model.isValid(true)) {
      this.trigger('submit');
    }
  },
  onDestroy: function() {
    Backbone.Validation.unbind(this);
  }
});

var ConfirmationView = Marionette.ItemView.extend({
  template: '#template-confirmation',
  events: {
    'click button': 'onCancel'
  },
  bindings: {
    '#preview-full_name': 'full_name'
  },
  onShow: function() {
    this.stickit();
  },
  onCancel: function(e) {
    e.preventDefault();
    this.trigger('cancel');
  }
});

App.on('start', function() {
  App.rootView = new RootView();
  var model = new Model();
  window.model = model;

  this.showForm = function(model) {
    var formView = new FormView({
      model: model
    });
    this.listenTo(formView, 'submit', function() {
      this.showConfirmation(model);
    });
    App.rootView.mainRegion.show(formView);
  }

  this.showConfirmation = function(model) {
    var confirmationView = new ConfirmationView({
      model: model
    });
    this.listenTo(confirmationView, 'cancel', function() {
      this.showForm(model);
    });
    App.rootView.mainRegion.show(confirmationView);
  }

  this.showForm(model);
});

$(function() {
  App.start();
});
