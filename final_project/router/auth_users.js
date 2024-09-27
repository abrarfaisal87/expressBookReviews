const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username:'abrar',
    password:'1234'
  }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password); 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   const {username,password} = req.body;

   if(!username && !password){
    return res.status(404).json({message : "username and password required"});
   }

   if(!isValid(username)){
    return res.status(401).json({message:'no user found'});
   }

   if(!authenticatedUser(username,password)){
    return res.status(401).json({message: 'invalid  credentials'});
   }

   let accessToken = jwt.sign(
    {data:username},
    'access',
    {expiresIn: 60*60}
   );

   req.session.authorization = {accessToken};
   return res.status(200).json({message: "login successful",token: accessToken});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username; 

  if(!username){
    return res.status(403).json({message:'user not authenticated'});
  }
  if(!review){
    return res.status(400).json({message:'review required'});
  }
  if(!books[isbn]){
    return res.status(403).json({message:'book not found'});
  }
  if(!books[isbn].reviews[username]){
    books[isbn].reviews[username]= review;
    return res.status(200).json({message:'review updated successfully'});
  }
  else {
    books[isbn].reviews[username]= review;
    return res.status(200).json({message:'review added successfully'});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
