const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'public/uploads/' });
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Route to serve the admin.html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

// Route to handle file upload and text submission
app.post('/upload', upload.single('image'), (req, res) => {
  const { text } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const newUpload = { text, imageUrl };

  fs.readFile('data/uploads.json', 'utf8', (err, data) => {
    if (err) throw err;
    const uploads = JSON.parse(data);
    uploads.push(newUpload);

    fs.writeFile('data/uploads.json', JSON.stringify(uploads), 'utf8', (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// API to get uploaded data
app.get('/api/uploads', (req, res) => {
  fs.readFile('data/uploads.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

module.exports.handler = serverless(app);