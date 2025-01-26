const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const bookingController = require('../controllers/bookingController');

const SearchController = require('../controllers/searchController');

const router = express.Router();

// ============================= HANDLE GET REQUESTS FROM CLIENT ====================
// handle to redirect to main page
router.get('/', (req, res, next) => {
  if (req.session.isLoggedIn === true) {
    res.render('index', {
      pageTitle: 'Home Page',
      userRole: req.session.userRole,
      UserLastName: req.session.lastname,
      isLogined: true
    });
  } else {
    res.render('login', {
      pageTitle: 'Login Page',
      userRole: req.session.userRole,
      UserLastName: req.session.lastname,
      isLogined: false
    });
  }

});

// handle to redirect to booking page
router.get('/bookingform', (req, res, next) => {
  console.log('Redirect to booking page');
  // is logined
  if (req.session.isLoggedIn) {
    res.render('tablebooking', {
      hasErrorInsertedData: false,
      pageTitle: 'Table Booking',
      path: '/bookingform',
      userRole: req.session.userRole,
      UserLastName: req.session.lastname,
      isLogined: true
    });

  } else {
    res.render('login', {
      pageTitle: 'Login Page',
      isLogined: false
    });
  }
});

// handle to redirect to contact page
router.get('/contactus', (req, res, next) => {
  console.log('Redirect to contact page');
  res.render('contact-us', {
    pageTitle: 'Contact Us',
    path: '/contactus',
    userRole: req.session.userRole,
    UserLastName: req.session.lastname,
    isLogined: req.session.isLoggedIn
  });

});

// handle to redirect to about us page
router.get('/aboutus', (req, res, next) => {
  console.log('Redirect to about us page');
  res.render('about-us', {
    pageTitle: 'About Us',
    path: '/aboutus',
    userRole: req.session.userRole,
    UserLastName: req.session.lastname,
    isLogined: req.session.isLoggedIn
  });
});

// get booking confirmation information
router.get(
  '/getConfirmationInfomation',
  bookingController.getBookingInfo.bind(bookingController)
);

// handle to redirect to booking page
router.get(
  '/getAllBookings',
  bookingController.getAllBookings.bind(bookingController)
);

// router.get('/getAllBookings', (req, res, next) => {
//   // is logined
//   if (req.session.isLoggedIn) {
//     bookingController.getAllBookings.bind(bookingController)
//   } else {
//     res.render('login', {
//       pageTitle: 'Login Page',
//       isLogined: false
//     });
//   }
// });

// ============================= HANDLE POST REQUESTS FROM CLIENT ====================

//send user inputs in booking inform to the booking controller
router.post(
  '/add-bookinginfo',
  bookingController.postAddBookingData.bind(bookingController)
);

// handle to redirect to booking page
router.post(
  '/filter-reservations',
  SearchController.getFilteredBookings.bind(SearchController)
);

module.exports = router;
