var app = app || {};

//Food collection to save selected eaten food items
var SelectedFoodCollection = Backbone.Collection.extend({
  model: app.FoodModel,

  // Save selected(eaten) food collection to localStorage under 'selected-results-backbone'
  localStorage: new Backbone.LocalStorage('selected-foods-backbone')

});

app.SelectedFoodCollection = new SelectedFoodCollection();
