import View from './View.js';

class uploadRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _addRecipeModal = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
    _btnCloseModal = document.querySelector('.btn--close-modal');
    
    // public methods
    displayModal() {
        this._openModal();
        this._closeModal();
    }
    
    addHandlerUploadRecipe(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = form2js(this);
            handler(formData);
        })
    }
    
    // private methods
    _openModal() {
        this._btnOpenModal.addEventListener("click", this._toggleModalDisplay.bind(this));
    }

    _closeModal() {
        this._btnCloseModal.addEventListener("click", this._toggleModalDisplay.bind(this));
        this._overlay.addEventListener("click", this._toggleModalDisplay.bind(this));
    }


    _toggleModalDisplay() {
        this._overlay.classList.toggle("hidden");
        this._addRecipeModal.classList.toggle("hidden");
    }
}

export default new uploadRecipeView();