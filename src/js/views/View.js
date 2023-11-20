export default class View {
  renderSpinner() {
    const spinnerHtml = `
      <div class="spinner">
        <i class="fa-solid fa-spinner fa-spin-pulse"></i>
      </div>
    `;
    this._clearHtml();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerHtml);
  }

  renderErrorMessage(message) {
    message = this._errorMessage;
    const errorHtml = `
      <div class="error__message">
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