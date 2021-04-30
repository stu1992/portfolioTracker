const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    "_id": {
      "type": "String"
    },
    "portfolio": {
      "BTC": {
        "type": "Number"
      }
    },
    "seriesdataset": {
      "type": [
        "Mixed"
      ]
    },
    "dates": {
      "type": [
        "String"
      ]
    }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
