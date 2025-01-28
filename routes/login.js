

const express = require('express');
const LoginController = require('../controllers/loginController');
const RegisterController = require('../controllers/registerNewUserController');
const UsersManagementController = require('../controllers/usersManagementController');
const router = express.Router();

// ============================= HANDLE GET REQUESTS FROM CLIENT ====================
// handle to redirect to register page
router.get('/register', (req, res, next) => {
  console.log('Redirect to register page');
  RegisterController.create_secretToken.bind(RegisterController)(req, res, next);
});

// handle to redirect to login page
router.get('/login', (req, res, next) => {
  console.log('Redirect to login page');
  res.render('login', {
    pageTitle: 'The Panda Restaunt',
    path: '/login',
  });
});
// HANDLE REQUEST FOR USER MANAGEMENT FORM
router.get('/usermanagement', (req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log('Redirect to user management page');
    UsersManagementController.getAllUsersData.bind(UsersManagementController)(req, res, next);
  } else {
    res.render('login', {
      pageTitle: 'Login Page',
      isLogined: false
    });
  }
});


router.post(
  '/deleteuser',
  UsersManagementController.DeleteUser.bind(UsersManagementController)
);

router.post(
  '/usermanagement',
  UsersManagementController.UpdateUserInfo.bind(UsersManagementController)
);

// ============================= HANDLE POST REQUESTS FROM CLIENT ====================
//  handle the POST request to Sign-Up
router.post(
  '/register',
  RegisterController.register.bind(RegisterController)
);


// handle the POSt request for Sign-in 
router.post(
  '/signin',
  LoginController.login.bind(LoginController)
);

//  handle the POST request after MFA verification
router.post(
  '/mfa-verification',
  LoginController.MFA_verification.bind(LoginController)
);


// hander the POST request to get user profile 
router.post(
  '/get-userprofile',
  RegisterController.ReadUserInfo.bind(RegisterController)
);

router.post(
  '/delete-user',
  RegisterController.deleteUser.bind(RegisterController)
);

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      res.status(500).send('Failed to log out');
    } else {
      console.log("========ALO OKEM NE")
      res.render('login', {
        pageTitle: 'The Panda Restaunt',
        path: '/login',
        isLogined: false
      });
    }
  });
});

module.exports = router;
