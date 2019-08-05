var auth = require('basic-auth');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var register = require('../functions/register');
var login = require('../functions/login');
var password = require('../functions/password');
var profile = require('../functions/profile');
var config = require('../config/config.json');


// DEFAULT ENDPOINT
router.get('/', function (req, res) {
    res.end('Welcome to Laundro');
    console.log('welcome to laundro');
})

// LOGIN ROUTE
router.post('/login', function (req, res) {
    const credentials = auth(req);
    if (!credentials) {
        res.status(400).json({
            message: 'Invalid Request'
        });
    } else {
        login.loginUser(credentials.name, credentials.pass)
            .then(result => {
                const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
                res.status(result.status).json({
                    message: result.message,
                    token: token
                })
            })
            .catch(function (err) {
                res.status(err.status).json({ message: err.message })
            });

    }
    console.log("login");
});

// REGISTER ROUTE
router.post('/users', function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    if (!name || !password || !name.trim() || !email.trim() || !password.trim()) {
        res.status(400).json({ message: "Invalid Request" });
    } else {
        register.registerUser(name, email, password)
            .then(function (result) {
                res.setHeader('Location', '/users/' + email);
                res.status(result.status).json({ message: result.message });
            })
            .catch(function (err) {
                res.status(err.status).json({ message: result.message });
            })

    }
    
    console.log("register route reached")
});

// PROFILE ROUTE
router.get('/users/:id', function (req, res) {
    if (checkToken(req)) {
        profile.getProfile(req.params.id)
            .then(function (result) {
                res.status.json(result);
            })
            .catch(function (err) {
                res.status(err.status).json({ message: err.message });
            })
    } else {
        res.status(401).json({ message: "Inalid Token" });
    }
    console.log('profile rote reached');
})

// CHANGE THE PASSWORD
router.put('/users/:id', function (req, res) {
    if (checkToken(req)) {
        let oldPassword = req.body.password;
        let newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {
            res.status(400).json({ message: 'Invalid Request' })
        } else {
            password.changePassowrd(req.params.id, oldPassword, newPassword)
                .then(function (result) {
                    res.status(result.status).json({ message: result.message })
                })
                .catch(function (err) {
                    res.status(err.status).json({ message: err.message });
                })
        }
    } else {
        res.status(401).json({ message: "Invalid Token" });
    }
    console.log("put route reached");
})

// RESET PASSWORD OPERATION
router.post('/users/:id/password', function (req, res) {
    let email = req.params.id;
    let token = req.body.token;
    let newPassword = req.body.newPassword;

    if (!token || !newPassword || !token.trim() || !newPassword.trim()) {
        password.resetPasswordInit(email)
            .then(function (result) {
                res.status(result.status).json({ message: result.message });
            })
            .catch(function (err) {
                res.status(err.status).json({ message: err.message });
            })
    } else {
        password.resetPasswordFinish(email, token, newPassword)
            .then(function (result) {
                res.status(result.status).json({ message: result.message });
            })
            .catch(function (err) {
                res.status(err.status).json({ message: result.message });
            })
    }
    console.log("reset route reached");
});

function checkToken(req) {
    const token = req.headers['x-acess-token'];
    if (token) {
        try {
            var decoded = jwt.verify(token, config.secret);
            return decoded.message === req.params.id;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}
module.exports = router;
