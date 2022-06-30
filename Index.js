const express = require('express');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

async function run() {



}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Task is running")
});



app.listen(port, () => {
    console.log("Listening to port", port);
})