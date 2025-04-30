// server.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'cor_db',
  port: 4306
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// CREATE - Add a new registration
app.post('/registrations', (req, res) => {
  const registration = req.body;
  const sql = 'INSERT INTO certificate_of_registration SET ?';
  
  db.query(sql, registration, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(201).send({ id: result.insertId, ...registration });
    }
  });
});

// READ - Get all registrations
app.get('/registrations', (req, res) => {
  db.query('SELECT * FROM certificate_of_registration', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).json(results);
    }
  });
});

// READ - Get a single registration by registration_no
app.get('/registrations/:registration_no', (req, res) => {
  const { registration_no } = req.params;
  db.query('SELECT * FROM certificate_of_registration WHERE registration_no = ?', [registration_no], (err, result) => {
    if (err) {
      console.error('Error fetching single data:', err);
      res.status(500).send('Server error');
    } else if (result.length === 0) {
      res.status(404).send('Registration not found');
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// UPDATE - Update a registration by registration_no
app.put('/registrations/:registration_no', (req, res) => {
  const { registration_no } = req.params;
  const updatedData = req.body;

  db.query('UPDATE certificate_of_registration SET ? WHERE registration_no = ?', [updatedData, registration_no], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Registration updated successfully');
    }
  });
});

// DELETE - Delete a registration by registration_no
app.delete('/registrations/:registration_no', (req, res) => {
  const { registration_no } = req.params;

  db.query('DELETE FROM certificate_of_registration WHERE registration_no = ?', [registration_no], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Registration deleted successfully');
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
