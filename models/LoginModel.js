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
    super("users");
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
      // First check if a user with the same username already exists
      const userRef = db.collection('users').where('username', '==', this.UserName);
      const snapshot = await userRef.get();

      if (!snapshot.empty) {
        console.error('Username already exists.');
        return null;
      }

      // If no existing user, create a new user
      let docRef = await db.collection('users').add({
        username: this.UserName,
        password: this.Password,
        token: this.Token,
        role: this.Role,
        firstname: this.FirstName,
        lastname: this.LastName
      });

      console.log('User created successfully with ID:', docRef.id);
      return docRef;  // Return the document reference
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async read() {
    try {
      const docRef = db.collection('users').doc(this.userID);
      const doc = await docRef.get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('No such document!');
      }
    } catch (error) {
      console.error('Failed to read user data:', error);
      throw error;
    }
  }

  async update() {
    try {
      const userRef = db.collection('users').doc(this.userID);
      const result = await userRef.update({
        username: this.UserName,
        password: this.Password,
        token: this.Token,
        role: this.Role,
        firstname: this.FirstName,
        lastname: this.LastName
      });
      console.log('User updated successfully!');
      return result; // Firestore returns a WriteResult on successful update
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const userRef = db.collection('users').doc(this.userID);
      await userRef.delete();
      console.log('User deleted successfully!');
      return { success: true };
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
      const user = await super.read(this.UserName);
      console.log(user);
      if (user) {
        const userId = user.docId;
        console.log("loginMFA");
        // Check if the password matches
        if (user.password === this.Password) {
          console.log("Successful confirmation for the user at local level!");
          user.id = userId;
          return user;
        } else {
          console.log("Password does not match");
          return null;
        }
      } else {
        console.log("No user found with the provided username");
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }
}

module.exports = LoginModel;