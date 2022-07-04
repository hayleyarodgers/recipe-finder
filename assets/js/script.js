/* JS DIRECTORY
    1. =VARIABLES
    2. =SEARCH
    3. =DISPLAY-RESULTS
    4. =DISPLAY-VIDEO
    5. =STORAGE
*/


/* ===VARIABLES=== */

// Ingredient search related elements
var ingred = document.getElementById('form1').value;
var ingred2 = document.getElementById('form2').value;
var ingred3 = document.getElementById('form3').value;
var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;
var newSearch = document.getElementById('searchBtn');
spoonacularAPIKey = "0d9ec777d83f403b8ae14136bf45e4e4";

// Recipe search related elements
var selectedRecipe;
var rightWrapContainer = document.getElementById('right-wrap');
var recipeSearchResultsEl = document.getElementById('search-results');
var youtubeTutorialEl = document.getElementById('youtube-tutorial');

// Video search related elements
youtubeAPIKey = "AIzaSyB7n9rKXwh5RoIn3mnR9i-auGoOMy9NOIU";
var searchQuery;
var searchResults;
var videoID;
var recipeURL;

// Search history related elements
var recipeHistoryContainerEl = document.getElementById('recipe-history-container');
var recipeHistoryListEl = document.getElementById('recipe-history-list');
var clearBtn = document.getElementById('clearBtn');

// Modal related elements
var modal = document.getElementById("myModal");
var btn = document.getElementById("searchBtn");
var span = document.getElementsByClassName("close")[0];
var data = data;

// Email submission related elements
var emailSubmissionButton = document.getElementById('footer-email-btn');
var emailSubmissionEl = document.getElementById('footer-email');

/* ===SEARCH=== */

// When search button is clicked, fetch list of recipe names from Spoonacular API based on ingredient inputs
newSearch.addEventListener("click", getRecipeNames);

function getRecipeNames(event) {
    event.preventDefault();
    recipeSearchResultsEl.innerHTML = ''; // clear html list in case user tries to search without selecting a recipe
    var ingred = document.getElementById('form1').value;
    var ingred2 = document.getElementById('form2').value;
    var ingred3 = document.getElementById('form3').value;
    var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;

    var newRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + allIngreds + '&number=10&apiKey=' + spoonacularAPIKey;

    fetch(newRecipe)
        .then(response => {
            if (response.status !== 200) {
                var errorStatus = response.status;
                localStorage.setItem("errorStatus", JSON.stringify(errorStatus));
                window.location.href = "./statusError.html";
                throw Error("ERROR");
            };
            return response.json();
        }).then(data => {
            if (data.length === 0) {
                modal.style.display = "block";
            } else {
                modal.style.display = "none";
            }
            showSearchResults(data);
        });

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        };
    };

    var inputs = document.querySelectorAll('#form1, #form2, #form3');
    inputs.forEach(input => {
        input.value = '';
    });
};


/* ===DISPLAY-RESULTS=== */

// After data fetched from spoonacular API, show top ten search results
function showSearchResults(data) {
    rightWrapContainer.style.display = "block";
    recipeSearchResultsEl.style.display = "block";

    for (var i = 0; i < data.length; i++) {
        var recipe = data[i].title;
        var recipeImage = data[i].image;
        var li = document.createElement('li');

        li.innerHTML = `
        <div class="card mb-3 searchResult">
        <div class="row no-gutters">
            <img src="` + recipeImage + `" class="card-img col-md-4" alt="Photo of recipe">
            <div class="card-body col-md-8 pl-4 my-auto">
                <h2 class="card-title">` + recipe + `</h2>
            </div>
        </div>
        `;

        recipeSearchResultsEl.appendChild(li);
    }
}

// When a search result is clicked, load a Youtube video tutorial
recipeSearchResultsEl.addEventListener('click', function (event) {
    selectedRecipe = event.target.textContent;
    recipeSearchResultsEl.innerHTML = '';
    makeSearchResultURL(selectedRecipe);
})


/* ===DISPLAY-VIDEO=== */

// When a recipe name is clicked, fetch a video using YouTube API
function makeSearchResultURL(selectedRecipe) {
    recipeSearchResultsEl.style.display = "none";
    youtubeTutorialEl.style.display = "block";

    var searchQuery = (selectedRecipe + ' tutorial').replaceAll(" ", "%20"); // search query for youtube. will be concatenated to searchResults. if query is multiple words, the words should be separated by pluses
    var searchResults = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + searchQuery + '&key=' + youtubeAPIKey;

    fetch(searchResults).then(function (response) {
        return response.json();
    }).then(function (data) {
        // checks if videoId is undefined, in the case that the first result is not a video
        for (var i = 0; i <= data.items.length; i++) {
            if (data.items[i].id.videoId === undefined) {
                continue;
            } else {
                videoID = data.items[i].id.videoId;
                break;
            }
        }
    }).then(function () {
        recipeURL = "https://www.youtube.com/watch?v=" + videoID;

        // display recipe title
        var recipeHeading = document.getElementById("recipe-title");
        recipeHeading.textContent = selectedRecipe;

        var youtubeVideo = document.getElementById('youtube-video');
        var youtubeEmbedLink = "https://www.youtube.com/embed/" + videoID;
        youtubeVideo.setAttribute("src", youtubeEmbedLink);
    }).then(function () {
        saveRecipe(recipeURL);
    });

}


/* ===STORAGE=== */

// Save recipe in local storage
function saveRecipe(recipeURL) {
    var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
    var videoList = JSON.parse(localStorage.getItem("videoList"));

    if (savedRecipes === null && videoList === null) {
        savedRecipes = [selectedRecipe];
        videoList = [recipeURL];
    } else {
        savedRecipes.push(selectedRecipe);
        videoList.push(recipeURL);
    }

    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    localStorage.setItem("videoList", JSON.stringify(videoList));
    showRecipeHistory();
}

// Display recipe in search history
function showRecipeHistory() {
    recipeHistoryListEl.innerHTML = '';

    var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
    var videoList = JSON.parse(localStorage.getItem("videoList"));

    if (savedRecipes !== null) {
        recipeHistoryContainerEl.style.display = "block";
        
        for (var i = 0; i < savedRecipes.length; i++) {
            var recipe = savedRecipes[i];
            var oldVideo = videoList[i];
            var li = document.createElement("li");
            var a = document.createElement("a");

            a.setAttribute("target", "_blank");
            li.setAttribute("style", "list-style-type: none");
            a.classList = 'btn recipe-history__list-group-item';
            a.textContent = recipe;
            a.href = oldVideo;
            li.appendChild(a);
            recipeHistoryListEl.appendChild(li);
        }
    }
}

// When clear button is clicked, clear recipe history
clearBtn.addEventListener('click', function() {
    localStorage.clear();
    recipeHistoryListEl.innerHTML = '';
    recipeHistoryContainerEl.style.display = "none";
})

// When send button is clicked, email is "saved" - future functionality
emailSubmissionButton.addEventListener('click', function() {
    emailSubmissionEl.value = '';
})

// When page loads, load search history and hide all results
window.onload = function() {
    recipeHistoryContainerEl.style.display = "none";
    recipeSearchResultsEl.style.display = "none";
    youtubeTutorialEl.style.display = "none";
    rightWrapContainer.style.display = "none";
    showRecipeHistory();
}