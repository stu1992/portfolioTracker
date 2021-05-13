
const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
const User = require('../model/User');

router.route('/:id').get((req, res) => {
Portfolio.findById(req.params.id)
.then(portfolio => res.json(portfolio))
.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  //const {email, password } = req.body;
  const userdata = {"email": "Kiana", "password": "password"}
  console.log(req.body);
  const user = new User(userdata);
  user.save(function(err) {
    if (err) {
      res.status(500).json("error registering user1");
    }else{
      res.status(200).json("done");
    }
    })
});


module.exports = router;
