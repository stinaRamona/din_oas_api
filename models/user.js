const Mongoose = requre('mongoose'); 

const UserSchema = new Mongoose.Schema({
    user_name: {
        type: String, 
        required: true
    }, 
    user_email: {
        type: String, 
        required:true
    }, 
    user_password: {
        type: String, 
        required: true
    }, 
    created: {
        type: Date, 
        default: Date.now
    }
}); 

const User = Mongoose.model('User', UserSchema); 

module.exports = User; 