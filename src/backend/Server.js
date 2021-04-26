const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/portfolioTracker', { useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("mongo running");
})

const portfolioRouter = require('./routes/Portfolio')
app.use('/Portfolio', portfolioRouter);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
