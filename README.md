# Calorie Counter
An app that tracks the user's calorie intake. Typing food names into the search field displays a list of matching foods. Users will be able to select an item from the list, and the item will be added to the list of foods the user is tracking. The total calorie count will also update to reflect the new daily total.


## To Start
* Click http://pooja0131.github.io/FEND-HealthTracker/dist/index.html. Enjoy!



### Application Features
* This project uses the **Backbone.js framework, Backbone-Localstorage, Nutritionix API** to track calories consumed and the **Edamam API** to provide similar recipe suggestions.
Its also shows the calories count using a **Radial Progress Chart**.

* First user has to enter few details about themselves like height, weight, activity level etc. These details are used to calculate recommended calories (using Harris–Benedict BMR formula) to **maintain** their current weight.

* User can search for food item in the Nutritionix database using search bar functionality. This search function will return a list of food items.

* After choosing from the list of results, the user can enter the number of servings eaten and the total calories consumed is calculated for that food item. The app keeps a running total of all calories consumed.

* Total calories consumed is also displayed using a Radial Progress Chart.

* The app keeps track of all food items eaten in a list, which user can remove.

* The search functionality also returns a list of Similar Recipe suggestions along with their calories using Edamam database.



#### Screenshots

* The app is fully responsive and works on devices of all sizes.

* iPhone
![iPhone](https://github.com/Pooja0131/FEND-HealthTracker-Project5b/blob/master/screenshots/iPhone.png?raw=true "iPhone Screenshot")

* Laptop
![Laptop](https://github.com/Pooja0131/FEND-HealthTracker-Project5b/blob/master/screenshots/Laptop.png?raw=true "Laptop Screenshot")

* iPad
![iPad](https://github.com/Pooja0131/FEND-HealthTracker-Project5b/blob/master/screenshots/iPad.png?raw=true "iPad Screenshot")




##### Resources used:
* Backbone.js
* Underscore.js
* Backbone localStorage
* Nutritionix API (calorie count for tracked foods)
* Edamam API (images and links to recipes)
* D3.js
* Radial-progress-chart.js
