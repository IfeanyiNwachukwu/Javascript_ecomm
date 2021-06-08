const express = require('express');

const multer = require('multer');

const {handleErrors,requireAuth}  = require('./middlewares')
const productsRepo = require('../../repositories/products');
const newProductsTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate =  require('../../views/admin/products/edit')
const {requireTitle,requirePrice} = require('./validators');

// const router = express.Router();
const router = express.Router({ mergeParams: true });
const upload = multer({storage: multer.memoryStorage()});



router.get('/admin/products',requireAuth, async (req,res) => {
   
    const products = await productsRepo.GetAll();
    res.send(productsIndexTemplate({products}));
});

router.get('/admin/products/new',requireAuth, (req,res) => {
    
    res.send(newProductsTemplate({}));
});



router.post('/admin/products/new',requireAuth,upload.single('image'),[requireTitle,requirePrice],
handleErrors(newProductsTemplate),
 async(req,res) => {
   
   
    const image = req.file.buffer.toString('base64');
    const {title,price} = req.body;
    await productsRepo.Create({title,price,image});
    
    res.redirect('/admin/products')


})

router.get('/admin/products/:id/edit',requireAuth, async (req,res) => {
    
    const product = await productsRepo.GetOne(req.params.id);
    if(!product){
        res.send('product not found');
    }

    res.send(productsEditTemplate({product}));
   
});

router.post('/admin/products/:id/edit',requireAuth,
upload.single('image'),
[requireTitle,requirePrice],
handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.GetOne(req.params.id);  // we put this code here because of the req.params.id
    return {product};
}),
async (req,res) => {
    const changes = req.body;
    if(req.file){
        changes.image = req.file.buffer.toString('base64');
    }
    try {
        await productsRepo.Update(req.params.id,changes);
    } catch (error) {
        return res.send('could not find item');
    }
    res.redirect('/admin/products');
   
});

router.post('/admin/products/:id/delete',requireAuth, async(req,res) => {
    await productsRepo.Delete(req.params.id);
    res.redirect('/admin/products');
})



//Note Base64 string can safely retain an image as a string
module.exports = router;