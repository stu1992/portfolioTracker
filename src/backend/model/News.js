const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  "date": {
    "type": "Date"
  },
  "tags": {
    "type": [
      "String"
    ]
  },
  "title": {
    "type": "String"
  },
  "comment": {
    "type": "String"
  },
  "link": {
    "type": "String"
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
