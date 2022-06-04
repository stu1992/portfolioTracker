const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TickerSchema = new Schema({
      "internalTicker": {
        "type": "string"
      },
      "description": {
        "type": "String"
      }
});
const TickersSchema = new Schema([
 // "tickers": {
   // "type": [
      TickerSchema
    //]}
]
);

const Tickers = mongoose.model('Ticker', TickersSchema);

module.exports = Tickers;
