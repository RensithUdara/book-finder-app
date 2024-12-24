import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const [books, setBooks] = useState([]); // Store books fetched from API
  const [error, setError] = useState(""); // Store any error message
  const [isSearched, setIsSearched] = useState(false); // Track if a search has been performed
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [inputError, setInputError] = useState(""); // Store input validation error message

  // Function to fetch books from the Google Books API
  const fetchBooks = async () => {
    if (searchQuery.trim() === "") return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=10`
      );
      setBooks(response.data.items || []); // Safeguard against undefined response
      setError(""); // Clear any previous error
      setInputError(""); // Clear input error
      setIsSearched(true); // Mark that a search has been performed
    } catch (err) {
      setBooks([]); // Clear previous books data
      setError("An error occurred while fetching the books. Please try again later.");
      setIsSearched(true); // Mark that a search has been performed
    } finally {
      setIsLoading(false); // Stop loading after the request completes
    }
  };

  // Event handler for form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (searchQuery.trim().length < 3) {
      setInputError("Please enter at least 3 characters for the search.");
      return;
    }

    setInputError(""); // Clear any previous input error
    setIsSearched(false); // Reset the searched flag before making the request
    fetchBooks();
  };

  return (
    <div className="App">
      <header>
        <h1>Book Finder</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
          />
          <button type="submit" disabled={isLoading} className="search-button">
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {inputError && <p className="error-message">{inputError}</p>}
      </header>

      <main>
        {isLoading && <p>Loading...</p>} {/* Show loading state */}
        {error && <p className="error-message">{error}</p>}

        {isSearched && books.length === 0 && searchQuery.trim() !== "" && (
          <p className="no-results">No books found for "{searchQuery}"</p>
        )}

        {books.length > 0 && (
          <div className="book-list">
            {books.map((book) => (
              <div className="book-item" key={book.id}>
                <div className="book-tag">New</div>
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.volumeInfo.title || "Book cover"}
                  className="book-cover"
                />
                <div className="book-details">
                  <h2>{book.volumeInfo.title || "Untitled"}</h2>
                  <p className="author">
                    <strong>Author:</strong> {book.volumeInfo.authors?.join(", ") || "Unknown"}
                  </p>
                  <p className="description">
                    {book.volumeInfo.description || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;