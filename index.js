require('dotenv').config();
const express = require('express');
const app = express();
const { connect } = require('mongoose');

const urlString = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

connect(urlString)
  .then(() => {
    console.log('connected to database..');
    app.listen(port, () => console.log(`listening on port ${port}..`));
  })
  .catch(() => console.log('could not connect to database'));

app.use(express.json());
app.use(require('./middleware/cors'));
app.use('/persons', require('./routes/persons'));
app.use('/products', require('./routes/products'));
app.use(require('./middleware/errorHandler'));

app.get('/', (req, res) => {
  res.send('Home Page!');
});
