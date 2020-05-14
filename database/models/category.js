const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryListSchema = new mongoose.Schema({
    category_id: { type: Number },
    category_title: {
        type: String,
        trim: true,
        minlength: 3
    },
    seq :{ type: Number, default: 0 } 
})


const CategoryList = mongoose.model('CategoryList', CategoryListSchema)
module.exports = CategoryList;