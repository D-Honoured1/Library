class Book {
  constructor(title, author, pages, read, id = crypto.randomUUID()) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

const myLibrary = JSON.parse(localStorage.getItem("library") || "[]").map(
  b => new Book(b.title, b.author, b.pages, b.read, b.id)
);

function saveToStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
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
      <button class="edit-book">Edit</button>
      <button class="remove-book">Remove</button>
    `;

    display.appendChild(card);
  });

  display.querySelectorAll(".toggle-read").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const book = myLibrary.find(b => b.id === id);
      book.toggleRead();
      saveToStorage();
      displayBooks();
    })
  );

  display.querySelectorAll(".remove-book").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const index = myLibrary.findIndex(b => b.id === id);
      if (index !== -1) {
        myLibrary.splice(index, 1);
        saveToStorage();
        displayBooks();
      }
    })
  );

  display.querySelectorAll(".edit-book").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.target.parentElement.dataset.id;
      const book = myLibrary.find(b => b.id === id);
      openForm(book);
    })
  );
}

function addOrUpdateBook(bookData) {
  const existingIndex = myLibrary.findIndex(b => b.id === bookData.id);
  if (existingIndex !== -1) {
    myLibrary[existingIndex] = new Book(
      bookData.title,
      bookData.author,
      bookData.pages,
      bookData.read,
      bookData.id
    );
  } else {
    myLibrary.push(new Book(bookData.title, bookData.author, bookData.pages, bookData.read));
  }
  saveToStorage();
  displayBooks();
}

function openForm(book = null) {
  const dialog = document.getElementById("bookDialog");
  const form = document.getElementById("bookForm");
  form.bookId.value = book?.id || "";
  form.title.value = book?.title || "";
  form.author.value = book?.author || "";
  form.pages.value = book?.pages || "";
  form.read.checked = book?.read || false;
  dialog.showModal();
}

// Setup UI controls
document.getElementById("newBookBtn").addEventListener("click", () => openForm());
document.getElementById("closeDialog").addEventListener("click", () => bookDialog.close());
document.getElementById("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const bookData = {
    id: form.bookId.value || crypto.randomUUID(),
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    pages: parseInt(form.pages.value),
    read: form.read.checked,
  };
  addOrUpdateBook(bookData);
  form.reset();
  bookDialog.close();
});

// View localStorage content
document.getElementById("viewStorageBtn").addEventListener("click", () => {
  const content = localStorage.getItem("library");
  const output = content ? JSON.stringify(JSON.parse(content), null, 2) : "No books in storage.";
  document.getElementById("storageContent").textContent = output;
  document.getElementById("storageDialog").showModal();
});
document.getElementById("closeStorageDialog").addEventListener("click", () =>
  document.getElementById("storageDialog").close()
);

// Clear storage
document.getElementById("clearStorageBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all stored books?")) {
    localStorage.removeItem("library");
    myLibrary.length = 0;
    displayBooks();
  }
});

displayBooks();
