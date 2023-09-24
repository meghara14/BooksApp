'use strict';

class BooksList {
  constructor() {
    this.templates = {
      bookLink: Handlebars.compile(document.querySelector('#template-book').innerHTML),
    };

    this.select = {
      bookList: '.books-list',
      bookImage: '.book__image',
      filterBook: '.filters',
    };

    this.favoriteBooks = [];
    this.filters = [];

    this.init();
  }

  init() {
    this.renderBooks();
    this.initActions();
  }

  renderBooks() {
    for (let bookId in dataSource.books) {
      const bookData = dataSource.books[bookId];
      const generatedHTML = this.templates.bookLink({
        id: bookData.id,
        name: bookData.name,
        price: bookData.price,
        image: bookData.image,
        rating: bookData.rating,
        ratingBgc: this.determineRatingBgc(bookData.rating),
        ratingWidth: bookData.rating * 10,
      });

      const listOfBook = document.querySelector(this.select.bookList);
      const creation = utils.createDOMFromHTML(generatedHTML);
      listOfBook.appendChild(creation);
    }
  }

  initActions() {
    const listOfBook = document.querySelector(this.select.bookList);
    const filterOfBooks = document.querySelector(this.select.filterBook);

    listOfBook.addEventListener('dblclick', (event) => {
      event.preventDefault();
      if (event.target.offsetParent.classList.contains('book__image')) {
        const link = event.target.offsetParent;
        const bookId = link.getAttribute('data-id');

        if (this.favoriteBooks.includes(bookId)) {
          const indexOfBook = this.favoriteBooks.indexOf(bookId);
          link.classList.remove('favorite');
          this.favoriteBooks.splice(indexOfBook, 1);
        } else {
          link.classList.add('favorite');
          this.favoriteBooks.push(bookId);
        }
      }
    });

    filterOfBooks.addEventListener('click', (callback) => {
      const clickedElement = callback.target;

      if (
        clickedElement.tagName === 'INPUT' &&
        clickedElement.type === 'checkbox' &&
        clickedElement.name === 'filter'
      ) {
        if (clickedElement.checked) {
          this.filters.push(clickedElement.value);
        } else {
          const indexOfValue = this.filters.indexOf(clickedElement.value);
          if (indexOfValue !== -1) {
            this.filters.splice(indexOfValue, 1);
          }
        }
      }
      this.filterBooks();
    });
  }

  filterBooks() {
    const listOfBookImages = document.querySelectorAll(this.select.bookImage);

    for (const bookImage of listOfBookImages) {
      const bookId = bookImage.getAttribute('data-id');
      let shouldBeHidden = false;

      for (const filter of this.filters) {
        if (dataSource.books[bookId] && dataSource.books[bookId].details && !dataSource.books[bookId].details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      if (shouldBeHidden) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating) {
    let background = '';

    if (rating < 6) {
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      background = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
    }

    return background;
  }
}

new BooksList();
