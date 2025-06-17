// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON requests

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
