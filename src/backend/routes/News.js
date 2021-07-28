const router = require('express').Router();
let News = require('../model/News');

router.route('/').get((req, res) => {
  News.find({tags : {$in : ["all"] }}, {"_id": 0}).sort({"date":-1}).limit(6)
.then(news => res.json(news));
});

module.exports = router;
