const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register/:username/:password", (req,res) => {
  //Write your code here
  const username = req.params.username;
  const password = req.params.password;
  if(!username || !password){
    return res.status(400).json({message:"Username and password is required"});
  }
  if(users.some(user => user.username === username)){
    return res.status(409).json({message : 'username already exist'});
  }
  users.push({username,password});
  console.log(users);
  return res.status(200).json({message:'user successfully registered'})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books)})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(300).send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author.toLowerCase();
  
  const booksAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if(booksAuthor.length > 0){
    res.status(200).json(booksAuthor);
  }
  else return res.status(404).send("no books found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();

  const booksTitle = Object.values(books).filter(book=>book.title.toLowerCase()===title);
  if(booksTitle.length>0){
    res.status(200).json(booksTitle);
  }
  else return res.status(400).send('No books found by this title');
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
   
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
