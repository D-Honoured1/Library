// Array to store all book objects
const myLibrary = [];

// Constructor function for Book objects
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();  // Unique ID for book
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Toggle read status method added to Book prototype
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Function to add a book to the library array and update the UI
function addBookToLibrary(book) {
  myLibrary.push(book);
  displayBooks();
}

// Function to display all books in the library array
function displayBooks() {
  const display = document.getElementById("libraryDisplay");
  display.innerHTML = "";  // Clear previous content before re-rendering

  // Loop through each book and create a card
  myLibrary.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.dataset.id = book.id;  // Store book's ID for reference

    // Inject book details and action buttons
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.read ? "Read" : "Not read"}</p>
      <button class="toggle-read">Toggle Read</button>
      <button class="remove-book">Remove</button>
    `;

    // Add the card to the display container
    display.appendChild(card);
  });

  // Set up event listeners for "Toggle Read" buttons
  display.querySelectorAll(".toggle-read").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const book = myLibrary.find(b => b.id === id);
      book.toggleRead();
      displayBooks(); // Re-render to update the read status
    });
  });

  // Set up event listeners for "Remove" buttons
  display.querySelectorAll(".remove-book").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const index = myLibrary.findIndex(b => b.id === id);
      myLibrary.splice(index, 1); // Remove the book
      displayBooks(); // Re-render to update the list
    });
  });
}

// Dialog controls
const dialog = document.getElementById("bookDialog");
document.getElementById("newBookBtn").addEventListener("click", () => dialog.showModal());
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

// Handle book form submission
document.getElementById("bookForm").addEventListener("submit", e => {
  e.preventDefault(); // Prevent form from submitting to server

  const form = e.target;
  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const pages = parseInt(form.pages.value);
  const read = form.read.checked;

  // Create and add new book
  const newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);

  // Clear form and close dialog
  form.reset();
  dialog.close();
});
