import View from './View.js';
import icons from "url:../../img/icons.svg"; // Parcel 2
import fracty from 'fracty';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _data;
  _errorMessage = "We couldn't find the page you were looking for.";

  //  PUBLIC METHODS
  /**
 * @param {*} handler control function from contoller.js
 */
  addHandlerRenderRecipe(handler) {
    const windowEvents = ['hashchange', 'load'];
    windowEvents.forEach(winEv => {
      return window.addEventListener(winEv, handler);
    });
  };

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const servingBtn = e.target.closest(".btn--tiny");
      if (!servingBtn) return;
      const numServings = Number(servingBtn.dataset.updateServingsTo);
      if (numServings > 0) {
        return handler(numServings);
      };
    });
  }

  addHandlerFavouriteRecipe(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const bookmarkBtn = e.target.closest(".btn--favourite");
      if (!bookmarkBtn) return;
      handler();
    });
  }

  /**
   * @param {*} data the data to be rendered 
   * @returns an error if the data does not exist or renders the html generated with _generateHtml();
   */
  renderRecipe(data) {
    if (!data || data.length === 0) {
      return this.renderErrorMessage(this._errorMessage);
    }
    this._data = data;
    this._clearHtml();
    const html = this._generateHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  // PRIVATE METHODS
  /**
   * @returns html to be rendered by renderRecipe();
   */
  _generateHtml() {
    const { isFavourite, cookingTime, imageUrl, ingredients, key, publisher, servings, sourceUrl, title } = this._data;
    return `
      <figure class="recipe__fig">
          <img src=${imageUrl} alt="${title}" class="recipe__img" />
          <h1 class="recipe__title">
          <span>${title}</span>
          </h1>
      </figure>

      <div class="recipe__details">
          <div class="recipe__info">
              <svg class="recipe__info-icon">
                  <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
              <span class="recipe__info-text">minutes</span>
          </div>

          <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-update-servings-to=${servings - 1}>
              <svg>
                  <use href="${icons}#icon-minus-circle"></use>
              </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-servings-to=${servings + 1}>
              <svg>
                  <use href="${icons}#icon-plus-circle"></use>
              </svg>
              </button>
          </div>
          </div>

          <div class="recipe__user-generated ${!key ? "hidden" : ""}">
          <svg>
              <use href="${icons}#icon-user"></use>
          </svg>
          </div>
          <button class="btn--round btn--favourite">
          <svg class="">
              <use href="${icons}#icon-favourite${isFavourite ? "-fill" : ""}"></use>
          </svg>
          </button>
      </div>

      <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
              ${ingredients
        .map(ing => {
          const { unit, description, quantity } = ing;
          return `<li class="recipe__ingredient">
                  <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                  </svg>
                  <div class="recipe__quantity">
                      <strong>${quantity ? fracty(quantity) : ""}</strong>
                  </div>
                  <div class="recipe__description">
                      <span class="recipe__unit"><strong>${unit || ""} </strong></span>${description}
                  </div>
              </li>`;
        })
        .join('')}
          </ul>
      </div>

      <div class="recipe__instructions">
          <h2 class="heading--2">Cooking Instructions</h2>
          <p class="recipe__instructions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${publisher}</span>. 
          Please check out instructions at their website.
          </p>
          <a class="btn--small recipe__btn" href=${sourceUrl}"
          target="_blank">
          <span style="margin-right: 1rem;">Follow Link</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
          </a>
      </div>
    `;
  }
}

export default new RecipeView();
