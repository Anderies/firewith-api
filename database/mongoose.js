// DATABASE CONFIGURATION

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/blog-mongo',
    {
        useNewUrlParser: true, useUnifiedTopology: true
        , useFindAndModify: false
    })
    .then(() => console.log("Database Blog Mongo Connected"))
    .catch((error) => console.log(error));

module.exports = mongoose;

