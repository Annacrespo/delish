const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);

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

router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

//validate registration data
//register user
//login user

router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout',
  authController.logout
);

router.get('/account', 
  authController.isLoggedIn,
  userController.account
);

router.post('/account',
  catchErrors(userController.updateAccount)
);

router.post('/account/forgot',
  catchErrors(authController.forgot)
);

router.get('/api/v1/search', 
  catchErrors(storeController.searchStores)
);

router.get('/api/stores/near', 
  catchErrors(storeController.mapStores)
);

router.get('/map', storeController.mapPage
);

module.exports = router;
