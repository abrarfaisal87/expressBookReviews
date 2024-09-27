const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Session middleware applied globally
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

// Login endpoint
// app.post('/login', (req, res) => {
//     const user = req.body.user;
//     if (!user) {
//         return res.status(404).json({ message: 'Empty body' });
//     }

//     let accessToken = jwt.sign({
//         data: user
//     }, 'access', { expiresIn: 60 * 60 });

//     // Initialize session
//     req.session.authorization = {
//         accessToken
//     };

//     console.log('Session initialized:', req.session);

//     return res.status(200).send("User successfully logged in");
// });

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    console.log('Checking session:', req.session);

    if (req.session && req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        jwt.verify(token, 'access', (err, decodedToken) => {
            if (!err) {
                req.user = decodedToken.data;
                next();
            } else {
                return res.status(403).json({ message: 'User not authenticated' });
            }
        });
    } else {
        return res.status(403).json({ message: 'No authorization token found' });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
