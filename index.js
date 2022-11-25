const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Resell market Server is Running.');
});

app.listen(port, () => {
  console.log(`Resell market server running on: ${port} `);
});
