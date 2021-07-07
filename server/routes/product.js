const express = require('express');
const { tokenVerification, roleAdminVerification } = require('../middlewares/authentication');
const app = express();
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');

app.get('/products', (req, res) => {
    let from = Number(req.query.from) || 0;
    let to = Number(req.query.to) || 0;

    Product.find({})
    .skip(from)
    .limit(to)
    .exec((err, products) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err.message
                }
            });
        }

        return res.status(200).json({
            ok: true,
            products
        });
    });
});

app.get('/productImage/:img', (req, res) => {
    let imagePath = path.resolve(__dirname, `../../uploads/${req.params.img}`);
    if (fs.existsSync(imagePath)) res.sendFile(imagePath);
    else res.status(400).json({
        ok: false,
        err: 'La imágen no existe'
    })
});

app.post('/product', (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        quantity: body.quantity
    });

    product.save((err, productDB) => {
        if (err || !productDB) {
            return res.statud(err ? 500 : 400).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })
});

app.put('/product/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, product) => {
        if (err || !product) {
            return res.status(err ? 500 : 400).json({
                ok: false,
                err: {
                    message: err ? err.message : 'El producto no fue encontrado'
                }
            })
        }

        return res.json({
            ok: true,
            product
        })
    })
});

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;
    Product.findByIdAndRemove(id, {runValidators: true}, (err, product) => {
        if (err || !product) {
            return res.status(err ? 500 : 400).json({
                ok: false,
                err: {
                    message: err ? err.message : 'El producto no fue encontrado'
                }
            })
        }

        res.json({
            ok: true,
            product
        })
    })
});

module.exports = app;