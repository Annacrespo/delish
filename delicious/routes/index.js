const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
/*
router.get('/', (req, res, next) => {
  const anna = { name: 'Anna', age: 100, cool: true};
  // res.send('Hey! It works!');
  // res.json(anna);
  // res.send(req.query.name);
  // res.json(req.query);
  // req.query
  res.render('hello', {
    name: 'Wes',
    dog: req.query.dog,
    title: 'I love food'
  }); //views/hello.pug
});
*/
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);



router.get('/reverse/:name', (req, res)=> {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
