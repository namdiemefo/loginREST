var user = require('../models/user');
var bycrypt = require('bcryptjs');

exports.loginUser = (email, password) =>

new Promise ((resolve, reject) => {
    user.find({
        email: email
    })
    .then(users => {
        if(users.length == 0){
            reject({
                status: 404,
                message: "user not found"
            });
        } else {
            return users[0];
        }
    })
    .then(user => {
        const hashed_password = user.hashed_password;
        if(bycrypt.compareSync(password, hashed_password)) {
            resolve({
                status: 200,
                message: email
            });
        } else {
            reject({
                status: 401,
                message: "invalid credentials"
            });
        }
    })
    .catch(err => reject({
        status: 500,
        message: "Internal Server Error"
    }));
});