const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnlgi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


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
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.get('/coffee', async(req, res) => {
     const cursor = coffeeCollection.find();
     const result = await cursor.toArray();
     res.send(result);
    })

    // update operation
    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async(req, res) =>{
     const newCoffee = req.body;
     console.log(newCoffee)
     const result = await coffeeCollection.insertOne(newCoffee);
     res.send(result);
    })

    // This is a Update operation
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffeeData = req.body;
    
      const updatedCoffee = {
        $set: {
          name: coffeeData.name,
          quantity: coffeeData.quantity,
          supplier: coffeeData.supplier,
          taste: coffeeData.taste,
          category: coffeeData.category,
          details: coffeeData.details,
          photo: coffeeData.photo,
        },
      };
    
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
      res.send(result); // Send the result back to the client
    });
    

    // This is a Delete operation
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
 res.send('Coffee making server is running')
})

app.listen(port, () => {
 console.log(`Coffee Server is running on port: ${port}`)
})