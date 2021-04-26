
const router = require('express').Router();
let Portfolio = require('../model/Portfolio');

router.route('/:id').get((req, res) => {
Portfolio.findById(req.params.id)
.then(portfolio => res.json(portfolio))
.catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
