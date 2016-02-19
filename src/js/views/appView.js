var app = app || {};

app.AppView = Backbone.View.extend({
  el: '.calorie-tracker-app',

  // Templates for the total calorie intake count, recommended calorie count and allowed calories count.
  caloriesTemplate: _.template($('#calories-template').html()),
  recommendedCaloriesTemplate: _.template($('#recommended-calories-template').html()),
  allowedCaloriesTemplate: _.template($('#allowed-calories-template').html()),

  //Set events
  events: {
    'click #about-you-button': 'showActivity',
    'click #final-about-you-button': 'showApp',
    'click .activity-group': 'calculateAllowedCalories',
    'click #edit-button': 'showAboutMe',
    'keyup .food-input-box': 'searchFood',
    'click #clear-button': 'clearResults',
    'keyup #num-servings': 'updateCalories',
    'click #add-food': 'addEatenFood'
  },

  initialize: function() {
    // binds callRadar to the proper function to be called
    app.EventBus.bind('callRadar', this.updateRadar);
    $('.information').removeClass('hidden');
    $('.BMR-form').removeClass('hidden');

    var bmr, cal;
    var totalCaloriesIntake;

    /* Setup event listeners for the collections on initialization.
    Updates each view when models are added to each collection.
    Also calculates the total calories eaten from collection*/
    this.listenTo(app.FoodResultCollection, 'add', this.addFoodResult);
    this.listenTo(app.SelectedFoodCollection, 'add', this.displayFoodEaten);
    this.listenTo(app.SelectedFoodCollection, 'reset', this.displayAllFoodEaten);
    this.listenTo(app.SelectedFoodCollection, 'all', this.calculateCalories);

    app.SelectedFoodCollection.fetch();
    app.FoodResultCollection.fetch();
  },

  /*Gets height, weight, age and gender from user.
  Calculates bmr based on Harris–Benedict BMR formula*/
  showActivity: function() {
    $('div.activity-level').removeClass('hidden');
    $('.BMR-form').addClass('hidden');

    var height;
    var feetValue = parseInt($('#feet').val());
    var inchesValue = parseInt($('#inch').val());
    height = (feetValue * 12) + inchesValue;

    var weight = parseInt($('#lbs').val());

    var age = parseInt($('#age').val());
    var gender = $('#gender').val();

    if (gender == 'female') {
      bmr = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
    } else {
      bmr = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age);
    }
    return false;
  },

  /* Calculates recommended calories intake to maintain current weight
  based on activity level. Updates DOM using corresponding templates.
  Also updates radial-progress-chart. */
  calculateAllowedCalories: function() {
    var activityLevel = $('input[name="activity-level"]:checked').val();

    if (activityLevel == 'SEDENTARY') {
      cal = parseInt(bmr * 1.2);
    } else if (activityLevel == 'LIGHT') {
      cal = parseInt(bmr * 1.375);
    } else if (activityLevel == 'MEDIUM') {
      cal = parseInt(bmr * 1.55);
    } else if (activityLevel == 'HEAVY') {
      cal = parseInt(bmr * 1.725);
    } else {
      cal = parseInt(bmr * 1.9);
    }

    $('html, body').animate({
      scrollTop: $('.recommended-calories').offset().top
    }, 600);

    $('.allowed-calories').html(this.allowedCaloriesTemplate({
      totalAllowedCalories: cal
    }));

    $('.recommended-calories').html(this.recommendedCaloriesTemplate({
      totalRecommendedCalories: cal
    }));

    this.updateRadar();
    return false;
  },

  // Shows the main app page.
  showApp: function() {
    $('.information').addClass('hidden');
    $('.add-food-box').removeClass('hidden');
    $('.app-heading').removeClass('hidden');
    if(totalCaloriesIntake === 0){
      $('.eaten-food-heading').addClass('hidden');
      $('.user-selected-food').addClass('hidden');
    }else{
      $('.eaten-food-heading').removeClass('hidden');
      $('.user-selected-food').removeClass('hidden');
    }
    $('.food-input-box').focus();
  },

  // Creating radial progress chart using constructors
  updateRadar: function() {
    var calories;
    if (totalCaloriesIntake === 0) {
      calories = new RadialProgressChart('.calories', {
        diameter: 100,
        min: 0,
        max: cal,
        round: true,
        stroke: {
          width: 20
        },
        shadow: {
          width: 0
        },
        series: [{
          value: 0,
          color: {
            solid: '#A52A2A',
            background: 'red'
          }
        }],
        center: {
          content: ["0",
            " of " + cal + " calories"
          ],
        }
      });
    } else {
      calories = new RadialProgressChart('.calories', {
        diameter: 100,
        min: 0,
        max: cal,
        round: true,
        stroke: {
          width: 20
        },
        shadow: {
          width: 0
        },
        series: [{
          color: {
            solid: '#A52A2A',
            background: 'red'
          }
        }],
        center: {
          content: [function(value) {
            return value;
          }, ' of ' + cal + ' calories'],
        }
      });
    }

    $('.container').html(calories.update(totalCaloriesIntake));
  },

  // Displays the About You section to update.
  showAboutMe: function() {
    $('.calories').empty();
    $('.app-heading').addClass('hidden');
    $('.add-food-box').addClass('hidden');
    $('.recommended-calories').html('');
    $('.activity-level').addClass('hidden');
    $('.information').removeClass('hidden');
    $('.BMR-form').removeClass('hidden');

    $('.search-results').empty();
    $('.recipe-div').empty();
    return false;
  },


  /* Adds an item received through ajax get request
  by instantiating the FoodResultsView.*/
  addFoodResult: function(item) {
    var receivedResult = new app.FoodResultsView({
      model: item
    });
    $('.results-list').append(receivedResult.render().el);
  },

  //Update total calories for a food item based on servings and calories per serving
  updateCalories: function() {
    var totalCalories = $('#serving-calories').html() * $('#num-servings').val();
    $('#calories-eaten').html(totalCalories);
  },

  /* Receives an item selected by the user an appends it
	 to the selected food view. */
  displayFoodEaten: function(item) {
    var selected = new app.SelectedFoodView({
      model: item
    });
    $('.food-list').append(selected.render().el);
  },

  // Renders all items in SelectedCollection which are stored in localStorage
  displayAllFoodEaten: function() {
    this.$('.user-selected-food').html('');
    app.SelectedCollection.each(this.addOne, this);
  },

  // Add the new food item in the 'Selected Food Collection' and update radial chart
  addEatenFood: function(food) {
    var eatenFoodItem = new app.FoodModel({
      name: $('#food-search-bar').val(),
      calories: $('#calories-eaten').text(),
      //servings: 0,
      servings: $('#num-servings').val(),
      serveSize: $('#serving-size').text()
    });
    app.SelectedFoodCollection.create(eatenFoodItem);

    $('.eaten-food-heading').removeClass('hidden');
    $('.user-selected-food').removeClass('hidden');
    // $('.user-selected-food').removeClass('hidden');
    $('.search-results').addClass('hidden');
    $('.food-table').addClass('hidden');
    $('.calories').empty();
    $('#food-search-bar').val('');
    $('#food-search-bar').attr('placeholder', 'What did you eat? Search here for calorie count...');

    this.render();
    this.updateRadar();
  },

  /* Calculates the total amount of calories in the selected collection
	  and appends it to the page. */
  calculateCalories: function() {
    totalCaloriesIntake = 0;
    var calories = 0;
    app.SelectedFoodCollection.forEach(function(foodItem) {
      calories = foodItem.get('calories');
      totalCaloriesIntake += parseInt(calories);
      return totalCaloriesIntake;
    });

    $('.total-calories').html(this.caloriesTemplate({
      totalCalories: totalCaloriesIntake,
    }));

  },

  // Clears all search results when user clicks on 'Clear Results' button
  clearResults: function() {
    _.invoke(app.FoodResultCollection.toArray(), 'destroy');
    this.$('#food-search-bar').val('');
    $('.search-results').addClass('hidden');
    $('.recipe-div').addClass('hidden');
    return false;
  },

  // Search Nutritionix database using AJAX query
  searchFood: function(e) {
    $('.results-list').empty();
    $('.recipe-table').empty();
    $('.search-results').addClass('hidden');
    $('.recipe-div').addClass('hidden');
    $('.loader').removeClass('hidden');
    var searchTerm = $('#food-search-bar').val();

    //if there is no value in search bar append the message
    if ((searchTerm === null || searchTerm === "") && e.which === ENTER_KEY) {
      var message = '<h4 class="no-results">PLEASE ENTER SOMETHING!<br>';
      $('.search-box').append(message);
      $('.loader').addClass('hidden');
    //if enter key and there is a value in the search bar
    } else if (e.which === ENTER_KEY && searchTerm) {
      $('.search-results').removeClass('hidden');
      $('.recipe-div').removeClass('hidden');
      $('.no-results').hide();

      var url = 'https://api.nutritionix.com/v1_1/search/' + searchTerm + '?results=0:10&fields=brand_name,item_name,brand_id,item_id,item_type,item_description,nf_calories,nf_serving_size_qty,nf_serving_size_unit,images_front_full_url&appId=1885a928&appKey=a9371e3fd3a0d38f5870b6070506ffed';
      $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
          //hide loader if found search results successfully
          setTimeout("$('.loader').addClass('hidden');", 500);

          $('.search-results').removeClass('hidden');
          $('.recipe-div').removeClass('hidden');

          //If results found add them to food model
          if (data.hits.length > 0) {
            for (var i = 0; i < data.hits.length; i++) {
              var resultFoodItem = new app.FoodModel({
                name: data.hits[i].fields.brand_name + ' ' + data.hits[i].fields.item_name,
                calories: Math.ceil(data.hits[i].fields.nf_calories),
                servings: 0,
                serveSize: data.hits[i].fields.nf_serving_size_qty + ' ' + data.hits[i].fields.nf_serving_size_unit,
              });
              // If the new food item not present in collection then add it
              if (!app.FoodResultCollection.contains(resultFoodItem)) {
                app.FoodResultCollection.create(resultFoodItem);
              }
            }
            //If no results are found append the message
          } else {
            var message = '<h4 class="no-results">NO RESULTS FOUND.<br>';
            $('.results-list').prepend(message);
          }
        },
        //If error occurred, append error message
        error: function(jqXHR, status, errorThrown) {
          setTimeout("$('.loader').hide();", 2500);
          $('.results-list').append('<p>Couldn\'t get Nutritionix data. Check your internet connection or try again later.</p>');
        }
      });
      //call the serach recipe function
      this.searchRecipe();
    }
  },

  // Search Edamam database using AJAX query for recipe suggestions
  searchRecipe: function() {
    var name;
    var link;
    var imageLink;
    var cal;
    var searchTerm = $('#food-search-bar').val();
    var url = 'https://api.edamam.com/search?q=' + searchTerm + '&app_id=62b26d1f&app_key=2b8f1a0bdbc896e3542e3aaa98093f10';
    $.ajax({
      method: 'GET',
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        // If results found append them to the template
        if (data.hits.length > 0) {
          for (var i = 0; i < data.hits.length; i++) {
            name = data.hits[i].recipe.label;
            link = data.hits[i].recipe.shareAs;
            cal = data.hits[i].recipe.calories;
            imageLink = data.hits[i].recipe.image;
            $('.recipe-table').append(_.template($('#recipe-template').html())({
              recipeImage: imageLink,
              recipeLink: link,
              recipeName: name,
              recipeCalories: Math.ceil(cal)
            }));
          }
        } else {
          //If no results are found append the message
          var message = '<h4 class="no-results">NO RESULTS FOUND.<br>';
          $('.recipe-table').prepend(message);
        }
      },
      //If error occurred, append error message
      error: function(jqXHR, status, errorThrown) {
        setTimeout("$('.loader').hide();", 2500);
        $('.recipe-table').append('<p>' + jqXHR.status + ' '+ errorThrown + '! Couldn\'t get Edamam data. Check your internet connection or try again later.</p>');
      }
    });
  },
});
