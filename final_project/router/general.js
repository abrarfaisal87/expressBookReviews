const express = require('express');
const axios = require('axios');
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
  }s
  if(users.some(user => user.username === username)){
    return res.status(409).json({message : 'username already exist'});
  }
  users.push({username,password});
  console.log(users);
  return res.status(200).json({message:'user successfully registered'})
});

//promise

const getBooks = ()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
         if(books){
          resolve(books);
         }
         else{
          reject('Books not found');
         }
    },1000)
  })
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks()
  .then((books)=>{
    return res.status(200).json(books);
  })
  .catch((error)=>{
    return res.status(500).json({message:'error fetching books',error:error});
  })
}
)

//promise
const getBookByIsbn = (isbn)=>{
  return new Promise((resolve,reject)=>{
setTimeout(()=>{
  const book = books[isbn]
  if(book){
    resolve(book)
  }
  else{
    reject('book not found');
  }
},1000);
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  getBookByIsbn(isbn)
  .then((book)=>{
    return res.status(200).json(book);
  })
  .catch((error)=>{
    return res.status(500).json({message:'error fetching book',error:error})
  })
 });
  
 //promise
 const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Corrected: calling the toLowerCase() function
      const booksAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      
      if (booksAuthor.length > 0) {
        resolve(booksAuthor);
      } else {
        reject('Book not found');
      }
    }, 1000);
  });
};

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBookByAuthor(author)
    .then((books) => {
      return res.status(200).json(books);  // Send the books as a response
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Error fetching book', error: error });
    });
});
//promise
const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Corrected: calling the toLowerCase() function
      const booksTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      
      if (booksTitle.length > 0) {
        resolve(booksTitle);
      } else {
        reject('Book not found');
      }
    }, 1000);
  });
};
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  getBookByTitle(title)
  .then((books)=>{
    res.status(200).json(books);
  })
  .catch((error)=>{
    return res.status(400).json({ message: 'Error fetching book', error: error });
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
   
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
