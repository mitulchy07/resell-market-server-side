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
    const categoryCollection = client
      .db('resellMarket')
      .collection('categories');
    const sellCollection = client.db('resellMarket').collection('sell');

    app.get('/categories', async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });
    app.get('/allsellers', async (req, res) => {
      const query = { role: 'seller' };
      const cursor = allUser.find(query);
      const sellers = await cursor.toArray();
      res.send(sellers);
    });

    app.post('/users', async (req, res) => {
      const userData = req.body;
      const result = await allUser.insertOne(userData);
      res.send(result);
    });
    app.post('/sell', async (req, res) => {
      const carData = req.body;
      const result = await sellCollection.insertOne(carData);
      res.send(result);
    });

    app.get('/dashboard/:email', async (req, res) => {
      const email = req.params.email;
      let query = {};
      if (email) {
        query = {
          email: email,
        };
      }
      const userData = await allUser.findOne(query);
      res.send(userData);
      console.log(email);
    });
    app.get('/myitems/:email', async (req, res) => {
      const email = req.params.email;
      let query = {};
      if (email) {
        query = {
          email: email,
        };
      }
      const cursor = sellCollection.find(query);
      const itemsForSell = await cursor.toArray();
      res.send(itemsForSell);
    });
    app.get('/category/:category', async (req, res) => {
      const category = req.params.category;
      let query = {};
      if (category) {
        query = {
          category: category,
        };
      }
      const cursor = sellCollection.find(query);
      const brand = await cursor.toArray();
      res.send(brand);
    });

    app.put('/myitems/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const review = req.body;
      const updatedReview = {
        $set: {
          advertise: review.advertise,
        },
      };
      const result = await sellCollection.updateOne(
        filter,
        updatedReview,
        option
      );
      res.send(result);
    });

    app.delete('/myitems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await sellCollection.deleteOne(query);
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
