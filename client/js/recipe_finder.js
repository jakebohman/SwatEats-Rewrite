document.addEventListener("DOMContentLoaded", () => {
    const ingredientInput = document.getElementById("ingredient-input");
    const ingredientDropdown = document.getElementById("ingredient-dropdown");
    const addedIngredients = document.getElementById("added-ingredients");
    const ingredientList = new Set();
    const recipeResults = document.getElementById("recipe-results");

    // Whenever a user types in the ingredients search bar
    ingredientInput.addEventListener("input", () => {
        const query = ingredientInput.value.trim();

        if (query.length < 1)
            return ingredientDropdown.innerHTML = "";

        // Send request to server
        fetch("/searchIngredient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        })
        .then(res => res.json())
        .then(data => {
            // Add each element to the dropdown menu
            ingredientDropdown.innerHTML = "";
            data.forEach(item => {
                const option = document.createElement("div");
                option.className = "dropdown-option";
                option.textContent = item.strIngredient;

                // If the user clicks the item, then it gets added to the list
                option.addEventListener("click", () => {
                    if (!ingredientList.has(item.strIngredient)) {
                        ingredientList.add(item.strIngredient);
                        addIngredientTag(item.strIngredient);
                    }
                    ingredientDropdown.innerHTML = "";
                    ingredientInput.value = "";
                });
                ingredientDropdown.appendChild(option);
            });
        });
    });

    // Gets called when user clicks an ingredient, adds it to the tags list
    function addIngredientTag(name) {
        const tag = document.createElement("div");
        tag.className = "ingredient-tag";
        tag.textContent = name;

        const remove = document.createElement("span");
        remove.textContent = "✕";
        remove.className = "remove-tag";
        remove.onclick = () => {
            tag.remove();
            ingredientList.delete(name);
        };

        tag.appendChild(remove);
        addedIngredients.appendChild(tag);
    }

    // Whenever a user sends a request for recipes
    document.getElementById("recipe-form").addEventListener("submit", e => {
        e.preventDefault();

        const dietary = [...document.querySelectorAll("input[name='dietary']:checked")].map(cb => cb.value);
        const method = parseInt(document.querySelector("input[name='method']:checked").value);
        const payload = {
            ingredients: Array.from(ingredientList),
            method: method,
            dietary: dietary
        };

        // Send request to server
        fetch("/findRecipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(recipes => {
            // Builds recipe list in HTML
            recipeResults.innerHTML = "<h2>Recipe Results</h2>";
            if (recipes.length === 0) {
                recipeResults.innerHTML += "<p>No matching recipes found.</p>";
                return;
            }

            // Creates a recipe card for each result
            recipes.forEach(recipe => {
                const card = document.createElement("div");
                card.className = "recipe-card";

                // Creates list of ingredients and measures from array
                let ingredientsHTML = "<ul>";
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    for (let i = 0; i < recipe.ingredients.length; i++) {
                        const ingredient = recipe.ingredients[i];
                        const measure = recipe.measures[i];
                        if (!ingredient) 
                            break;
                        if (ingredientList.has(ingredient))
                            ingredientsHTML += `<li><b>${measure} ${ingredient}</b></li>`;
                        else
                            ingredientsHTML += `<li>${measure} ${ingredient}</li>`;
                    }
                }
                ingredientsHTML += "</ul>";

                // Building the card
                card.innerHTML = `
                    <h3>${recipe.strMeal}</h3>
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <p><strong>Category:</strong> ${recipe.strCategory}</p>
                    <p><strong>Cuisine:</strong> ${recipe.strArea}</p>
                    <p><strong>Ingredients:</strong></p>
                    ${ingredientsHTML}
                    <p><strong>Instructions:</strong></p>
                    <p>${recipe.strInstructions}</p>
                `;
                recipeResults.appendChild(card);
            });
        });
    });
});