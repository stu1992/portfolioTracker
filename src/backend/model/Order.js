const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  "email": {
    "type": "string"
  },
  "order": {
    "type": "String"
  },
  "ticker": {
    "type": "String"
  },
  "price": {
    "type": "number"
  },
  "volume": {
    "type": "number"
  }

});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
