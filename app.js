const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');
const CategoryList = require('./database/models/category');
const Blog = require('./database/models/blog');

// 
const Product = require('./database/models/Product');
const Review = require('./database/models/Review');

app.use(express.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", " * ");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header('Access-Control-Allow-Headers', "Origin", "X-Requested-With", 'Content-Type', 'Accept');
    next();
});

// // Route to get all products
app.get("/products", function (req, res) {
    Product.find({})
        .then(function (dbProducts) {
            res.json(dbProducts);
        })
        .catch(function (err) {
            res.json(err);
        })
});

// Route to get all reviews
app.get("/reviews", function (req, res) {
    Review.find({})
        .then(function (dbReviews) {
            res.json(dbReviews);
        })
        .catch(function (err) {
            res.json(err);
        })
});


// Route for creating a new Product
app.post("/product", function (req, res) {
    Product.create(req.body)
        .then(function (cl) {
            // If we were able to successfully create a Product, send it back to the client
            res.json(cl);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for creating a new Review and updating Product "review" field with it
app.post("/product/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    Review.create(req.body)
        .then(function (dbReview) {
            // If a Review was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new Review
            // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return Product.findOneAndUpdate({ _id: req.params.id }, { review: dbReview._id }, { new: true });
        })
        .then(function (dbProduct) {
            // If we were able to successfully update a Product, send it back to the client
            res.json(dbProduct);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for retrieving a Product by id and populating it's Review.
app.get("/products/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Product.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("review")
        .then(function (dbProduct) {
            // If we were able to successfully find an Product with the given id, send it back to the client
            res.json(dbProduct);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// Route for retrieving a Product by id and populating it's Review.
app.get("/newblogs/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Blog.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("category_id")
        .then(function (cl) {
            // If we were able to successfully find an Product with the given id, send it back to the client
            res.json(cl);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});




// GET ALL BLOG ITEM ASSOCIATE WITH CATEGORIES
app.get('/blog/:category_id/', (req, res) => {
    Blog.find({ category_id: req.params.category_id })
        .then((tasks) => res.send(tasks))
        .catch((error) => console.log(error))
})

// CREATE SINGLE BLOG
app.post('/create-blog', (req, res) => {
    (new Blog({
        'category_id': req.body.category_id,
        'blog_title': req.body.blog_title,
        'blog_image': req.body.blog_image,
        'blog_content': req.body.blog_content,
        'views': req.body.views
    }))
        .save()
        .then((bl) => res.send(bl))
        .catch((error) => console.log("error", error))
})

// DELETE SINGLE BLOG BY ID
app.delete('/blog/:_id/categories/:category_id', (req, res) => {
    Blog.findOneAndDelete({ category_id: req.params.category_id, _id: req.params._id })
        .then((bl) => res.send(bl))
        .catch((error) => console.log(error));
});

// UPDATE SINGLE BLOG BY ID
app.patch('/blog/:_id/categories/:category_id', (req, res) => {

    Blog.findByIdAndUpdate({ _id: req.params._id, category_id: req.params.category_id }, { $set: req.body })
        .then((bl) => res.send(bl))
        .catch((error) => console.log(error));
});

// MAKING BLOG VIEWS INCREASE
app.post('/blog/:_id/categories/:category_id', (req, res) => {
    Blog.findOneAndUpdate({ _id: req.params._id, category_id: req.params.category_id }, { $inc: { views: 2 } }, { new: true })
        .then((bl) => {
            console.log("bl", bl.views)
            let obj = {
                status_code: 200,
                msg: "views increase by 1",
                views: bl.views
            }
            res.send(obj)
        })
        .catch((error) => console.log(error));
})

// GET NEWEST POST 
app.get('/blog', (req, res) => {
    Blog.find({}).sort({ _id: -1 }).limit(7)
        .then(bl => {
            res.send(bl)
        })
        .catch((error) => console.log(error));
});



/* HEADER CATEGORIES */
//  CATEGORIES API
app.get('/categories', (req, res) => {
    CategoryList.find({})
        .then(categoresList => res.send(categoresList))
        .catch((error) => console.log(error));
});

app.post('/new-categories', (req, res) => {
    (new CategoryList({ 'category_title': req.body.category_title, 'category_id': req.body.category_id }))
        .save()
        .then((cl) => res.send(cl))
        .catch((error) => console.log("error", error))
})

// GET LAST INSERTED
app.get('/last-categories', (req, res) => {
    CategoryList.find({}).sort({ _id: -1 }).limit(1)
        .then(categoresList => res.send(categoresList))
        .catch((error) => console.log(error));
});

// DELETE BY CATEGORYID
app.delete('/categories/delete/:category_id', (req, res) => {
    CategoryList.findOneAndRemove({ category_id: req.params.category_id })
        .then((cl) => res.status(200).send(cl))
        .catch((error) => console.log(error));
})

// DELETE MANY BY SEQ
app.delete('/seq/delete/:idseq', (req, res) => {
    CategoryList.deleteMany({ seq: req.params.idseq }, function (err, cl) {
        if (err) {
            console.log(err);
        } else {
            let obj = {
                "status_code": 200,
                cl
            }
            console.log("cl", cl)
            res.send(obj)
        }

    });
})




app.listen(3000, () => console.log("Server is Connected on port 3000"));