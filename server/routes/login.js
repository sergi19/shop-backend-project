const express = require('express');
const app = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { tokenVerification } = require('../middlewares/authentication');
const client = new OAuth2Client(process.env.CLIENT_ID);

const jwtSing = (userDB) => {
    return jwt.sign(
        {user: userDB}, 
        process.env.TOKEN_SECRET, 
        {expiresIn: process.env.TOKEN_EXPIRATION_DATE}
    );
}

//Google Configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    }
}

app.post('/login', async(req, res) => {
    let token = req.body.idToken;
    let googleUser = await verify(token).catch(err => {
            return res.status(403).json({
                ok: false,
                err: err
            })
        });

    User.findOne({email: googleUser.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img
            });

            user.save((err, userCreated) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    user: userCreated,
                    token: jwtSing(userCreated)
                });
            })
        } else {
            res.json({
                ok: true,
                user: userDB,
                token: jwtSing(userDB)
            });
        }

    });
    
});

app.get('/user-info', [tokenVerification], (req, res) => {
    return res.json({...req.user})
});

module.exports = app;