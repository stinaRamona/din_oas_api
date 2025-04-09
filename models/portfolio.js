const Mongoose = require('mongoose');

const PortfolioSchema = new Mongoose.Schema({
    project_name: {
        type: String, 
        required: true
    }, 
    project_description: {
        type: String,
        required: true
    }, 
    project_picture: {
        type: String, //för URL. Alternativt annat system för bilder
        default: null
    }, 
    created_at: {
        type: Date, 
        default: Date.now
    }
});

const Portfolio = Mongoose.model('Portfolio', PortfolioSchema); 

module.exports = Portfolio; 