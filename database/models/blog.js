const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogSchema = new mongoose.Schema({
    blog_title: {
        type: String,
        trim: true,
        minlength: 3
    },
    blog_image: {
        type: String,
    },
    blog_content: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    category_id: {
        type: Schema.Types.ObjectId, 
        required: true,
    },
});

const Blog = mongoose.model('blog', BlogSchema)
module.exports = Blog;