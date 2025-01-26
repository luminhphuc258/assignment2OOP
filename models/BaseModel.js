//Using abstraction
class BaseModel {
  constructor() {
    if (this.constructor === BaseModel) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  // Implement CRUD 
  async create() {
    throw new Error("Method 'create()' must be implemented.");
  }

  async read() {
    throw new Error("Method 'read()' must be implemented.");
  }

  async update() {
    throw new Error("Method 'update()' must be implemented.");
  }

  async delete() {
    throw new Error("Method 'delete()' must be implemented.");
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
