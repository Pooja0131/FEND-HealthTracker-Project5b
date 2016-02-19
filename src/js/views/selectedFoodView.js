var app = app || {};

app.SelectedFoodView = Backbone.View.extend({
  // create new table row for each selected food
  tagName: 'tr',
  template: _.template($('#user-selected-template').html()),

  events: {
    'click .destroy': 'removeFood'
  },

  // listens to changes in the food model
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'all', this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  /* When user clicks remove button the selected model will be destroyed and
  the radar progress chart will be updated. */
  removeFood: function() {
    this.model.destroy();
    $('.calories').empty();
    app.EventBus.trigger('callRadar');
    if (app.SelectedFoodCollection.length === 0) {
      $('.list-head').hide();
      $('.eaten-food-heading').addClass('hidden');
    }
  }
});
