const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');

const {initializeApp} = require('firebase/app');
const {getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject} = require('firebase/storage');
const multer = require('multer');
const config = require('../config/firebase.config');
const {v4} = require('uuid');
const Category = require("../models/category.model");

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.status(200).send(admins);
    } catch (error) {
        console.error('Error get admin: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const admins = await Admin.find({}).skip(startIndex).limit(pageSize).sort({fullname: -1});

        const totalAdmins = await Admin.countDocuments({});
        const totalPages = Math.ceil(totalAdmins / pageSize);

        res.status(200).send({
            data: admins,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalAdmins: totalAdmins
        });
    } catch (error) {
        console.error('Error get admin: ', error);
        res.status(500).send(null);
    }
});

router.get('/id/:_id', async (req, res) => {
    try {
        const admin = await Admin.findOne({_id: req.params._id});

        if (!admin) {
            return res.status(404).send(null);
        }

        res.status(200).send(admin);

    } catch (error) {
        console.error('Error finding admin: ', error);
        res.status(500).send(null);
    }
});

router.post('/', upload.single('filename') , async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(false);
        }

        const {
            full_name,
            username,
            password,
            status
        } = req.body

        let image_path = "", image_url = "";

        if (req.file) {
            try {
                const path = `AVT-${v4()}`;
                const storageRef = ref(storage, `admins/${path}`);
                const metadata = {
                    contentType: req.file.mimetype
                }
                const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
                const downloadURL = await getDownloadURL(snapshot.ref);

                image_path = path;
                image_url = downloadURL;

                console.log('File succesfully uploaded');
            } catch (error) {
                console.error('Error upload file: ', error);
            }
        }

        const newAdmin = new Admin({
            full_name: full_name,
            username: username,
            password: password,
            image_path:image_path,
            image_url:image_url,
            status: status
        })

        try {
            await newAdmin.save()
            res.status(201).send(true);
        } catch (error) {
            console.error('Error saving admin: ', error);
            res.status(400).send(false);
        }
    } catch (error) {
        console.error('Failed server connect: ', error);
        res.status(500).send(false);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await Admin.findOne({username: username});

        if (!user) {
            return res.status(404).send(null);
        }

        const admin = await Admin.findOne({username: username, password: password});
        if (!admin) {
            return res.status(400).send(null);
        }
        res.status(200).send(admin);

    } catch (error) {
        console.error('Error register: ', error);
        res.status(500).send(null);
    }
});

router.put('/:_id', async (req, res) => {
    try {
        const updateAdmin = await Admin.findOneAndUpdate(
            {_id: req.params._id},
            req.body,
            {new: true});

        if (!updateAdmin) {
            return res.status(404).send(false);
        }
        res.status(201).send(true);
    } catch (error) {
        console.error('Error update admin: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;