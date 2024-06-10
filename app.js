const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const uri = 'mongodb+srv://TamNgon247Admin:TRstsrmu6VU5yJx4@mydatabase.1lhxbl3.mongodb.net/TamNgon247DB';
const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connect to MongoDB successful');
    } catch (error) {
        console.error('Connect to MongoDB fail: ', error.message);
    }
}
connect();

const AdminRoute = require('./routes/admin.route');
const CategoryRoute = require('./routes/category.route');
const CustomerRoute = require('./routes/customer.route');
const DishRoute = require('./routes/dish.route');
const EmailRoute = require('./routes/email.route');
const OrderRoute = require('./routes/order.route');
const OrderItemRoute = require('./routes/order.item.route');

app.use('/admin', AdminRoute);
app.use('/category', CategoryRoute);
app.use('/customer', CustomerRoute);
app.use('/dish',DishRoute);
app.use('/email', EmailRoute);
app.use('/order', OrderRoute);
app.use('/order-item', OrderItemRoute);

module.exports = app;
