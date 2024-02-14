/* eslint-disable no-undef */
require('dotenv/config');
const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose');
const cors = require('cors')
const authJwt = require('./helpers/jwt');
const errorhandler = require('./helpers/errorHandler');
const app = express();
const api_url = process.env.API_URL;
app.use(cors());
app.options('*', cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorhandler);

//Routes
const categoriesRouter = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

app.get('/', (req,res) =>{
    res.send('hello API root');
})

app.use(`${api_url}/products`, productsRouter);
app.use(`${api_url}/categories`, categoriesRouter);
app.use(`${api_url}/users`, usersRouter);
app.use(`${api_url}/orders`, ordersRouter);


// Database
mongoose.connect(process.env.CONNECTION_STRING)
.then( () => {
    console.log('connection to mongoDB is ready...');
})
.catch((err) => {
    console.log('connection to mongoDB error', err);
})

//Server
app.listen(3000, () => {
    console.log('Server is runing: http://localhost:3000');
});