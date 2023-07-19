const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorBooks = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        authorBooks.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    //res.send(JSON.stringify({authorBooks}, null, 4));
    res.send(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let stories = [];
    let titles = Object.keys(books);
    titles.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        stories.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    //res.send(JSON.stringify({authorBooks}, null, 4));
    res.send(stories);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
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

module.exports.general = public_users;
