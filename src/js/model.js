import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON, sendJSON, deleteUserRecipe } from './helpers.js';

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


// ////////////////////////////////////////
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


// ////////////////////////////////////////
// GET RECIPE DETAILS FROM API (https://forkify-api.herokuapp.com/v2)
export const getRecipe = async function (hashID) {
  try {
    const data = await getJSON(`${API_URL}/${hashID}?key=${API_KEY}`);
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
    if (state.favourites.some(favourite => favourite.id === hashID)) {
      return state.recipe.isFavourite = true;
    }
  } catch (error) {
    throw error;
  }
};

export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * numServings) / state.recipe.servings;
  });
  state.recipe.servings = numServings;
};


// ////////////////////////////////////////
// CREATE, READ AND DELETE FAVOURITE RECIPES
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


// ////////////////////////////////////////
// UPLOAD (POST) A NEW RECIPE TO THE API
export const uploadUserRecipe = async function (newRecipeData) {

  // restructure the ingredients data pulled from the form so that it matches the desired format to POST to the API
  const restructureIngredientsData = function (data) {
    const result = [];
    const ingredientCount = data.length / 3; // assuming each ingredient has 3 parts: quantity, unit, description

    // loop through the data array considering each ingredient's three parts
    for (let i = 0; i < ingredientCount; i++) {
      const index = i * 3;
      const quantityKey = data[index][0];

      // extracting the index from the key (e.g., 'ingredients[0].quantity' -> 0)
      const idx = parseInt(quantityKey.split('[')[1].split(']')[0]);

      // create an object for each ingredient with quantity, unit, and description
      const ingredient = {
        'quantity': Number(data[idx * 3][1]),  // convert to number
        'unit': data[idx * 3 + 1][1],
        'description': data[idx * 3 + 2][1]
      };

      result.push(ingredient);
    }

    return result;
  };

  const ingredients = Object.entries(newRecipeData).filter(entry => entry[0].startsWith("ingredients") && entry[1] !== "");

  const restructuredIngredients = restructureIngredientsData(ingredients);

  const recipeAPIFormat = {
    cooking_time: newRecipeData.cookingTime,
    image_url: newRecipeData.imageUrl,
    ingredients: restructuredIngredients,
    publisher: newRecipeData.publisher,
    servings: Number(newRecipeData.servings),
    source_url: newRecipeData.sourceUrl,
    title: newRecipeData.title
  };

  // POST data
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
};

// DELETE A RECIPE FROM THE API
export const deleteUserRecipe = async function (hashID) {
  if (state.recipe.id === hashID) {
    // delete recipe data from API
    await deleteUserRecipe(`${API_URL}/${hashID}?key=${API_KEY}`);
  } else return;
};