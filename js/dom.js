const UNCOMPLETE_LIST_BOOKS_ID = 'books';
const COMPLETE_LIST_BOOKS_ID = 'finished-books';
const BOOKS_ITEMID = 'itemId';

function makeBook(title /* string */, author /* string */, year /* number */, image /* string */, isComplete /* boolean */) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = title;

    const textAuthor = document.createElement('h3');
    textAuthor.innerText = author;

    const numberYear = document.createElement('h4');
    numberYear.innerText = year;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const bookImage = document.createElement('img');
    bookImage.src = image || '/assets/images/books/book5.png';
    bookImage.style.width = '200px';
    bookImage.style.height = 'auto';
    imageContainer.appendChild(bookImage);

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, numberYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(imageContainer, textContainer);

    if (isComplete) {
        container.append(createUndoButton(), createTrashButton());
    } else {
        container.append(createCheckButton(), createTrashButton());
    }

    return container;
}

function createUndoButton() {
    return createButton('undo-button', function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton('trash-button', function (event) {
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton('check-button', function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass /* string */, eventListener /* event */) {
    const button = document.createElement('button');
    button.classList.add(buttonTypeClass);
    button.addEventListener('click', function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const unreadBookList = document.getElementById(UNCOMPLETE_LIST_BOOKS_ID);
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const textYear = document.getElementById('year').value;
    const image = '/assets/images/books/book5.png';

    const numberYear = parseInt(textYear, 10);
    const checkbox = document.getElementById('checkbox');
    const isComplete = checkbox.checked;
    const book = makeBook(textTitle, textAuthor, numberYear, image, isComplete);
    const bookObject = composeBookObject(textTitle, textAuthor, numberYear, isComplete);

    book[BOOKS_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        addBookToCompleted(book);  // Add to the completed list immediately if checkbox is checked
    } else {
        unreadBookList.append(book);
    }
}

function addBookToCompleted(bookElement /* HTMLelement */) {
    const listCompleted = document.getElementById(COMPLETE_LIST_BOOKS_ID);
    const bookTitle = bookElement.querySelector('.inner > h2').innerText;
    const bookAuthor = bookElement.querySelector('.inner > h3').innerText;
    const bookYear = bookElement.querySelector('.inner > h4').innerText;
    const image = bookElement.querySelector('.image-container > img').src;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, image, true);
    const book = findBook(bookElement[BOOKS_ITEMID]);
    book.isComplete = true;
    newBook[BOOKS_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(bookElement /* HTMLelement */) {
    const bookPosition = findBookIndex(bookElement[BOOKS_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement /* HTMLelement */) {
    const listUncomplete = document.getElementById(UNCOMPLETE_LIST_BOOKS_ID);
    const bookTitle = bookElement.querySelector('.inner > h2').innerText;
    const bookAuthor = bookElement.querySelector('.inner > h3').innerText;
    const bookYear = bookElement.querySelector('.inner > h4').innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOKS_ITEMID]);
    book.isComplete = false;
    newBook[BOOKS_ITEMID] = book.id;

    listUncomplete.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncomplete = document.getElementById(UNCOMPLETE_LIST_BOOKS_ID);
    let listComplete = document.getElementById(COMPLETE_LIST_BOOKS_ID);

    for (const book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOKS_ITEMID] = book.id;

        if (book.isComplete) {
            listComplete.append(newBook);
        } else {
            listUncomplete.append(newBook);
        }
    }
}