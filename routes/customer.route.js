const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error get customer: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const customers = await Customer.find({}).skip(startIndex).limit(pageSize).sort({fullname: -1});

        const totalCustomers = await Customer.countDocuments({});
        const totalPages = Math.ceil(totalCustomers / pageSize);

        res.status(200).send({
            data: customers,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalCustomers: totalCustomers
        });
    } catch (error) {
        console.error('Error get customer: ', error);
        res.status(500).send(null);
    }
});

router.get('/id/:_id', async (req, res) => {
    try {
        const customer = await Customer.findOne({_id: req.params._id});

        if (!customer) {
            return res.status(404).send(null);
        }

        res.status(200).send(customer);

    } catch (error) {
        console.error('Error finding customer: ', error);
        res.status(500).send(null);
    }
});

router.get('/email/:email', async (req, res) => {
    try {
        const customer = await Customer.findOne({email: req.params.email});
        if (customer) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (error) {
        console.error('Error finding customer: ', error);
        res.status(500).send(false);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);

        if (!newCustomer) {
            return res.status(400).send(false);
        }
        res.status(201).send(true);
    } catch (error) {
        console.error('Error register: ', error);
        res.status(500).send(false);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await Customer.findOne({username: username});

        if (!user) {
            return res.status(404).send( null);
        }

        const customer = await Customer.findOne({username: username, password: password});
        if (!customer) {
            return res.status(400).send(null);
        }
        res.status(200).send(customer);

    } catch (error) {
        console.error('Error register: ', error);
        res.status(500).send(null);
    }
});

router.put('/:_id', async (req, res) => {
    try {
        const updateCustomer = await Customer.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true});

        if (!updateCustomer) {
            return res.status(404).send(false);

        }
        res.status(201).send(true);
    } catch (error) {
        console.error('Error update customer: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;