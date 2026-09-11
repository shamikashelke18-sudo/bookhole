let books = JSON.parse(localStorage.getItem("bookholeBooks")) || [
  { id: 1, title: "Atomic Habits", author: "James Clear", status: "Completed", rating: 5, favorite: false },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", status: "Reading", rating: 0, favorite: false },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", status: "Want to Read", rating: 0, favorite: false }
];

function saveBooks() {
  localStorage.setItem("bookholeBooks", JSON.stringify(books));
}

function stars(rating) {
  if (rating === 0) return "Not rated yet";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function makeCard(book) {
  let card = document.createElement("div");
  card.className = "book-card";

  card.innerHTML =
    "<h3>" + book.title + "</h3>" +
    "<p class='author'>by " + book.author + "</p>" +
    "<span class='status-tag'>" + book.status + "</span>" +
    "<p class='rating'>" + stars(book.rating) + "</p>" +
    "<div class='card-actions'>" +
    "<button class='fav-btn' onclick='favoriteBook(" + book.id + ")'>" +
    (book.favorite ? "♥ Favourite" : "♡ Favourite") +
    "</button>" +
    "<button class='delete-btn' onclick='deleteBook(" + book.id + ")'>Remove</button>" +
    "</div>";

  return card;
}

function sortBooks(list, type) {
  if (type === "Title") {
    list.sort(function (a, b) { return a.title.localeCompare(b.title); });
  }
  if (type === "Rating") {
    list.sort(function (a, b) { return b.rating - a.rating; });
  }
  return list;
}

function showHome() {
  let grid = document.getElementById("homeBooks");
  if (!grid) return;

  let searchInput = document.getElementById("searchInput");
  let sortSelect = document.getElementById("sortSelect");
  let term = searchInput ? searchInput.value.toLowerCase() : "";
  let sortType = sortSelect ? sortSelect.value : "Default";

  let list = books.filter(function (book) {
    return book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
  });

  sortBooks(list, sortType);

  grid.innerHTML = "";
  list.forEach(function (book) {
    grid.appendChild(makeCard(book));
  });

  let empty = document.getElementById("emptyHome");
  if (empty) empty.style.display = list.length ? "none" : "block";
}

function showFavorites() {
  let grid = document.getElementById("bookGrid");
  if (!grid) return;

  let searchInput = document.getElementById("searchInput");
  let sortSelect = document.getElementById("sortSelect");
  let term = searchInput ? searchInput.value.toLowerCase() : "";
  let sortType = sortSelect ? sortSelect.value : "Default";

  let list = books.filter(function (book) {
    let matchesSearch = book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
    return book.favorite && matchesSearch;
  });

  sortBooks(list, sortType);

  grid.innerHTML = "";
  list.forEach(function (book) {
    grid.appendChild(makeCard(book));
  });

  let empty = document.getElementById("emptyFavorites");
  if (empty) empty.style.display = list.length ? "none" : "block";
}

function favoriteBook(id) {
  let book = books.find(function (item) {
    return item.id === id;
  });

  if (!book) return;

  book.favorite = !book.favorite;
  saveBooks();
  showHome();
  showFavorites();
}

function deleteBook(id) {
  books = books.filter(function (book) {
    return book.id !== id;
  });

  saveBooks();
  showHome();
  showFavorites();
}

let bookForm = document.getElementById("bookForm");

if (bookForm) {
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let title = document.getElementById("titleInput").value.trim();
    let author = document.getElementById("authorInput").value.trim();
    let status = document.getElementById("statusInput").value;
    let rating = Number(document.getElementById("ratingInput").value);

    if (title === "" || author === "") return;

    books.push({
      id: Date.now(),
      title: title,
      author: author,
      status: status,
      rating: rating,
      favorite: false
    });

    saveBooks();
    bookForm.reset();
    showHome();
  });
}

let searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    showHome();
    showFavorites();
  });
}

let sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    showHome();
    showFavorites();
  });
}

let askForm = document.getElementById("askForm");

if (askForm) {
  askForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let mood = document.getElementById("mood").value;
    let thoughts = document.getElementById("thoughts").value.trim();
    let answer = document.getElementById("answer");

    let suggestions = {
      comfort: ["The Little Prince", "A gentle choice for a quiet evening."],
      mystery: ["The Thursday Murder Club", "A warm and funny mystery to keep you guessing."],
      romance: ["The Rosie Project", "A light-hearted story about love and unexpected moments."],
      adventure: ["The Hobbit", "A classic adventure when you want to escape for a while."],
      thoughtful: ["Siddhartha", "A calm, reflective read for when you're in the mood to think."],
      easy: ["The Hitchhiker's Guide to the Galaxy", "Funny, strange and easy to pick up when you want something entertaining."]
    };

    let pick = suggestions[mood];
    let extra = thoughts ? " You said: “" + thoughts + "”" : "";

    answer.innerHTML =
      "<h2>Maybe try <em>" + pick[0] + "</em></h2>" +
      "<p>" + pick[1] + extra + "</p>";

    answer.classList.remove("hidden");
  });
}

showHome();
showFavorites();
