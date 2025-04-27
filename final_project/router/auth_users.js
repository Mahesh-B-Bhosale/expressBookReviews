const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username);
    });
    return validusers.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    if (isValid(username)) {
        let validusers = users.filter((user) => {
            return (user.password === password);
        });
        return validusers.length > 0;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        // Get JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    }

    return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const username = req.session.authorization.username;
        console.log(req.session.authorization.username);
        book.reviews[username] = review;
        return res.status(200).send("Added review successfully");
    }
    return res.status(404).json({ message: "Invalid isbn" });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const username = req.session.authorization.username;
        console.log(req.session.authorization.username);
        delete book.reviews[username];
        return res.status(200).send("Review deleted successfully");
    }
    return res.status(404).json({ message: "Invalid isbn" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
