const express = require('express')
const cors = require('cors');
const app= express();
require('dotenv').config();
const port = process.env.PORT || 4000; 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })



//   const uri = "mongodb://localhost:27017"; 
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.xygzlb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("art&craftDB");
    const itemCollection = database.collection("items");

    app.post('/items', async (req, res)=>{
      const user = req.body;
      console.log(user, "from server")
      const result = await itemCollection.insertOne(user);
      res.send(result);

    });

    app.get('/items', async(req, res)=>{
      const cursor = itemCollection.find()
      const result= await cursor.toArray();
      res.send(result)
    })

    app.get('/items/:id', async(req, res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)};
      const result= await itemCollection.findOne(query);
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