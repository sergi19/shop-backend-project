const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Product = require('../models/product');
const path = require('path');
const fs = require('fs-extra');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(fileUpload());

app.put('/upload/:id', (req, res) => {
    let id = req.params.id;

    //Get file name and extension
    let fileInfo = getFileInfo(req, id);

    //Validate allowed extensions
    validateAllowedExtensions(res, fileInfo.extension);

    saveProductImage(id, res, fileInfo);
    
});

function validateAllowedExtensions(res, extension) {
    let allowedExtensions = ['png', 'jpg', 'jpeg'];
    const validExtensions = allowedExtensions.some(ext => ext === extension);
    if (!validExtensions) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + allowedExtensions.join(', ')
            }
        });
    }
}

function getFileInfo(req, id) {
    if (!req.files) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'No hay archivos seleccionados'
            }
        });
    }

    let file = req.files.file;
    let extension = file.name.split('.')[1];
    return {
        file,
        fileName: `${id}.${extension}`,
        extension
    };
}

function saveProductImage(id, res, fileInfo) {
    try {
        Product.findById(id, (err, product) => {
            if (err || !product) {
                return res.status(err ? 500 : 400).json({
                    ok: false,
                    err: {
                        message: err ? err.message : 'El producto no fue encontrado'
                    }
                });
            }

            fileInfo.file.mv(`uploads/${fileInfo.fileName}`, async (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                const completePath = path.resolve(__dirname, `../../uploads/${fileInfo.fileName}`);
                const result = await cloudinary.uploader.upload(completePath);
                product.urlImg = result.url;
                product.publicId = result.public_id;
    
                product.save(async (err, savedProduct) => {
                    if (err || !savedProduct) {
                        return res.status(err ? 500 : 400).json({
                            ok: false,
                            err: {
                                message: err.message
                            }
                        });
                    }
                    await fs.unlink(completePath);
    
                    res.json({
                        ok: true
                    });
                });
            });
        });

    } catch(e) {
        console.log(e);
    }
}

module.exports = app;
