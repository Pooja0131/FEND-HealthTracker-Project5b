var app = app || {};

// Food collection to store results
var FoodResultCollection = Backbone.Collection.extend({
  model: app.FoodModel,

  // Save food result collection to localStorage under 'food-results-backbone'
  localStorage: new Backbone.LocalStorage('food-results-backbone')
});

app.FoodResultCollection = new FoodResultCollection();
