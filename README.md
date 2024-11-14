**Scheme-4u**

Database Technology: MongoDB

Backend: Node.js with Express, CORS, Mongoose, user and database authenticated using middlewares

Frontend: React

**Project Overview**

Scheme-4u is a tool that predicts government scholarships and schemes for users. It scrapes data from myscheme.gov.in (data not pushed to GitHub). The tool displays predicted schemes in a popup with simple cards for each scholarship, and also saves the user data and the prediction in the database.

**Features**

User Predictions: Predicts government scholarships and schemes for users.
Data Display: Displays predicted schemes in a user-friendly format.
Admin Dashboard (under development): Protected route for admins to upload and interact with CSV files to manage and update scheme data. Provides tools for admins to counsel users effectively.

**Installation**
Clone the repository:

    git clone https://github.com/vjrdnti/Scheme-4u.git
    cd Scheme-4u

Install dependencies:

    npm install

Configure environment variables:
Create a .env file in the root directory and add the necessary environment variables.
Run the server (in server/):

    node server.js

Run the application (in /client):

    npm start

**Usage**

Access the application at http://localhost:3000.
Use the landing page to predict on your own data, placed in server/data/. form can be readjusted accordingly, admin dashboard to upload and manage scheme data .

**Contributing**
Contributions are welcome! Please fork the repository and submit a pull request.
