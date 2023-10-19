const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2vdoex.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const productCollection = client.db("productDB").collection("products");
    const cartCollection = client.db("productDB").collection("carts");

    // post method endpoint
    app.post('/products', async(req, res) =>{
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // post method add to cart endpoint
    app.post('/cart', async(req, res) =>{
      const cartProduct = req.body;
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result);
    })


    // get all method endpoint
    app.get('/products', async(req, res)=>{
      const result = await productCollection.find().toArray();
      res.send(result);
    })
    // get single data method endpoint
    app.get('/productDetails/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}; 
      const data = req.body;
      const result = await productCollection.findOne(query, data).toArray();
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
  res.send('crud is running...');
})

app.listen(port, (req, res)=> {
  console.log(`crud server is running on port: ${port}`);
})