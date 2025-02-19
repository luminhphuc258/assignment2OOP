const BaseController = require('./BaseController');
const BookingInfo = require('../models/BookingModel');
const ViewController = require('./viewController');


class SearchController extends BaseController {
  constructor() {
    super();
  }

  // Polymorphism
  async render(res, view, options = {}) {
    try {

      const allDataRows = await BookingInfo.filterByGuestName(options.guestName);
      console.log("=== Call render method in searchController ========")
      console.log(allDataRows)

      console.log("=== Call view controller for making html tags of a reseravtion table ========")
      const htmlContent = await ViewController.createSearchResultTable(allDataRows);
      console.log(htmlContent);
      console.log("=====================================================")

      super.render(res, view, {
        ViewContent: htmlContent,
        pageTitle: 'All Reservations',
        path: '/reservationsearch',
        confirmationData: allDataRows,
        usingSearchFunction: false,
        keywords: options.guestName,
        userRole: options.userRole,
        UserLastName: options.lastname,
        isLogined: options.isLogined
      });

    } catch (error) {
      this.handleError(error, null, res, null);
    }
  }

  async getFilteredBookings(req, res, next) {
    try {
      const guestName = req.body.guestName;
      // call render method in this sub-class
      this.render(res, 'reservationsearch', {
        guestName: guestName,
        userRole: req.session.userRole,
        lastname: req.session.lastname,
        isLogined: true
      });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  // Polymorphism
  handleError(error, req, res, next) {
    // Implement error handling, possibly logging and sending a HTTP error response
    console.error(error);
    res.status(500).send('Something wrong with searching data!');
  }
}

module.exports = new SearchController();
