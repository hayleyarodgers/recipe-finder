/* JS DIRECTORY
   1. =VARIABLES
   2. =SEARCH
   3. =DISPLAY-RESULTS
   4. =DISPLAY-VIDEO
   5. =STORAGE
*/

/* ===VARIABLES=== */
// (consolidate our variables and fill this in once all of our functions are done)

// Recipe selected by user in spoonacular search result list
var selectedRecipe;
var recipeHistoryEl = document.getElementById('recipe-history');


/* ===SEARCH=== */

//Event listener that runs search function on click

var newSearch = document.getElementById('searchBtn');
newSearch.addEventListener("click",fn1);

// Fetch list of recipe names from Spoonacular API based on ingredient inputs

function fn1(e)
{


   var ingred = document.getElementById('form1').value;
   var ingred2 = document.getElementById('form2').value;
   var ingred3 = document.getElementById('form3').value;
   var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;

   console.log (allIngreds);

   var newRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients='+ allIngreds + '&number=10&apiKey=39791063581a4d96a908bb19745b3f64';
 
 
   fetch(newRecipe)
      .then(response => {
         if (!response.ok){
            throw Error("ERROR")
         };
         return response.json();
   })
   .then(data => {
      console.log(data);

      document.querySelector('#result1').innerHTML;
   }).catch(error =>{
      console.log(error)
   });



   var inputs = document.querySelectorAll('#form1, #form2, #form3')
   inputs.forEach(input => {
      input.value = '';
   });

   e.preventDefault();

 
};


/* ===DISPLAY-RESULTS=== */

// function fetchResults() {
//    fetch(newRecipe).then(response => {
//       console.log(response);
//    });
// }

//fetchResults();


/* ===DISPLAY-VIDEO=== */




/* ===STORAGE=== */

// Save recipe in local storage
function saveRecipe() {
   var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));

   if (savedRecipes === null) {
      savedRecipes = [selectedRecipe];
   } else {
      savedRecipes.push(selectedRecipe);
   }

   localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
   showRecipeHistory();
}

// Display recipe in search history
function showRecipeHistory() {
   recipeHistoryEl.innerHTML = '';
    
   var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
   
   if (savedRecipes !== null) {
       for (var i = 0; i < savedRecipes.length; i++) {
           var recipe = savedRecipes[i];
           var li = document.createElement("li");
           li.classList = 'btn recipe-history__list-group-item';
           li.textContent = recipe;
           recipeHistoryEl.appendChild(li);
       }
   }
}

// When page loads, load search history (unsure if we want anything else here?)
window.onload = function() {
   showRecipeHistory();
}