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
          <h2 class="recipe__title">
          <span>${title}</span>
          </h2>
      </figure>

      <div class="recipe__details">
          <div class="recipe__info">
              <i class="fa-solid fa-clock recipe__info-icon"></i>
              <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
              <span class="recipe__info-text">&nbsp;minutes</span>
          </div>

          <div class="recipe__info">
          <i class="fa-solid fa-user-group recipe__info-icon"></i>
          <span class="recipe__info-data recipe__info-data--people">${servings}</span>
          <span class="recipe__info-text">&nbsp;servings</span>

          <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-update-servings-to=${servings - 1}>
              <i class="fa-solid fa-circle-minus recipe__info-icon"></i>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-servings-to=${servings + 1}>
              <i class="fa-solid fa-circle-plus recipe__info-icon"></i>
              </button>
          </div>
          </div>

          <div class="recipe__user-generated btn--round ${!key ? "hidden" : ""}">
          <i class="fa-solid fa-user"></i>
          </div>
          <button class="btn--round btn--favourite">
          ${isFavourite ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`}
          </button>
      </div>
      
      <div class="recipe__ingredients">
        <h2 class="recipe__ingredients-heading">Ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${ingredients
          .map(ing => {
            const { unit, description, quantity } = ing;
            return `
                  <li class="recipe__ingredient">
                  <i class="fa-solid fa-check recipe__icon"></i>
                  <div class="recipe__quantity">
                   <strong>${quantity ? fracty(quantity) + "&nbsp;" : ""}</strong>
                  </div>
                  <div class="recipe__description">
                    <span class="recipe__unit"><strong>${unit + "&nbsp;" || ""}</strong></span>${description}
                  </div>
                  </li>`;
          }).join('')
        }
        </ul>
      </div>
        
      <div class="recipe__instructions">
        <h2 class="recipe__instructions-heading">Cooking Instructions</h2>
        <p class="recipe__instructions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${publisher}</span>. 
        Please check out instructions at their website.
        </p>
        <a class="btn--small recipe__btn" href=${sourceUrl}"
        target="_blank">
        <span>Follow Link&nbsp;</span>
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `;
  }
}

export default new RecipeView();
