const BaseModel = require('./BaseModel');
const db = require('../utils/database');

// Using Encapsulation and Inheritance features
class LoginModel extends BaseModel {
  #userID;
  #UserName;
  #Password;
  #Token;
  #Role;
  #FirstName;
  #LastName;

  constructor(userAuthenticationData) {
    super();
    this.#userID = null;
    this.#UserName = userAuthenticationData.UserName;
    this.#Password = userAuthenticationData.Password;
    this.#Token = userAuthenticationData.Token;
    this.#Role = userAuthenticationData.Role;
    this.#FirstName = userAuthenticationData.FirstName;
    this.#LastName = userAuthenticationData.LastName;
  }

  // Getters and setters
  get userID() {
    return this.#userID;
  }
  get UserName() {
    return this.#UserName;
  }
  get Password() {
    return this.#Password;
  }

  get Token() {
    return this.#Token;
  }

  set Token(value) {
    this.#Token = value;
  }

  // Getters and setters for Role
  get Role() {
    return this.#Role;
  }

  set Role(value) {
    this.#Role = value;
  }

  // Getters and setters for FirstName
  get FirstName() {
    return this.#FirstName;
  }

  set FirstName(value) {
    this.#FirstName = value;
  }

  // Getters and setters for LastName
  get LastName() {
    return this.#LastName;
  }

  set LastName(value) {
    this.#LastName = value;
  }
  //--------set methods
  set Password(value) {
    this.#Password = value;
  }
  set userID(value) {
    this.#userID = value;
  }
  set UserName(value) {
    this.#UserName = value;
  }

  //================ implement CURD methods ==================================
  async create() {
    try {
      const result = await db.execute(
        'INSERT INTO users (username, password, token, role, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?)',
        [this.UserName, this.Password, this.Token, this.Role, this.FirstName, this.LastName]
      );
      this.userID = result[0].insertId;
      return result;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async read() {
    try {
      const [rows, fields] = await db.query(
        'SELECT DISTINCT * FROM users WHERE userid = ? LIMIT 1',
        [this.userID]
      );
      return rows;
    } catch (error) {
      console.error('Failed to read user data:', error);
      throw error;
    }
  }

  async update() {
    try {
      const result = await db.execute(
        'UPDATE users SET username = ?, password = ?, token = ?, role = ?, firstname = ?, lastname = ? WHERE userid = ?',
        [this.UserName, this.Password, this.Token, this.Role, this.FirstName, this.LastName, this.userID]
      );
      return result;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const result = await db.execute(
        'DELETE FROM users WHERE userid = ?',
        [this.userID]
      );
      return result;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  async save() {
    if (this.userID) {
      return this.update();
    } else {
      return this.create();
    }
  }

  //=================== implement Authentication functions ============================
  async loginMFA() {
    try {
      const result = await db.execute(
        'SELECT * FROM USERS WHERE username = ? AND password = ?',
        [this.UserName, this.Password]
      );
      if (result[0].length > 0) {
        const user = result[0][0];
        console.log("Successful confirmation for the user at local level!");
        console.log(user);
        return user;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}

module.exports = LoginModel;