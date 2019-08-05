'use strict';
var user = require('../models/user');
var bcrypt = require('bcryptjs');

exports.registerUser = (name, email, password) =>

new Promise((resolve, reject) =>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    var newUser = new user({
        name: name,
        email: email,
        hashed_password: hash,
        created_at: new Date()
    });

    newUser.save()
    .then(() => resolve({
        status: 201,
        message: "User Registered Succesfully"
    }))
    .catch(err => {
        if (err.code == 11000) {
            reject({
                status: 409,
                message: "User Already Registered"
            })
        }
        else {
            reject({
                status: 500,
                message: "Internal Service Error"
            })
        }
    })
})