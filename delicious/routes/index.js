const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');
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
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add', 
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.createStore)
);

router.post('/add/:id', 
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));


router.get('/reverse/:name', (req, res)=> {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
