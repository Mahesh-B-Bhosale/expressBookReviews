const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        const booksList = JSON.stringify(books, null, 4);
        if (booksList) {
            resolve(booksList);
        } else {
            reject('No books found');
        }
    }).then(booksList => {
        return res.status(200).send(booksList);
    }).catch(error => {
        return res.status(500).send(error);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject('No book found with this isbn');
        }
    }).then(book => {
        return res.status(200).send(book);
    }).catch(error => {
        return res.status(500).send(error);
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
        const author = req.params.author;
        const bookDetails = [];
        for (let key of Object.keys(books)) {
            const book = books[key];
            if (book.author === author) {
                bookDetails.push(book);
            }
        }
        if (bookDetails.length > 0) {
            resolve(bookDetails);
        } else {
            reject('No book found with this author');
        }
    }).then(bookDetails => {
        return res.status(200).send(bookDetails);
    }).catch(error => {
        return res.status(500).send(error);
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const bookDetails = [];
        for (let key of Object.keys(books)) {
            const book = books[key];
            if (book.title === title) {
                bookDetails.push(book);
            }
        }
        if (bookDetails.length > 0) {
            resolve(bookDetails);
        } else {
            reject('No book found with this title');
        }
    }).then(bookDetails => {
        return res.status(200).send(bookDetails);
    }).catch(error => {
        return res.status(500).send(error);
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(book.reviews);
    }
    return res.status(404).json({ message: "No book found with this isbn" });
});

module.exports.general = public_users;
