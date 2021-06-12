const express = require('express');
const CartsRepository = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');
const router = express.Router();

// Receive a post request to an add an item to the cart

router.post('/cart/products', async (req,res) => {

    let cart;
    if(!req.session.cartId){
        cart = await CartsRepository.Create({items : []});
        req.session.cartId = cart.Id;

    }
    else{
        cart = await CartsRepository.GetOne(req.session.cartId);
    }

    console.log(req.session.cartId);

    const existingItem =  cart.items.find(item => item.productId == req.body.productId);

    if(existingItem){
        existingItem.quantity++;
    }
    else{
        cart.items.push({productId : req.body.productId, quantity : 1});
    }
    console.log(req.body.productId)
    await CartsRepository.Update(cart.Id, {items: cart.items});
    res.redirect('/cart');

});



// Receive a Get request to show all items in the cart
router.get('/cart', async (req,res) => {
    if(!req.session.cartId){
       return  res.redirect('/');
    }

    console.log(`session ${req.session.cartId}`);
    const cart = await CartsRepository.GetOne(req.session.cartId);
  
    
    for (let item of cart.items) {
        
        const product = await productsRepo.GetOne(item.productId);
    
         item.product = product;  // assigning a new property called product to the object
      }
     
      res.send(cartShowTemplate({ items: cart.items }));
     
});
// Receive a post request to delete an item from the cart
router.post('/cart/products/delete',async (req,res) => {
   const {itemId} = req.body;
   const cart = await CartsRepository.GetOne(req.session.cartId)

   const items = cart.items.filter(item => item.productId !== itemId);

   await CartsRepository.Update(req.session.cartId,{items});
   res.redirect('/cart');
});









module.exports = router;