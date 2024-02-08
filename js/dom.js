const UNFINISHED_LIST_BOOKS_ID = 'books';
const FINISHED_LIST_BOOKS_ID = 'finished-books';
const BOOKS_ITEMID = 'itemId';

function makeBook(data /* object */, timestamp /* string */, isFinished /* boolean */, image /* string */) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = data;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = timestamp;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const bookImage = document.createElement('img');
    bookImage.src = image || '/assets/images/books/book5.png';
    bookImage.style.width = '300px';
    bookImage.style.height = 'auto';
    imageContainer.appendChild(bookImage);

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(imageContainer, textContainer);

    if (isFinished) {
        container.append(createUndoButton(), createTrashButton());
    } else {
        container.append(createCheckButton());
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
    const unreadBookList = document.getElementById(UNFINISHED_LIST_BOOKS_ID);
    const textTitle = document.getElementById('title').value;
    const textTimestamp = document.getElementById('date').value;
    const image = '/assets/images/books/book5.png';

    const book = makeBook(textTitle, textTimestamp, false, image);
    const bookObject = composeBookObject(textTitle, textTimestamp, false);

    book[BOOKS_ITEMID] = bookObject.id;
    books.push(bookObject);

    unreadBookList.append(book);
    updateDataToStorage();
}

function addBookToCompleted(bookElement /* HTMLelement */) {
    const listCompleted = document.getElementById(FINISHED_LIST_BOOKS_ID);
    const bookTitle = bookElement.querySelector('.inner > h2').innerText;
    const bookTimestamp = bookElement.querySelector('.inner > p').innerText;

    const newBook = makeBook(bookTitle, bookTimestamp, true);
    const book = findBook(bookElement[BOOKS_ITEMID]);
    book.isFinished = true;
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
    const listUnfinished = document.getElementById(UNFINISHED_LIST_BOOKS_ID);
    const bookTitle = bookElement.querySelector('.inner > h2').innerText;
    const bookTimestamp = bookElement.querySelector('.inner > p').innerText;

    const newBook = makeBook(bookTitle, bookTimestamp, false);

    const book = findBook(bookElement[BOOKS_ITEMID]);
    book.isFinished = false;
    newBook[BOOKS_ITEMID] = book.id;

    listUnfinished.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUnfinished = document.getElementById(UNFINISHED_LIST_BOOKS_ID);
    let listFinished = document.getElementById(FINISHED_LIST_BOOKS_ID);

    for (const book of books) {
        const newBook = makeBook(book.task, book.timeStamp, book.image, book.isFinished);
        newBook[BOOKS_ITEMID] = book.id;

        if (book.isFinished) {
            listFinished.append(newBook);
        } else {
            listUnfinished.append(newBook);
        }
    }
}