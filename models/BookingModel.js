const BaseModel = require('./BaseModel');
const db = require('../utils/database');

// Using Encapsulation and Inheritance features
class BookingModel extends BaseModel {
  #bookingId;
  #firstName;
  #lastName;
  #email;
  #phone;
  #numberOfGuests;
  #date;
  #time;
  #tableType;
  #specialRequests;
  #status;

  constructor(bookingData) {
    super();
    this.#bookingId = null;
    this.#firstName = bookingData.firstName;
    this.#lastName = bookingData.lastName;
    this.#email = bookingData.email;
    this.#phone = bookingData.phone;
    this.#numberOfGuests = bookingData.numberOfGuests;
    this.#date = bookingData.date;
    this.#time = bookingData.time;
    this.#tableType = bookingData.tableType;
    this.#specialRequests = bookingData.specialRequests;
    this.#status = 'Confirmed';
  }

  // Getters and setters
  get bookingId() {
    return this.#bookingId;
  }
  get firstName() {
    return this.#firstName;
  }

  set bookingId(value) {
    this.#bookingId = value;
  }

  set firstName(value) {
    this.#firstName = value;
  }
  get lastName() {
    return this.#lastName;
  }
  set lastName(value) {
    this.#lastName = value;
  }
  get email() {
    return this.#email;
  }
  set email(value) {
    this.#email = value;
  }
  get phone() {
    return this.#phone;
  }
  set phone(value) {
    this.#phone = value;
  }
  get numberOfGuests() {
    return this.#numberOfGuests;
  }
  set numberOfGuests(value) {
    this.#numberOfGuests = value;
  }
  get date() {
    return this.#date;
  }
  set date(value) {
    this.#date = value;
  }
  get time() {
    return this.#time;
  }
  set time(value) {
    this.#time = value;
  }
  get tableType() {
    return this.#tableType;
  }
  set tableType(value) {
    this.#tableType = value;
  }
  get specialRequests() {
    return this.#specialRequests;
  }
  set specialRequests(value) {
    this.#specialRequests = value;
  }
  get status() {
    return this.#status;
  }
  set status(value) {
    this.#status = value;
  }

  async save() {
    try {
      // Add a new document in collection "bookings"
      const docRef = await db.collection('booking').add({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        numberOfGuests: this.numberOfGuests,
        date: this.date,
        time: this.time,
        tableType: this.tableType,
        specialRequests: this.specialRequests,
        status: this.status
      });

      this.bookingId = docRef.id;
      console.log('Booking created successfully with ID:', this.bookingId);
      return this.bookingId;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      bookingId: this.#bookingId,
      firstName: this.#firstName,
      lastName: this.#lastName,
      email: this.#email,
      phone: this.#phone,
      numberOfGuests: this.#numberOfGuests,
      date: this.#date,
      time: this.#time,
      tableType: this.#tableType,
      specialRequests: this.#specialRequests,
      status: this.#status,
    };
  }

  // Method to fecth booking data by booking id
  static async fetchById(id) {
    try {
      const docRef = db.collection('booking').doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        console.log('Document data:', doc.data());
        return doc.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  // Method to fetch all bookings with complete reservation details
  static async fetchAll() {
    try {
      const collectionRef = db.collection('booking');
      const snapshot = await collectionRef.get();

      if (!snapshot.empty) {
        // Maps over each document in the collection
        const bookings = snapshot.docs.map(doc => ({
          booking_id: doc.id, // Retrieves and includes the document ID
          ...doc.data() // Retrieves and includes the rest of the document data
        }));
        console.log('Fetched all bookings:', bookings);
        return bookings;
      } else {
        console.log('No bookings found.');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;  // Proper error handling
    }
  }

  // Method to filter bookings by guest name
  static async filterByGuestName(guestName) {
    let query;
    const bookingsRef = db.collection('booking');
    if (guestName) {
      const guestNameLower = guestName.toLowerCase();
      const firstNameQuery = bookingsRef.where('firstName', '==', guestNameLower);
      const lastNameQuery = bookingsRef.where('lastName', '==', guestNameLower);

      // Fetch and combine the results
      const firstNameSnapshot = await firstNameQuery.get();
      const lastNameSnapshot = await lastNameQuery.get();

      let matches = [];
      firstNameSnapshot.forEach(doc => matches.push({ booking_id: doc.id, ...doc.data() }));
      lastNameSnapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        if (!matches.some(match => match.id === docData.id)) {
          matches.push(docData);
        }
      });

      console.log('Matching bookings:', matches);
      return matches.length > 0 ? matches : null;

    } else {
      // If no guest name is provided, fetch all documents
      const snapshot = await bookingsRef.orderBy('lastName', 'asc').get();  // Correct use of orderBy
      if (!snapshot.empty) {
        let matches = snapshot.docs.map(doc => ({
          booking_id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched all bookings:', matches);
        return matches;
      } else {
        console.log('No bookings found.');
        return [];
      }
    }
  }
}

module.exports = BookingModel;
