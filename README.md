# assignment2 OOP

# New Updates for Panda Restaurant Website

[![Watch the video](new_version_panda_restaurant.mp4)

A modern, full-featured restaurant website built with Node.js and Express, featuring a responsive design and dynamic content management.

## New Features

- Implemented CRUD methods to model classes
- Added features related to MFA Authentication used Google Authenticator and role-based access control
- New feature for Users Manager
- Migrated using MySQL2 to a hosted database on Firebase


## Technologies Used

- Node.js
- Express.js
- Speakeasy.js
- EJS (Embedded JavaScript templating)
- CSS3 with animations
- Bootstrap
- Materialize CSS
- Firebase for database operations

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)
- MySQL Server

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pandarestaurant
```

2. Install dependencies:
```bash
npm install
```

## Configure the database
   - Use a Json key to connect the firebase database
   - Or you can create a new database, includes two tables (users and booking)
 
    ![Alt text](users.jpg)

    ![Alt text](bookings.jpg)


   The application will be available at `http://localhost:3000`