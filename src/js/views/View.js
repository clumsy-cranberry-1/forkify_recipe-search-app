export default class View {
  renderSpinner() {
    const spinnerHtml = `
      <div class="spinner">
        <svg>
          <use href="/src/img/icons.svg.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clearHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerHtml);
  }

  renderErrorMessage(message) {
    message = this._errorMessage;
    const errorHtml = `
      <div class="error__message">
        <div>
          <svg>
            <use href="/src/img/icons.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clearHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', errorHtml);
  }

  _clearHtml() {
    this._parentElement.innerHTML = '';
  }
}