var app = app || {};

//The attributes of food
app.FoodModel = Backbone.Model.extend({
  dafaults: {
    name: '',
    calories: '',
    servings: 0,
    serveSize: '',
  },
});
