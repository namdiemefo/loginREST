const user = require('../models/user');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var config = require('../config/config.json');



exports.changePassowrd = (email, password, newpassword) =>
    new Promise((resolve, reject) => {
        user.find({ email: email })
            .then(users => {
                let user = users[0];
                const hashed_password = user.hashed_password;

                if (bcrypt.compareSync(password, hashed_password)) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(newpassword, salt);

                    user.hashed_password = hash;
                    return user.save();
                } else {
                    reject({
                        status: 401,
                        message: 'Invalid Old Password'
                    })
                }
            })
            .then(user => resolve({
                status: 200,
                message: "Password Updated Successfully"
            }))
            .catch(err => reject({
                status: 500,
                message: "Internal Server Error"
            }));
        })

exports.resetPasswordInit = (email) => 
new Promise((reject , resolve) => {
    const random = randomstring.generate(8);
    user.find({email: email})
    .then(users => {
        if(users.length == 0) {
            reject({
                status: 404,
                message: "User not found"
            })
        } else {
            let user = users[0];
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(random, salt);
            console.log(hash);
            user.update({
                temp_password: hash,
                temp_password_time: Date.now() + 360000,
            })

            // user.temp_password = hash;
            // user.temp_password_time = new Date();

            // return user.save();
        }
    })
    .then(user => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            pool: true,
            auth: {
                user: 'naemoapp@gmail.com',
                pass: 'Tolunnamdi17'
            }
        });

        const mailOptions = {
            from: `Naemoapp@gmail.com`,
            to: email,
            subject: 'Reset Password Request',
            html: `Hello,

    Your reset password token is <b>${random}</b>.
    If you are veiwing his mail from an Android device click this <a href="http://laundro.com/${random}">link</a>. 
    The token is valid for only 2 minutes.

    Thanks,
    Nnamdi.`
        };
        return transporter.sendMail(mailOptions, function(err, response){
            if(err) {
                console.log('there was an error: ' + err);
            } else {
                console.log('there is the res: ' + response);
            }
            transporter.close();
        });
    })
    .then(info => {
        console.log(info);
        resolve({
            status: 200,
            message: 'Check mail for instructions'
        })
    })
            .catch(err => {
                console.log(err);
                reject({
                    status: 500,
                    message: 'Internal Server Error'
                });
            });
    
});
    
//    exports.resetPasswordFinish = (email, token, password) =>
//     new Promise((resolve, reject) => {
//         user.find({email: email})
//         .then(users => {
//             let user = user[0];
//             const diff = new Date() - new Date(user.temp_password_time);
//             const seconds = Math.floor(diff/1000);
//             console.log(`Seconds: ${seconds}`);

//             if(seconds < 120) {
//                 return user;
//             } else {
//                 reject({
//                     status: 401,
//                     message: "Time Out!, Try Again"
//                 });
//             }
//         })
//         .then(user => {
//             if(bcrypt.compareSync(token, user.temp_password)) {
//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(password, salt);
//             user.hashed_password = hash;
//             user.temp_password = undefined;
//             user.temp_password_time = undefined;

//             return user.save();

//             } else {
//                 reject({
//                     status: 401,
//                     message: "Invalid Token"
//                 })
//             }
//         })
//         .then(user => resolve({
//             status: 401,
//             message: "Password Changed Successfully"
//         }))
//         .catch(err => reject({
//             status: 500,
//             message: "Internal Server Error"
//         }));
//     });


            
