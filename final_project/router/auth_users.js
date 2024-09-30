const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: 'abrar',
    password: '1234'
  }
];

// Helper function to check if a username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Helper function to check if a user is authenticated
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'No user found' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

  // Store the accessToken and username in the session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Retrieve accessToken from session and verify
  const token = req.session.authorization?.accessToken;
  if (!token) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  jwt.verify(token, 'access', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const username = decoded.data;

    if (!review) {
      return res.status(400).json({ message: 'Review required' });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Add or modify the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: 'Review added/updated successfully', reviews: books[isbn].reviews });
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const token = req.session.authorization?.accessToken;
  if (!token) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  jwt.verify(token, 'access', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const username = decoded.data;

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'No review found for this user' });
    }

    // Delete review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: 'Review deleted successfully', reviews: books[isbn].reviews });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
