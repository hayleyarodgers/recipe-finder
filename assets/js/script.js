/* JS DIRECTORY
    1. =VARIABLES
    2. =SEARCH
    3. =DISPLAY-RESULTS
    4. =DISPLAY-VIDEO
    5. =STORAGE
*/

/* ===VARIABLES=== */

// (consolidate our variables and fill this in once all of our functions are done)


var recipeSearchResultsEl = document.getElementById('search-results');
var selectedRecipe;
var recipeHistoryContainerEl = document.getElementById('recipe-history-container');
var recipeHistoryListEl = document.getElementById('recipe-history-list');

var youtubeTutorialEl = document.getElementById('youtube-tutorial');

var ingred = document.getElementById('form1').value;
var ingred2 = document.getElementById('form2').value;
var ingred3 = document.getElementById('form3').value;
var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;

//var newRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients='+ allIngreds + '&number=10&apiKey=39791063581a4d96a908bb19745b3f64';


var modal = document.getElementById("myModal");
var btn = document.getElementById("searchBtn");
var span = document.getElementsByClassName("close")[0];
var data = data;


/* ===SEARCH=== */

// Event listener that runs search function on click

var newSearch = document.getElementById('searchBtn');
newSearch.addEventListener("click", fn1);

//Fetch list of recipe names from Spoonacular API based on ingredient inputs
function fn1(e) {
    e.preventDefault();
    recipeSearchResultsEl.innerHTML = ''; // clear html list in case user tries to search without selecting a recipe
    var ingred = document.getElementById('form1').value;
    var ingred2 = document.getElementById('form2').value;
    var ingred3 = document.getElementById('form3').value;
    var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;

    var newRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + allIngreds + '&number=10&apiKey=18e518c80cc34dcb84d2c7e1175244e1';

    fetch(newRecipe)
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw Error("ERROR")
            };
            if (response.status !== 200) {
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

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        };
    };

    var inputs = document.querySelectorAll('#form1, #form2, #form3')
    inputs.forEach(input => {
        input.value = '';
    });
};


/* ===DISPLAY-RESULTS=== */

// After data fetched from spoonacular API, show top ten search results
function showSearchResults(data) {
    console.log('test');
    console.log(data);
    recipeSearchResultsEl.style.display = "block";

    for (var i = 0; i < data.length; i++) {
        console.log('test2');
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

// When a search result is clicked, load a youtube video tutorial
recipeSearchResultsEl.addEventListener('click', function (event) {
    selectedRecipe = event.target.textContent;
    recipeSearchResultsEl.innerHTML = '';
    makeSearchResultURL(selectedRecipe);
})


/* ===DISPLAY-VIDEO=== */

// video fetching code
key = "AIzaSyB7n9rKXwh5RoIn3mnR9i-auGoOMy9NOIU"; // api key for yt
var searchQuery = selectedRecipe.replaceAll(" ", "%20"); // search query for youtube. will be concatenated to searchResults. if query is multiple words, the words should be separated by pluses
var searchResults = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + searchQuery + '&key=' + key;
var videoID; // grabs video id to load a video for each recipe
var recipeURL; // links recipe for video. 

function makeSearchResultURL(selectedRecipe) {
    recipeSearchResultsEl.style.display = "none";
    youtubeTutorialEl.style.display = "block";

    var searchQuery = selectedRecipe.replaceAll(" ", "%20"); // search query for youtube. will be concatenated to searchResults. if query is multiple words, the words should be separated by pluses
    var searchResults = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + searchQuery + '&key=' + key;

    fetch(searchResults).then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log(data);
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
// should also save youtube link
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

    // clear recipe history
    var clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function () {
        localStorage.clear();
        recipeHistoryListEl.innerHTML = '';
    })
}


// When page loads, load search history (unsure if we want anything else here?)
window.onload = function () {
    recipeSearchResultsEl.style.display = "none";
    youtubeTutorialEl.style.display = "none";
    showRecipeHistory();
}

