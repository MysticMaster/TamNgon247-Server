const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const Dish = require('../models/dish.model');

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
        const categories = await Category.find();

        res.status(200).send(categories);

    } catch (error) {
        console.error('Error select categories: ', error);
        res.status(500).send([]);
    }
});

router.get('/page', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const startIndex = (page - 1) * pageSize;

        const categories = await Category.find({}).skip(startIndex).limit(pageSize).sort({category_name: -1});

        const totalCategory = await Category.countDocuments({});
        const totalPages = Math.ceil(totalCategory / pageSize);

        res.status(200).send({
            data: categories,
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalCategory: totalCategory
        });
    } catch (error) {
        console.error('Error get employee: ', error);
        res.status(500).send(null);
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        const category = await Category.findOne({_id: req.params.id});
        if (!category) {
            return res.status(404).send(null);
        }

        res.status(200).send(category);

    } catch (error) {
        console.error('Error select category: ', error);
        res.status(500).send(null);
    }
});

router.post('/', upload.single('filename'), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(false);
        }

        const {
            category_name,
            status
        } = req.body

        let image_path = "", image_url = "";

        if (req.file) {
            try {
                const path = `CAT-${v4()}`;
                const storageRef = ref(storage, `categories/${path}`);
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

        const newCategory = new Category({
            category_name: category_name,
            image_path: image_path,
            image_url: image_url,
            status: status
        })

        try {
            await newCategory.save()
            res.status(201).send(true);
        } catch (error) {
            console.error('Error saving category: ', error);
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
            category_name,
            image_path,
            image_url,
            status
        } = req.body

        if (req.file) {
            try {
                if (image_path) {
                    try {
                        let oldStorageRef = ref(storage, `categories/${image_path}`);
                        await deleteObject(oldStorageRef);
                        console.log('Old file deleted succesfully');
                    } catch (error) {
                        console.error('Error deleting old file: ', error);
                    }
                }

                const path = `CAT-${v4()}`;
                const storageRef = ref(storage, `categories/${path}`);
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

        const updateCategory = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {
                category_name: category_name,
                image_path: image_path,
                image_url: image_url,
                status: status
            },
            {new: true});

        if (!updateCategory) {
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
        const checkBeforeDelete = await Dish.find({_id_category: req.params.id})
        if (checkBeforeDelete.length > 0) {
            console.log("There are dishes related to this category")
            return res.status(400).send(false);
        }

        const deleteCategory = await Category.findOneAndDelete({_id: req.params.id});

        if (!deleteCategory) {
            return res.status(404).send(false);
        }

        if (deleteCategory.image_path) {
            try {
                let oldStorageRef = ref(storage, `categories/${deleteCategory.image_path}`);
                await deleteObject(oldStorageRef);
                console.log('Old file deleted succesfully');
            } catch (error) {
                console.error('Error deleting old file: ', error);
            }
        }

        res.status(200).send(true);

    } catch (error) {
        console.error('Error delete category: ', error);
        res.status(500).send(false);
    }
});

module.exports = router;