const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mhsbjhf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const allUser = client.db('resellMarket').collection('users');

    app.post('/users', async (req, res) => {
      const userData = req.body;
      const result = await allUser.insertOne(userData);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => {
  console.error(err);
});

app.get('/', (req, res) => {
  res.send('Resell market Server is Running.');
});

app.listen(port, () => {
  console.log(`Resell market server running on: ${port} `);
});
