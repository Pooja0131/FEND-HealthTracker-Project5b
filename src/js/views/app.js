var app = app || {};
var ENTER_KEY = 13; // for enter key functionality

$(function() {
  //Start the app by initiating the appview
  new app.AppView();
});

/* Bus object instantiation, pass bus object to have reference
to the data in view*/
app.EventBus = _.extend({}, Backbone.Events);
