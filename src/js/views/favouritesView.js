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
    console.log(html);
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
            <a class="favourites__link" href="#${recipe.id}">
              <figure class="favourites__fig">
                <img src="${recipe.imageUrl}" alt="Test" />
              </figure>
              <div class="favourites__data">
                <h4 class="favourites__title">${recipe.title}</h4>
                <p class="favourites__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>`;
    }).join("")}
    `;
  }
}
// NOTE: "id" added to li item so that I can make use of the CSS ":target" pseudo class  

export default new FavouritesView();