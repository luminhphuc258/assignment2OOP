const db = require('../utils/database');
//Using abstraction
class BaseModel {
  constructor(collectionName) {
    if (this.constructor === BaseModel) {
      throw new Error("BaseModel is an abstract class and cannot be instantiated directly.");
    }
    this.collection = db.collection(collectionName);
  }

  // Implement CRUD 
  async create(data) {
    try {
      const docRef = await this.collection.add(data);
      console.log('Document written with ID:', docRef.id);
      return docRef.id; // Return the new document's ID
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async read(UserName) {
    try {
      const userRef = this.collection.where('username', '==', UserName);
      const snapshot = await userRef.get();

      if (!snapshot || snapshot.empty) {
        console.log('No such document or snapshot is undefined!');
        return null;
      } else {
        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        user.docId = userDoc.id;
        console.log('User data:', user);
        return user;
      }
    } catch (error) {
      console.error("Error reading document: ", error);
      throw error;
    }
  }

  async update(docId, data) {
    try {
      await this.collection.doc(docId).update(data);
      console.log('Document successfully updated!');
      return true;
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }
  async delete(docId) {
    try {
      await this.collection.doc(docId).delete();
      console.log('Document successfully deleted!');
      return true;
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }

  async save() {
    throw new Error("Method 'save()' must be implemented.");
  }



  static async fetchById(id) {
    throw new Error("Method 'fetchById()' must be implemented.");
  }

  static async fetchAll() {
    throw new Error("Method 'fetchAll()' must be implemented.");
  }

}

module.exports = BaseModel;
