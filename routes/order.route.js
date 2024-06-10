const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).send(orders);

    } catch (error) {
        console.error('Error select orders: ', error);
        res.status(500).send([]);
    }
});

router.get('/customer/:_id', async (req, res) => {
    try {
        const orders = await Order.find({_id_customer: req.params._id});

        res.status(200).send(orders);

    } catch (error) {
        console.error('Error select orders: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const orders = await Order.find({}).skip(startIndex).limit(pageSize).sort({order_name: -1});

        const totalOrder = await Order.countDocuments({});
        const totalPages = Math.ceil(totalOrder / pageSize);

        res.status(200).send({
            data: orders,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalOrder: totalOrder
        });
    } catch (error) {
        console.error('Error get employee: ', error);
        res.status(500).send([]);
    }
});

router.get('/id/:_id', async (req, res) => {
    try {
        const order = await Order.findOne({_id: req.params._id});

        if (!order) {
            return res.status(404).send(null);
        }
        res.status(200).send(order);

    } catch (error) {
        console.error('Error select order: ', error);
        res.status(500).send(null);
    }
});

router.post('/', async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);

        if (!newOrder) {
            return res.status(400).send(false);
        }

        res.status(201).send(true);

    } catch (error) {
        console.error('Error insert order: ', error);
        res.status(500).send(false);
    }
});

router.put('/:_id', async (req, res) => {
    try {
        const updateOrder = await Order.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true});

        if (!updateOrder) {
            return res.status(400).send(false);
        }

        res.status(201).send(true);

    } catch (error) {
        console.error('Error update order: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;