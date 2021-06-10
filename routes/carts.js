const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// Receive a post request to an add an item to the cart

router.post('/cart/products',async (req,res) => {
   // Figure out the cart!
   let cart;
   if(!req.session.cartId){
       // We don't have a cart, we need to create one,
       // and store the cart id on the req.session.cartId property
       cart = await cartsRepo.Create({items: []});
       req.session.cartId = cart.Id;
       


   }
   else{
       // We have a cart! Lets get it from the repository
       cart = await cartsRepo.GetOne(req.session.cartId);
    //    console.log(`existing cart: ${cart.items}`);

   }
   //Either increment quantity for existing propertu
   const existingItem = cart.items.find(item => item.id === req.body.productId);
   if(existingItem){
       //increment quantity and save cart
       existingItem.quantity++;
    //    console.log(`existing Item : ${existingItem}`);
   }
   else{
       // add new productId to items array
       cart.items.push({productID: req.body.productId, quantity: 1});
   }
   await cartsRepo.Update(cart.Id,{items: cart.items});
   //OR add new product to the items array
   res.send('product added to cart');
})


// Receive a Get request to show all items in the cart


// Receive a post request to delete an item from the cart



module.exports = router;