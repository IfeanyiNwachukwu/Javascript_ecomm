const express = require('express');

const multer = require('multer');

const {handleErrors,requireAuth}  = require('./middlewares')
const productsRepo = require('../../repositories/products');
const newProductsTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const {requireTitle,requirePrice} = require('./validators');

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});



router.get('/admin/products',requireAuth, async (req,res) => {
    if(req.session.userId){
        return res.redirect('/signin');
    }
    const products = await productsRepo.GetAll();
    res.send(productsIndexTemplate({products}));
});

router.get('/admin/products/new',requireAuth, (req,res) => {
    if(req.session.userId){
        return res.redirect('/signin');
    }
    res.send(newProductsTemplate({}));
});



router.post('/admin/products/new',requireAuth,upload.single('image'),[requireTitle,requirePrice],
handleErrors(newProductsTemplate),
 async(req,res) => {
    if(req.session.userId){
        return res.redirect('/signin');
    }
   
    const image = req.file.buffer.toString('base64');
    const {title,price} = req.body;
    await productsRepo.Create({title,price,image});
    
    res.redirect('/admin/products')


})


//Note Base64 string can safely retain an image as a string
module.exports = router;