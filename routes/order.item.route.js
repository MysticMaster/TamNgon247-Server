const express = require('express');
const router = express.Router();
const OrderItem = require('../models/order.item.model');

router.get('/', async (req, res) => {
    try {
        const orderItems = await OrderItem.find();

        res.status(200).send(orderItems);

    } catch (error) {
        console.error('Error select orderItems: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const orderItems = await OrderItem.find({}).skip(startIndex).limit(pageSize).sort({orderItem_name: -1});

        const totalOrderItem = await OrderItem.countDocuments({});
        const totalPages = Math.ceil(totalOrderItem / pageSize);

        res.status(200).send({
            data: orderItems,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalOrderItem: totalOrderItem
        });
    } catch (error) {
        console.error('Error get employee: ', error);
        res.status(500).send([]);
    }
});

router.get('/id/:_id', async (req, res) => {
    try {
        const orderItem = await OrderItem.findOne({_id: req.params._id});

        if (!orderItem) {
            return res.status(404).send(null);
        }
        res.status(200).send(orderItem);

    } catch (error) {
        console.error('Error select orderItem: ', error);
        res.status(500).send(null);
    }
});

router.get('/order/:_id', async (req, res) => {
    try {
        const orderItems = await OrderItem.find({_id_order: req.params._id});

        res.status(200).send(orderItems);

    } catch (error) {
        console.error('Error select orderItems: ', error);
        res.status(500).send([]);
    }
});

router.post('/', async (req, res) => {
    try {
        const newOrderItem = await OrderItem.create(req.body);

        if (!newOrderItem) {
            return res.status(400).send(false);
        }

        res.status(201).send(true);

    } catch (error) {
        console.error('Error insert orderItem: ', error);
        res.status(500).send(false);
    }
});

router.put('/:_id', async (req, res) => {
    try {
        const updateOrderItem = await OrderItem.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true});

        if (!updateOrderItem) {
            return res.status(400).send(false);
        }

        res.status(201).send(true);

    } catch (error) {
        console.error('Error update orderItem: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;