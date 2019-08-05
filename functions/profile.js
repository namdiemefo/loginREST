var user = require('../models/user');

exports.getProfile = email =>

new Promise((resolve, reject) => {
    user.find({email: email}, {name: name, email: email, created_at: 1, _id: 0})
    .then(users => resolve(users[0]))
    .catch(err => reject({
        status: 500,
        message: "Internal Server Error"
    }))
});