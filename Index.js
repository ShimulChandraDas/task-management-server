const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//taskManagementDb
//Z6fPEMrBMcmI6Qmz
const uri = `mongodb://${process.env.DB_NAME}:${process.env.SECRET_KEY}@task-management-db-shard-00-00.yxilw.mongodb.net:27017,task-management-db-shard-00-01.yxilw.mongodb.net:27017,task-management-db-shard-00-02.yxilw.mongodb.net:27017/?ssl=true&replicaSet=atlas-w9ubd9-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("database connected");
        const toDosCollection = client.db("all_toDos").collection("toDos");

        // Index all todos
        app.get('/', (req, res) => {
            client.connect(err => {
                toDosCollection.find({}).toArray(function (err, result) {
                    if (!err) {
                        res.send(result)
                    }
                })
            });
        })

        // add new todo
        app.post('/add-todo', (req, res) => {
            const todo = req.body;
            client.connect(err => {
                toDosCollection.insertOne(todo, (err, result) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        res.send(todo);
                    }
                })
            });
        })

        // update todo
        app.put('/todo/:id', (req, res) => {
            const id = req.params.id
            const { name, status } = req.body

            client.connect(err => {
                const newvalues = { $set: { name, status } };
                toDosCollection.updateOne({ _id: new ObjectId(id) }, newvalues, (err, result) => {
                    if (err) throw err;
                    res.status(200).json({
                        code: "success",
                        message: "Todo updated"
                    })
                })
            });
        })

        // delete todo
        app.delete("/todo/:id", (req, res) => {
            const id = req.params.id

            client.connect(err => {
                toDosCollection.deleteOne({ _id: new ObjectId(id) }, (err, obj) => {
                    console.log('err', err);
                    if (!err) {
                        res.status(200).json({
                            code: "success",
                            message: "Todo deleted successfully!"
                        })
                    } else {
                        res.status(200).json({
                            code: "error",
                            message: "Something went wrong during todo delete!"
                        })
                    }

                })
            });
        })
    }
    finally {

    }
}

//Appointment schedule add


run().catch(console.dir);

app.listen(port, () => {
    console.log("Listening to port", port);
})