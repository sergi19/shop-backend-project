const express = require('express');
const { tokenVerification, roleAdminVerification } = require('../middlewares/authentication');
const app = express();
const Purchase = require('../models/purchase');
const Product = require('../models/product');

app.get('/purchase', (req, res) => {
    let from = Number(req.query.from) || 0;
    let to = Number(req.query.to) || 0;

    Purchase.find({})
    .skip(from)
    .limit(to)
    .exec((err, purchases) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err: {
                    message: err.message
                }
            });
        }

        res.json({
            ok: true,
            purchases
        });
    })
});

app.get('/purchase/:userId', (req, res) => {
    const userId = req.params.userId;
    Purchase.find({user: userId})
    .skip(from)
    .limit(to)
    .exec((err, purchases) => {
        if (err) {
            return res.status(err ? 500 : 400).json({
                ok: false,
                err: {
                    message: err ? err.message : 'The user was not found'
                }
            });
        }

        res.json({
            ok: true,
            purchases
        });
    })
});

app.post('/purchase', (req, res) => {
    let body = req.body;
    let purchase = new Purchase({
        totalCharge: body.totalCharge,
        user: body.user,
        product: body.product,
        quantity: body.quantity
    });

    purchase.save((err, purchaseDB) => {
        if (err || !purchaseDB) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        Product.findById(body.product, (err, product) => {
            if (err || !product) {
                return res.status(err ? 500 : 400).json({
                    ok: false,
                    err: {
                        message: err ? err.message : 'The product was not found'
                    }
                })
            }

            product.quantity = body.quantity < product.quantity ? product.quantity - body.quantity : 0;
            product.available = product.quantity === body.quantity ? false : true;
            product.save((err, productDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
            })
        });

        res.json({
            ok: true,
            purchase: purchaseDB
        })
    })
});

module.exports = app;