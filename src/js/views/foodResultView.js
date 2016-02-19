var app = app || {};

// View for search results
app.FoodResultsView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#results-template').html()),

  events: {
    'click .food-select-button': 'showDetails',
  },

  // Listens to changes in the food model
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  /*When user selects a food item, a food tabel is opened to edit
  the number of servings taken by user. And accordingly its calorie
  is calculated.*/
  showDetails: function() {
    $('html, body').animate({
      scrollTop: $('.food-table').offset().top
    }, 600);
    $('.food-table').removeClass('hidden');
    var totalCalories = this.model.get('calories') * $('#num-servings').val();
    $('#food-search-bar').val(this.model.get('name'));
    $("#serving-size").html(this.model.get('serveSize'));
    $('#serving-calories').html(this.model.get('calories'));
    $('#calories-eaten').html(totalCalories);
  }
});
