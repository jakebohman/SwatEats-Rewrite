# SwatEats
This is a rewrite of a website was created during the Spring '25 course "CPSC71: Software Engineering" at Swarthmore College by Jake Bohman, Yana Sharifullina, and Lona Hoang with the goal of providing a proof-of-concept application demonstrating various ways that food waste and food insecurity might be reduced among the student population at Swarthmore.

The site contains a list of food-related resources potentially useful to Swarthmore students, an application where students can input their available ingredients and receive in response a list of recipes using those ingredients, and a forum which students can use to share their food with others to prevent waste.

The original website was built using Flask and raw HTML/CSS/JavaScript, but I (Jake) have rewritten it using React and Node.js.

## Pages
**Home**\
A short description of our project.

**Recipe Finder**\
Anyone may input their available ingredients and choose from a set of allergens to exclude. All recipes and photos have been adapted from the open-source API at [themealdb.com](www.themealdb.com). Allergen info is not guaranteed to be accurate, as this was manually inputted by hand. If you wish to deploy this app commercially, it is advisable to check that you are following the terms of the aforementioned API.

**Food Sharing**\
A forum where students may offer to give away unwanted food.

**Resources**\
A list of food-related resources which might be useful to the Swarthmore student population. Current as of April 2025.
