const BaseController = require('./BaseController');
const UsersManagerModel = require('../models/UsersManagerModel');
const ViewController = require('./viewController');


class UsersManagementController extends BaseController {
  constructor() {
    super();
  }

  // Polymorphism
  async render(res, view, options = {}) {
    try {
      const usermanagermodel = new UsersManagerModel();
      const allDataRows = await usermanagermodel.readAllData();
      console.log("=== Call render method in userController ========")
      console.log(allDataRows)

      console.log("=== Call view controller for making html tags of a reseravtion table ========")
      const htmlContent = await ViewController.createUsersAccountTable(allDataRows);
      console.log(htmlContent);
      console.log("=====================================================")

      super.render(res, view, {
        ViewContent: htmlContent,
        pageTitle: 'User Management',
        path: '/usermanagement',
        confirmationData: allDataRows,
        userRole: options.userRole,
        UserLastName: options.UserLastName,
        isLogined: options.isLogined,
        userId: options.userId
      });

    } catch (error) {
      this.handleError(error, null, res, null);
    }
  }

  async getAllUsersData(req, res, next) {
    try {
      // call render method in this sub-class
      this.render(res, 'usermanagement', {
        isLogined: true,
        userRole: req.session.userRole,
        UserLastName: req.session.lastname,
        userId: req.session.userId
      });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }


  async UpdateUserInfo(req, res, next) {
    try {
      const usermanagement = new UsersManagerModel();
      const update_result = await usermanagement.update(req.body.UserId, req.body.Password, req.body.FirstName, req.body.LastName);
      console.log(update_result);
      if (update_result) {
        req.session.lastname = req.body.LastName;
        req.session.isLoggedIn = true;
        res.status(200).send({ success: true, message: "User updated successfully" });
      } else {
        res.status(500).send({ success: false, message: "Failed to update user" });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: "Cannot delete current user!" });
    }
  }

  async DeleteUser(req, res, next) {
    try {
      if (req.session.userId !== req.body.UserId) {
        const usermanagement = new UsersManagerModel();
        const delete_result = await usermanagement.delete(req.body.UserId);
        console.log(delete_result);
        if (delete_result) {
          req.session.isLoggedIn = true;
          res.status(200).send({ success: true, message: "User updated successfully" });
        } else {
          res.status(500).send({ success: false, message: "Failed to update user" });
        }
      } else {
        res.status(500).send({ success: false, message: "Cannot delete current user!" });
      }

    } catch (error) {
      res.status(500).send({ success: false, message: "Cannot delete current user!" });
    }
  }





  // Polymorphism
  handleError(error, req, res, next) {
    // Implement error handling, possibly logging and sending a HTTP error response
    console.error(error);
    res.status(500).send('Something wrong with searching data!');
  }
}

module.exports = new UsersManagementController();
