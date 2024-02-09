const STORAGE_KEY = 'BOOK_APPS'

let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false
    }
    return true
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) books = data;

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if (isStorageExist()) saveData();
}

function composeBookObject(title, author, year, image, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        image,
        isComplete,
    };
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) return book
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (const book of books) {
        if (book.id === bookId) return index;
        index++
    }
    return -1
}