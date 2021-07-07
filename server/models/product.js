var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaProduct = new Schema({
    name: { 
        type: String, required: [true, 'El nombre es requerido'] 
    },
    price: { 
        type: Number, required: [true, 'El precio es requerido'] 
    },
    description: { 
        type: String, required: false 
    },
    available: { 
        type: Boolean, required: false, default: true 
    },
    quantity: {
        type: Number, required: true
    },
    urlImg: {
        type: String, required: false 
    },
    publicId: {
        type: String, required: false 
    }
});

module.exports = mongoose.model('Product', schemaProduct);