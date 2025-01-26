const BaseController = require('./BaseController');
const LoginModel = require('../models/LoginModel');
// add libraries for google MFA 
const speakeasy = require('speakeasy');

class LoginController extends BaseController {
  constructor() {
    super();
  }

  // verify account at Google Authenciation level
  async MFA_verification(req, res, next) {

    console.log("Calling MFA_verification");
    const user_passcocde = req.body.user_passcocde;
    console.log(user_passcocde);

    //get token from model 
    const user = new LoginModel(req.body);
    user.userID = req.body.userID;
    const userInfo = await user.read();
    const userToken = userInfo.token;

    //final check with MFA 
    var verified = speakeasy.totp.verify({
      secret: userToken,
      encoding: 'ascii',
      token: user_passcocde
    });
    console.log(userInfo.lastname)

    if (verified) {

      //store session of the users after they login successfully
      req.session.userId = user.userID;
      req.session.lastname = userInfo.lastname;
      req.session.userRole = userInfo.role;
      req.session.isLoggedIn = true;

      // Authentication successful
      console.log("Granted to Access by Google-Authentication!");
      res.render('index', {
        pageTitle: 'Home Page',
        userRole: userInfo.role,
        UserLastName: userInfo.lastname,
        isLogined: true
      });
    } else {
      // Authentication failed
      console.log("Denied to Access by Google-Authentication!");
      res.render('googleauthentication', {
        pageTitle: 'Google MFA Authentication',
        path: '/mfa-verify',
        userID: user.userID,
        bannermessage: 'PassCode is incorrect & Denied to Access by Google-Authentication! '
      });
    }
  }

  //verify user account at local level
  async login(req, res, next) {
    console.log("Calling login!");
    const loginmodel = new LoginModel(req.body);
    const user = await loginmodel.loginMFA();
    console.log(user);
    if (user) {
      // MFA authentication
      console.log('Redirect to MFA setup');
      console.log(user.id);
      try {
        res.render('googleauthentication', {
          userID: user.id,
        });

      } catch (error) {
        console.error('Failed to start Google authentication:', error);
        res.status(500).send("Error initiating authentication");
      }

    } else {
      console.log('Redirect to main page');
      res.render('login', {
        pageTitle: 'Login Page',
        path: '/login',
        bannermessage: 'Incorrect userName or Password!'
      });
    }

  }


}

module.exports = new LoginController();
