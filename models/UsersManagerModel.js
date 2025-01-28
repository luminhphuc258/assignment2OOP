const BaseModel = require('./BaseModel');
const db = require('../utils/database');

// Using Encapsulation and Inheritance features
class UsersManagerModel extends BaseModel {

  constructor() {
    super("users");
  }
  //================ implement CURD methods ==================================
  async readAllData() {
    try {
      const collectionRef = db.collection('users');
      const snapshot = await collectionRef.get();
      if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
      }
      let allUsers = [];
      snapshot.forEach(doc => {
        let userData = doc.data();
        userData.userid = doc.id;
        allUsers.push(userData);
      });
      console.log(allUsers);
      return allUsers;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error('Failed to retrieve documents!');
    }
  }

  async update(userID, Password, FirstName, LastName) {
    try {
      console.log("Call update users");
      const userRef = db.collection('users').doc(userID);
      const result = await userRef.update({
        password: Password,
        firstname: FirstName,
        lastname: LastName
      });
      if (result) {
        console.log('User updated successfully!');
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  }

  async delete(userID) {
    try {
      console.log("Call delete users");
      const userRef = db.collection('users').doc(userID);
      await userRef.delete();
      console.log('User deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }

}

module.exports = UsersManagerModel;