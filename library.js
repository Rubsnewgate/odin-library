// User book collection
const personalLibrary = []

const library = {
    // Bookcase elements
    activateFormBtn: document.getElementById('open-form-btn'),
    emptyLibraryNotice: document.querySelector('.bookcase__empty-status'),
    bookcase: document.querySelector('.books-collection'),

    // Form data
    form: document.querySelector('.bookcase__form'),
    bookTitle: document.getElementById('book-title'),
    bookAuthor: document.getElementById('book-author'),
    bookPages: document.getElementById('book-pages'),
    bookRead: document.getElementById('read-it'),

    // Error messages in case of invalid data
    titleError: document.querySelector('.title-error'),
    authorError: document.querySelector('.author-error'),
    pagesError: document.querySelector('.pages-error'),

    // Form actions
    addBookBtn: document.getElementById('add-book'),
    cancelAddBookBtn: document.querySelector('.cancel-btn'),
}

// Book constructor
function Book (title, author, pages, hasBeenRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.hasBeenRead = hasBeenRead
    this.id = crypto.randomUUID()
}

Book.prototype.toggleRead = function () {
    this.hasBeenRead = !this.hasBeenRead
}

function generateNewBook (title, author, pages, hasBeenRead) {
    const newBook = new Book(title, author, pages, hasBeenRead)
    personalLibrary.push(newBook)
    displayBooks()
}

// Generate book card
function createBookCard (book) {
    /*
    The data-id="${book.id}", stores the unique identifier of each book,
    inserts the "id" prop of the book object into the HTML.
    */

    const bookCard = `
        <div class="book-card" data-id="${book.id}">
            <h3> ${book.title} </h3>
            <p> Author: <span> ${book.author} </span> </p>
            <p> Pages: <span> ${book.pages} </span> </p>
            <p> ID: <span class="id"> ${book.id} </span> </p>
            <p class="read-status ${book.hasBeenRead ? 'read' : 'unread'}">
                ${book.hasBeenRead ? 'Read' : 'Not read'}
            </p>
            <div class="card-actions">
                <button class="read-status-btn confirm-btn btn">
                    ${book.hasBeenRead ? 'Mark unread' : 'Mark read'}
                </button>
                <button class="delete-btn cancel-btn btn"> Remove </button>
            </div>
        </div>
    `
    return bookCard
}

// Activate form
function showForm () {
    library.form.classList.remove('hidden')
    library.emptyLibraryNotice.classList.add('hidden')
}

// Validate data entry
const handleError = (element, errorMessage, isValid) => {
    element.textContent = errorMessage
    element.style.display = isValid ? 'none' : 'block'
}

const validateField = (value, errorElement, errorMessage, validationFunc) => {
    const isValid = validationFunc(value)
    handleError(errorElement, errorMessage, isValid)
    return isValid
}

function validateForm () {
    const { bookTitle, bookAuthor, bookPages } = library
    const { titleError, authorError, pagesError } = library
    let isFormValid = true

    /*
    The "&=" performs a bitwise operation between the current value
    and the right-hand operand, then assigns the result back to the
    variable.
    */
    isFormValid &= validateField(
        bookTitle.value,
        titleError,
        'Book title cannot be empty!',
        (value) => value.trim() !== ''
    )
    isFormValid &= validateField(
        bookAuthor.value,
        authorError,
        'Book Author cannot be empty!',
        (value) => value.trim() !== ''
    )
    isFormValid &= validateField(
        bookPages.value,
        pagesError,
        'Book Pages cannot be empty!',
        (value) => value.trim() !== ''
    )

    if (isFormValid) {
        const pages = Number(bookPages.value)
        const isValidNumber = !isNaN(pages) && Number.isInteger(pages)
        const validPages = isValidNumber && pages > 0 && pages < 3032
        handleError(
            pagesError,
            !isValidNumber ? 'Pages must be a whole number' :
            !validPages ? 'Pages must be between 1 and 3031' : '',
            validPages
        )
        isFormValid &= validPages
    }

    return isFormValid
}

// Display the book collection
function displayBooks () {
    if (personalLibrary.length === 0) {
        library.emptyLibraryNotice.classList.remove('hidden')
        library.bookcase.innerHTML = ''
    }
    else {
        library.emptyLibraryNotice.classList.add('hidden')
        library.bookcase.innerHTML = ''

        personalLibrary.forEach((book) => {
            const card = createBookCard(book)
            library.bookcase.innerHTML += card
        })
    }
}

// Start process to add books to the library
library.activateFormBtn.addEventListener('click', showForm)

// Get input information to generate and add a new book to the library
library.addBookBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const title = library.bookTitle.value
    const author = library.bookAuthor.value
    const pages = library.bookPages.value
    const read = library.bookRead.checked

    if (!validateForm()) {
        return
    }
    else {
        generateNewBook(title, author, pages, read)
        library.form.reset()
        library.form.classList.add('hidden')
    }
})

// Cancel the addition
library.cancelAddBookBtn.addEventListener('click', () => {
    library.form.reset()
    library.form.classList.add('hidden')
    library.emptyLibraryNotice.classList.remove('hidden')
})

// Book card functions
function handleReadStatus (bookID) {
    const book = personalLibrary.find((book) => book.id === bookID)
    if (book) {
        book.toggleRead()
        displayBooks()
    }
}

function removeBook (bookID) {
    const bookIndex = personalLibrary.findIndex((book) => book.id === bookID)
    if (bookIndex !== -1) {
        personalLibrary.splice(bookIndex, 1)
        displayBooks()
    }
}

// Book card actions
library.bookcase.addEventListener('click', (e) => {
    const bookCard = e.target.closest('.book-card')

    if (!bookCard) return

    const bookID = bookCard.dataset.id

    if (e.target.classList.contains('read-status-btn')) {
        handleReadStatus(bookID)
    }
    else if (e.target.classList.contains('delete-btn')) {
        removeBook(bookID)
    }
})

displayBooks()

console.log(personalLibrary)
