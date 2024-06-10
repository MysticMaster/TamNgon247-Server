const express = require('express');
const router = express.Router();
const Dish = require('../models/dish.model');
const OrderItem = require('../models/order.item.model');

const {initializeApp} = require('firebase/app');
const {getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject} = require('firebase/storage');
const multer = require('multer');
const config = require('../config/firebase.config');
const {v4} = require('uuid');

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find();

        res.status(200).send(dishes);

    } catch (error) {
        console.error('Error select dishes: ', error);
        res.status(500).send([]);
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const dishes = await Dish.find({_id_category: req.params.id});

        res.status(200).send(dishes);

    } catch (error) {
        console.error('Error select dishes: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const dishes = await Dish.find({}).skip(startIndex).limit(pageSize).sort({dish_name: -1});

        const totalDish = await Dish.countDocuments({});
        const totalPages = Math.ceil(totalDish / pageSize);

        res.status(200).send({
            data: dishes,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalDish: totalDish
        });
    } catch (error) {
        console.error('Error get employee: ', error);
        res.status(500).send(null);
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        const dish = await Dish.findOne({_id: req.params.id});
        if (!dish) {
            return res.status(404).send(null);
        }

        res.status(200).send(dish);

    } catch (error) {
        console.error('Error select dish: ', error);
        res.status(500).send(null);
    }
});

router.post('/', upload.single('filename'), async (req, res) => {

    try {
        if (!req.body) {
            return res.status(400).send(false);
        }

        const {
            dish_name,
            _id_category,
            dish_price,
            status
        } = req.body

        let image_path = "", image_url = "";

        if (req.file) {
            try {
                const path = `DIS-${v4()}`;
                const storageRef = ref(storage, `dishes/${path}`);
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

        const newDish = new Dish({
            dish_name: dish_name,
            _id_category: _id_category,
            image_path: image_path,
            image_url: image_url,
            dish_price: dish_price,
            status: status
        })

        try {
            await newDish.save()
            res.status(201).send(true);
        } catch (error) {
            console.error('Error saving dish: ', error);
            res.status(400).send(false);
        }
    } catch (error) {
        console.error('Failed server connect: ', error);
        res.status(500).send(false);
    }
});

router.put('/:id', upload.single('filename'), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(false);
        }

        let {
            dish_name,
            _id_category,
            image_path,
            image_url,
            dish_price,
            status
        } = req.body

        if (req.file) {
            try {

                if (image_path) {
                    try {
                        let oldStorageRef = ref(storage, `dishes/${image_path}`);
                        await deleteObject(oldStorageRef);
                        console.log('Old file deleted succesfully');
                    } catch (error) {
                        console.error('Error deleting old file: ', error);
                    }
                }

                const path = `DIS-${v4()}`;
                const storageRef = ref(storage, `dishes/${path}`);
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

        const updateDish = await Dish.findOneAndUpdate(
            {_id: req.params.id},
            {
                dish_name: dish_name,
                _id_category: _id_category,
                image_path: image_path,
                image_url: image_url,
                dish_price: dish_price,
                status: status
            },
            {new: true});

        if (!updateDish) {
            return res.status(400).send(false);
        }

        res.status(200).send(true);

    } catch (error) {
        console.error('Failed server connect: ', error);
        res.status(500).send(false);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const checkBeforeDelete = await OrderItem.find({_id_dish: req.params.id})
        if (checkBeforeDelete.length > 0) {
            console.log("There are orders related to this dish")
            return res.status(400).send(false);
        }

        const deleteDish = await Dish.findOneAndDelete({_id: req.params.id});

        if (!deleteDish) {
            return res.status(404).send(false);
        }

        if (deleteDish.image_path) {
            try {
                let oldStorageRef = ref(storage, `dishes/${deleteDish.image_path}`);
                await deleteObject(oldStorageRef);
                console.log('Old file deleted succesfully');
            } catch (error) {
                console.error('Error deleting old file: ', error);
            }
        }

        res.status(200).send(true);

    } catch (error) {
        console.error('Error delete dish: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;