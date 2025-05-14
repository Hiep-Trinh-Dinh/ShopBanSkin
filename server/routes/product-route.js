const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload-middleware');

const { 
    createProduct, 
    fetchAllProducts, 
    fetchDetailProduct, 
    editProduct,
    deleteProduct
} = require('../controllers/product-controller'); 
const adminMiddleware = require('../middlewares/admin-middleware');

router.post('/create', uploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]) , createProduct)
router.get('/fetch-all', fetchAllProducts)
router.get('/fetch-detail/:id', fetchDetailProduct)
router.put('/edit/:id', uploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), editProduct)
router.delete('/delete/:id', deleteProduct)

module.exports = router;