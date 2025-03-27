document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});

const bookList = document.getElementById("book-list");
const bookForm = document.getElementById("book-form");

// Fetch books from json-server
function fetchBooks() {
    fetch('https://shelfy.onrender.com')
        .then(response => response.json())
        .then(books => displayBooks(books))
        .catch(error => console.error("Error fetching books:", error));
}

// Display books
function displayBooks(books) {
    bookList.innerHTML = ""; 

    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book");

        const coverImage = book.cover ? book.cover : "https://via.placeholder.com/150";

        bookCard.innerHTML = `
            <img src="${coverImage}" alt="${book.title} cover" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <div style="padding-top: 20px;">
            <button data-id="${book.id}" class="delete-btn">Remove</button>
            <button data-id="${book.id}" style="background-color: blue;">View Book</button>
            </div
        `;

        bookList.appendChild(bookCard);
    });
}

// Add new book
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        genre: document.getElementById("genre").value,
        year: document.getElementById("year").value,
        cover: document.getElementById("cover").value || "https://via.placeholder.com/150",
    };

    fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
    })
    .then(() => {
        fetchBooks();
        bookForm.reset();
    })
    .catch(error => console.error("Error adding book:", error));
});

// Delete book
bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;

        fetch(`http://localhost:3000/books/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchBooks())
        .catch(error => console.error("Error deleting book:", error));
    }
});
