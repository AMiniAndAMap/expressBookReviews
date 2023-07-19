const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });
  regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if(filtered_book) {
        let reviewer = req.session.authorization['username'];
        
        delete filtered_book['reviews'][reviewer];
        res.send(`The review for the book from user  ${reviewer} has been deleted.`);
    }

});
//Task 10
public_users.get('promise/',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });
//Task 11
public_users.get('promise/isbn/:isbn',function (req, res) {
    const get_isbn = new Promise((resolve, reject) => {
      let isbn = req.params.isbn;  
      resolve(res.send(books[isbn]));
    });
    get_isbn.then(()=>console.log("Promise for ISBN resolved"));
   });
//Task 12
public_users.get('promise/author/:author',function (req, res) {
    const get_author = new Promise((resolve, reject) => {
        let authorBooks = [];
        let isbns = Object.keys(books);  
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
              authorBooks.push({"isbn":isbn,
                                  "title":books[isbn]["title"],
                                  "reviews":books[isbn]["reviews"]});
            }
          });
          resolve(res.send(JSON.stringify({authorBooks}, null, 4)));
      });
      get_author.then(()=>console.log("Promise for Authors resolved"));
});
//Task 13
public_users.get('promise/title/:title',function (req, res) {
    const get_title= new Promise((resolve, reject) => {
        let stories = [];
        let titles = Object.keys(books);  
        titles.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
              authorBooks.push({"isbn":isbn,
                                  "title":books[isbn]["title"],
                                  "reviews":books[isbn]["reviews"]});
            }
          });
          resolve(res.send(stories));
      });
      get_title.then(()=>console.log("Promise for Titles resolved"));
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;