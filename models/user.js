var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    
    isAdmin: Boolean,
    temp_password: String,
    temp_password_time: String
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model("User", userSchema);