const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()
const port=process.env.PORT || 3000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tefm3zp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database=client.db('iboss');
const productCollection=database.collection('productCollection');
const cartCollection=database.collection('cartCollection');

app.get('/products', async(req,res)=>{
 const query=req.body;
  const result=await productCollection.find(query).toArray();
  console.log(query);
  res.send(result)
})

app.post('/carts', async(req,res)=>{
 const data=req.body
 const result= await cartCollection.insertOne(data);
  res.send(result) 
})

app.get('/carts/:email',async(req,res)=>{
 const email=req.params.email;
 const result=await cartCollection.find({userEmail: email}).toArray()
 res.send(result)
 })
 app.delete('/carts/:id', async (req, res) => {
  const cartId = req.params.id;

  try {
    const result = await cartCollection.deleteOne({ _id: new ObjectId(cartId) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Cart item not found' });
    }

    res.send({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})