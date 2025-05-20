const myLibrary = [];

function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function addBookToLibrary(book) {
  myLibrary.push(book);
  displayBooks();
}

function displayBooks() {
  const display = document.getElementById("libraryDisplay");
  display.innerHTML = "";

  myLibrary.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.dataset.id = book.id;

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.read ? "Read" : "Not read"}</p>
      <button class="toggle-read">Toggle Read</button>
      <button class="remove-book">Remove</button>
    `;

    display.appendChild(card);
  });

  // Event delegation
  display.querySelectorAll(".toggle-read").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const book = myLibrary.find(b => b.id === id);
      book.toggleRead();
      displayBooks();
    });
  });

  display.querySelectorAll(".remove-book").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const index = myLibrary.findIndex(b => b.id === id);
      myLibrary.splice(index, 1);
      displayBooks();
    });
  });
}

// Form handling
const dialog = document.getElementById("bookDialog");
document.getElementById("newBookBtn").addEventListener("click", () => dialog.showModal());
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

document.getElementById("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const pages = parseInt(form.pages.value);
  const read = form.read.checked;

  const newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);
  form.reset();
  dialog.close();
});
