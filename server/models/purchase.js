var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaPurchase = new Schema({
    totalCharge: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number }
});

module.exports = mongoose.model('Purchase', schemaPurchase);