//Vill man ha en kategori på nyhet? Eller? Räcker det med att det är en nyhet? 
const Mongoose = require('mongoose');

const NewsSchema = new Mongoose.Schema( {
    news_title: {
        type: String,
        required: true
    }, 
    author: {
        type: String, 
        required: true
    }, 
    news_content: {
        type: String,
        required: true
    },
    news_picture: {
        type: String, //för URL. Alternativt annat system för bilder
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
}); 

const News = Mongoose.model('News', NewsSchema); 

module.exports = News;