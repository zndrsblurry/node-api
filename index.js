const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/products', productRoute);

app.get('/', (req, res) => {
  res.send('Hello from Node API Server');
});

mongoose
  .connect(
    'mongodb+srv://unabiazander:C08D94e3RQ8zrMqi@nosqldb.mjlh34n.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NoSQLDB',
  )
  .then(() => {
    console.log('Connected to DB');
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  })
  .catch(() => {
    console.log('Connection failed');
  });
