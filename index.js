const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express()


app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gfue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const database = client.db("CoffeeCollections").collection('coffee')

    app.get('/coffee', async (req, res) => {
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.put('/coffee/:id', async (req, res) => {
      console.log(req.body)
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: {
          coffeeName: updatedCoffee.coffeeName,
           Supplier: updatedCoffee.Supplier,
           Cetegory: updatedCoffee.Cetegory,
           Chef: updatedCoffee.Chef,
           taste: updatedCoffee.taste,
           Details: updatedCoffee.Details,
           Photo: updatedCoffee.Photo
        },
      };
      const result = await database.updateOne(query, updateDoc, options);
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await database.findOne(query)
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await database.insertOne(newCoffee)
      res.send(result)
    });

    app.delete('/coffee/:id', async (req, res) => {
      console.log(req.body)
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query)
      res.send(result)
    })

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`App listening on port${port}`)
})