const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;

//app.use(cors({credentials: true, origin: 'http://localhost:7000'}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/portfolioTracker', { useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("mongo running");
})

const portfolioRouter = require('./routes/Portfolio')
app.use('/api/Portfolio',cors(), portfolioRouter);
const userRouter = require('./routes/Users');
app.use('/api/user', userRouter);
const newsRouter = require('./routes/News');
app.use('/api/news', newsRouter);
const orderRouter = require('./routes/Orders');
app.use('/api/order', orderRouter);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
