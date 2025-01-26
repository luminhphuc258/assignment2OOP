const BaseController = require('./BaseController');
const LoginModel = require('../models/LoginModel');
// add libraries for google MFA 
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
let mfa_share_key = '';
class RegisterController extends BaseController {
  constructor() {
    super();
  }

  CheckingPassCodeSetUp(mfatoken, userpasscode) {
    var verified = speakeasy.totp.verify({
      secret: mfatoken,
      encoding: 'ascii',
      token: userpasscode
    });
    console.log(verified);
    return verified;
  }

  async create_secretToken(req, res) {
    console.log("Call generate a new secret token!");
    // only create this key for new users
    var secret = speakeasy.generateSecret({
      name: "PandaRestaurant"
    });
    mfa_share_key = secret.ascii;
    console.log("secret key");
    console.log(mfa_share_key);
    // create Qr code
    qrcode.toDataURL(secret.otpauth_url, function (error, imagedata) {
      if (imagedata) {
        res.render('registeruser', {
          qrCodeUrl: imagedata,
          userSecretCode: mfa_share_key
        });
      } else {
        res.status(500).send("Error initiating authentication");
      }
    })
  }

  // Method to handle the registration form submission
  async register(req, res) {
    try {
      // Create a new user model instance
      const newUser = new LoginModel(req.body);
      const confirmPassword = req.body.confirmPassword;
      const userPassCode = req.body.PassCode;
      const userToken = req.body.Token;

      // Check if passwords match
      if (newUser.Password !== confirmPassword) {
        //redirect to register page due to not matching password
        this.create_secretToken(req, res);
      }

      // check if user set up MFA  propertly
      if (!this.CheckingPassCodeSetUp(userToken, userPassCode)) {
        this.create_secretToken(req, res);
      }

      // Save the new user to the database
      const savedUser = await newUser.create();
      if (savedUser) {
        console.log('User successfully registered');
        res.redirect('/login');
      } else {
        throw new Error('Failed to register user');
      }

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send("Error during registration");
    }
  }

  // Method to delete a user
  async deleteUser(req, res) {
    try {
      const { userID } = req.params;
      const userToDelete = new LoginModel({ UserID: userID });
      const deleted = await userToDelete.delete();
      if (deleted) {
        console.log('User successfully deleted');
        res.redirect('/user-list');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Deletion error:', error);
      res.status(500).send("Error during user deletion");
    }
  }

  // Method to reada a user infomation
  async ReadUserInfo(req, res) {
    try {
      const { userID } = req.params;
      const userinstance = new LoginModel({ UserID: userID });
      const userinfo = await userinstance.read();
      if (userinfo) {
        console.log(userinfo);
        res.redirect('/user-list');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Deletion error:', error);
      res.status(500).send("Error during user deletion");
    }
  }
}

module.exports = new RegisterController();
