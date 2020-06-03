// Global app controller
import Recipe from "./models/Recipe";
import Search from "./models/Search";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
//*
//Global State of the app
//-Has Search object
//- Has current recipe object
//- Has shopping list object
//-  Has liked recipes
//*

const state = {};

// SEARCH CONTROLLER //

const controlSearch = async () => {
  // 1) Get query from view
  // const query = document.querySelector(".search__field").value;
  const query = searchView.getInput();

  // console.log(query);

  if (query) {
    // 2) Create new Search object //Add it to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4) Search for recipes
      await state.search.getResults(); // will return a promise

      // 5) Render results to UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert(error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page from relaoding. nuisance when want to get submission
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline"); // we use the btn-inline class
  //console.log(btn); //<button class="btn-inline results__btn--next" data-goto="3"> We stored the page number in data-goto. We can use this for the event listener
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); //dataset allwos us to get the data attribute we put into the html earlier// base 10, aka from 0 to 9
    searchView.clearResults(); //clear results when going to next page
    searchView.renderResults(state.search.result, goToPage);
    //console.log(goToPage);
  }

  //How do we define that we wan the whole button to be our clickable area? We use closest method.
});

// RECIPE CONTROLLER //
const controlRecipe = async () => {
  // Get Id from URL

  const id = window.location.hash.replace("#", ""); // replace will remove the hash
  //console.log(id);
  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightsSelected(id);

    //Create new recipe object
    state.recipe = new Recipe(id); //we;re putting this inide our state like our search

    // Add another try catch here incase the promise from getRecipe gets rejected
    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe(); // Use await and async at top since we want to wait for the axios call promise
      state.recipe.parseIngredients();

      // Do calctime and calcservings
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert(`Error processing recipe`);
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
); // We add the events to an array, loop over them and call addeventListener to each one and the controlRecipe callback

// LIST CONTROLLER

const controlList = () => {
  //Create a new list if theres none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid; // can use closest to target an element when it doesnt exist yet.

  // Handle delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //if the target matches our shopping__delete class
    // Delete from state
    state.list.deleteItem(id);

    // Delete from ui
    listView.deleteItem(id);

    // Handle Count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseInt(e.target.value, 10); // get the number inside value > <input type="number" VALUE="${item.count}" step="${item.count} class="shopping__count-value">
    state.list.updateCount(id, val);
  }
});

// Like Controller

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //User has not liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to state
    const newlike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //Toggle like button
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLike(newlike);
  } else {
    // User has liked current recipe
    // Remove like to state
    state.likes.deleteLike(currentID);
    //Toggle like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on localstrg
window.addEventListener("load", () => {
  state.likes = new Likes();

  //Restore likes
  state.likes.readStorage();

  // Toggle like button if likes exist
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render existing likes\
  state.likes.likes.forEach((like) => likesView.renderLike(like)); //second.like is the likes array in likes.js
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
    // Add to shopping list
  } else if (e.target.matches(".recipe__btn-add, .recipe__btn-add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
