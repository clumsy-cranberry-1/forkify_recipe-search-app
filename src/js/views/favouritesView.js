import View from './View.js';

class FavouritesView extends View {
  _parentElement = document.querySelector('.favourites__list');
  _data;
  _errorMessage = "No favourites yet. Find a nice recipe and favourite it :)";

  // PUBLIC METHODS
  renderFavouritesList(data) {
    if (!data || data.length === 0) {
      return this.renderErrorMessage(this._errorMessage);
    }
    this._data = data;
    this._clearHtml();
    const html = this._generateHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  addHandlerRenderFavourites(handler) {
    window.addEventListener("load", handler);
  }

  // PRIVATE METHODS
  _generateHtml() {
    return `
       ${this._data.map(recipe => {
      return `
          <li class="preview" id="${recipe.id}">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.imageUrl}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>`;
    })}
    `;
    // NOTE: "id" added to li item so that I can make use of the CSS ":target" pseudo class  
  }
}

export default new FavouritesView();