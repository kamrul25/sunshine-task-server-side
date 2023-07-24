const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//connect mongoDB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sunshinecluster.2tjkdbc.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const allJobInfo = client
      .db(`${process.env.DB_USER}`)
      .collection("allJobInfo");
    const topBdItCompanies = client
      .db(`${process.env.DB_USER}`)
      .collection("topBdItCompanies");
    const topITCompanies = client
      .db(`${process.env.DB_USER}`)
      .collection("topITCompanies");

    app.get("/jobs/:type", async (req, res) => {
      const type = req.params.type;
      if (type === "Fresher") {
        const result = await allJobInfo.find({ type: "Fresher" }).toArray();
        res.json(result);
      } else {
        const result = await allJobInfo.find({ type: "Experienced" }).toArray();
        res.json(result);
      }
    });

    app.post("/jobs", async (req, res) => {
      const data = req.body;
      const result = await allJobInfo.insertOne(data);
      res.json(result);
    });

    app.get("/topBD", async (req, res) => {
      const result = await topBdItCompanies.find({}).toArray();
      res.json(result);
    });
    app.get("/topWorld", async (req, res) => {
      const result = await topITCompanies.find({}).toArray();
      res.json(result);
    });

    // Send a ping to confirm a successful connection
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

app.get("/", (req, res) => {
  res.json("Server is running");
});

app.listen(port, () => {
  console.log("Sunshine job portal server is running");
});
