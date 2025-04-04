const Mongoose = require('mongoose'); 

const ServicesSchema = new Mongoose.Schema({
    service_name: {
        type: String, 
        required: true
    }, 
    service_description: {
        type: String, 
        required: true
    }, 
    service_picture: {
        type: String, //för URL. Alternativt annat system för bilder
        required: true
    }, 
    created_at: {
        type: Date, 
        default: Date.now
    }
}); 

const Service = Mongoose.model('Service', ServicesSchema); 

module.exports = Service; 