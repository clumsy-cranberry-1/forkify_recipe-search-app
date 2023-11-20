/* NOTES:
** MVC (MODEL, VIEWS, CONTROLLER) ARCHITECTURE: 
** CONTROLLERS DO NOT EXPORT ANYTHING.
** THE CONTROLLER ACTS AS THE MIDDLEMAN BETWEEN THE VIEWS AND MODEL MODULES - THEY ARE BASICALLY HANDLERS FOR EVENTS, LIKE UPLOADING DATA TO AN API
** THE VIEWS AND MODEL MODULES DO NOT KNOW OF THE CONTROLLER 
*/

// ////////////////////////////////////////
// IMPORTS
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import favouritesView from './views/favouritesView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import uploadRecipeView from './views/uploadRecipeView.js';


// ////////////////////////////////////////
// SEARCH (QUERY) RESULTS
const controlSearchResults = async function () {
  try {
    // 1) get search results from API
    const query = await searchView.getQuery();
    if (!query) return;
    await model.getSearchResults(query);

    // 2) render search results
    resultsView.renderSearchResults(model.getSearchResultsPage(1));

    // 3) render pagination buttons
    paginationView.renderPaginationButtons(model.state.search);
  } catch (error) {
    resultsView.renderErrorMessage();
  }
};


// ////////////////////////////////////////
// SEARCH RESULTS PAGINATION
const controlPagination = function (goToPage) {
  // 1) render search results
  resultsView.renderSearchResults(model.getSearchResultsPage(goToPage));

  // 2) render pagination buttons
  paginationView.renderPaginationButtons(model.state.search);
};


// ////////////////////////////////////////
// RECIPE DETAILS
const controlRecipe = async function () {
  try {
    const hashID = window.location.hash.slice(1);
    if (!hashID) return;

    // 1) get recipe from API
    // recipeView.renderSpinner();
    await model.getRecipe(hashID);

    // 2) render recipe html
    recipeView.renderRecipe(model.state.recipe);
  } catch (error) {
    recipeView.renderErrorMessage();
  }
};


// ////////////////////////////////////////
// UPDATE RECIPE SERVINGS
const controlServings = function (numServings) {
  // 1) update num of servings
  model.updateServings(numServings);

  // 2) reload recipe html with new servings and quantity amounts
  recipeView.renderRecipe(model.state.recipe);
};


// ////////////////////////////////////////
// ADD/DELETE FAVOURITE RECIPES
const controlFavourites = function () {
  /* 1)
  # if recipe is not favourited, add it to the list 
  # if the recipe is favourited, delete it from the list */
  if (!model.state.recipe.isFavourite) {
    model.addFavourite(model.state.recipe);
  }
  else if (model.state.recipe.isFavourite) {
    model.deleteFavourite(model.state.recipe.id);
  }

  // 2) reload recipe html
  recipeView.renderRecipe(model.state.recipe);

  // 3) render favourite recipes under the favourites tab in the nav
  favouritesView.renderFavouritesList(model.state.favourites);
};

const controlStorageFavourites = function () {
  // 1) render favourite recipes from localStorage
  favouritesView.renderFavouritesList(model.state.favourites);
};


// ////////////////////////////////////////
// UPLOAD NEW RECIPE WITH FORM
const controlUploadRecipe = async function (newRecipeData) {
  try {
    // 1) upload new recipe date
    await model.uploadUserRecipe(newRecipeData);

    // 2) render recipe
    recipeView.renderRecipe(model.state.recipe);

    // 3) need to somehow add the new recipe's id to the page's url.
    window.location.hash = model.state.recipe.id;

    // 4) need to close the upload recipe modal. 
    uploadRecipeView.hideModal();
  } catch (error) {
    console.log(error);
    recipeView.renderErrorMessage(error);
  }
};

// ////////////////////////////////////////
// DELETE RECIPE
const controlDeleteRecipe = async function() {
  try {
    // 1) delete recipe by id
    const hashID = window.location.hash.slice(1);
    if (!hashID) return;
    await model.deleteUserRecipe(hashID);

    // 2) remove recipe from favourites list by id
    model.deleteFavourite(hashID);

    // 3) navigate to the given url
    window.location.href = "/";

  } catch(error) {
    recipeView.renderErrorMessage();
  }
}

// ////////////////////////////////////////
// EVENT HANDLERS
/**
 * @todo add a delete recipe handler?
 */
const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerButton(controlPagination);
  recipeView.addHandlerRenderRecipe(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerFavouriteRecipe(controlFavourites);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  favouritesView.addHandlerRenderFavourites(controlStorageFavourites);
  uploadRecipeView.displayModal();
  uploadRecipeView.addHandlerUploadRecipe(controlUploadRecipe);
};
init();
