const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.20wup.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send('Welcome to eMarket');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("eStore").collection("products");
    const ordersCollection = client.db("eStore").collection("orders");

    app.get('/products', (req, res) => {
        console.log(req.body);
        productsCollection.find({})
        .toArray((err, items) => res.send(items))
      })
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productsCollection.insertOne(newProduct)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        ordersCollection.insertOne(order)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })