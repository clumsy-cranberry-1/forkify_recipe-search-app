import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

// API URL
// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    activePage: 1,
  },
  favourites: []
};


// GET RECIPE DETAILS FROM API (https://forkify-api.herokuapp.com/v2)
export const getRecipe = async function (hashId) {
  try {
    const data = await getJSON(`${API_URL}/${hashId}?key=${API_KEY}`);
    console.log(data);
    state.recipe = {
      isFavourite: false,
      cookingTime: data.data.recipe.cooking_time,
      id: data.data.recipe.id,
      imageUrl: data.data.recipe.image_url,
      ingredients: data.data.recipe.ingredients,
      key: data.data.recipe.key,
      publisher: data.data.recipe.publisher,
      servings: data.data.recipe.servings,
      sourceUrl: data.data.recipe.source_url,
      title: data.data.recipe.title,
    };
    if (state.favourites.some(favourite => favourite.id === hashId)) {
      return state.recipe.isFavourite = true;
    }
  } catch (error) {
    throw error;
  }
};


// SEARCH (QUERY) RESULTS
export const getSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        key: recipe.key,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.activePage) {
  state.search.activePage = page;
  const start = (page - 1) * RESULTS_PER_PAGE; // (1 - 1) * 10 = 0 
  const end = (page * RESULTS_PER_PAGE); // 09
  return state.search.results.slice(start, end);
};


// ADJUST THE DESIRED RECIPE SERVINGS
export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * numServings) / state.recipe.servings;
  });
  state.recipe.servings = numServings;
};


// CREATE, READ AND DELETE FAVOURITED RECIPES
const storeFavourites = function () {
  localStorage.setItem("favourites", JSON.stringify(state.favourites));
};

const getStoredFavourites = function () {
  const storage = localStorage.getItem("favourites");
  if (storage) {
    state.favourites = JSON.parse(storage);
  }
};

getStoredFavourites();

export const addFavourite = function (recipe) {
  state.favourites.push(recipe);
  if (recipe.id === state.recipe.id) {
    state.recipe.isFavourite = true;
  }
  return storeFavourites();
};

export const deleteFavourite = function (id) {
  const index = state.favourites.findIndex(element => element.id === id);
  state.favourites.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.isFavourite = false;
  }
  return storeFavourites();
};

// UPLOAD (POST) A NEW RECIPE TO THE API
export const uploadUserRecipe = async function (newRecipe) {
  const recipeAPIFormat = {
    cooking_time: newRecipe.cookingTime,
    image_url: newRecipe.imageUrl,
    ingredients: newRecipe.ingredients,
    publisher: newRecipe.publisher,
    servings: Number(newRecipe.servings),
    source_url: newRecipe.sourceUrl,
    title: newRecipe.title
  };
  const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipeAPIFormat);
  state.recipe = {
    cookingTime: data.data.recipe.cooking_time,
    id: data.data.recipe.id,
    imageUrl: data.data.recipe.image_url,
    ingredients: data.data.recipe.ingredients,
    key: data.data.recipe.key,
    publisher: data.data.recipe.publisher,
    servings: data.data.recipe.servings,
    sourceUrl: data.data.recipe.source_url,
    title: data.data.recipe.title,
  };
  addFavourite(state.recipe);
};
