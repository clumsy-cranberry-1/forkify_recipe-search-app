import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _data;
  _errorMessage = `We could not find a recipe that matches your search.`;

  // public methods
  renderSearchResults(data) {
    if (!data || data.length === 0) {
      return this.renderErrorMessage(this._errorMessage);
    }
    this._data = data;
    const html = this._generateHtml();
    this._clearHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  
  // NOTE: "id" added to li item so that I can make use of the CSS ":target" pseudo class  
  _generateHtml() {
    return `
       ${this._data.map(recipe => {
      return `
      <li class="preview" id="${recipe.id}">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.imageUrl}" alt="img" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
          </div>
          <div class="preview__user-generated ${!recipe.key ? "hidden" : ""}">
            <i class="fa-solid fa-user"></i>
          </div>
        </a>
      </li>`;
    }).join("")}
    `;
  }
}
          
export default new ResultsView();
