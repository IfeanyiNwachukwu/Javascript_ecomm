const express = require('express');

const multer = require('multer');

const {handleErrors}  = require('./middlewares')
const productsRepo = require('../../repositories/products');
const newProductsTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const {requireTitle,requirePrice} = require('./validators');

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});






router.get('/admin/products',async (req,res) => {
    const products = await productsRepo.GetAll();
    res.send(productsIndexTemplate({products}));
});

router.get('/admin/products/new',(req,res) => {
    res.send(newProductsTemplate({}));
});



router.post('/admin/products/new',upload.single('image'),[requireTitle,requirePrice],
handleErrors(newProductsTemplate),
 async(req,res) => {
   
    const image = req.file.buffer.toString('base64');
    const {title,price} = req.body;
    await productsRepo.Create({title,price,image});
    
    res.redirect('/admin/products')


})


//Note Base64 string can safely retain an image as a string
module.exports = router;