const express = require('express')
const Store =require('../models/Store')
const { getStores } = require('../controllers/stores')
const router=express.Router()

router.get('/',async(req,res)=>{
    try{
        const stores = await Store.find();
        res.status(200).json({
            success:true,
            count:stores.length,
            data:stores
        })
    }catch(err){
        console.log(err)
    }
})

router.post('/',async(req,res)=>{
    try{
        const store= await Store.create(req.body)
        res.status(200).json({
            success:true,
            data:store
        })
    }catch(err){
        console.log(err)
        if(err.code===11000)
        {
            res.status(400).json({error:'this store already exist'})
        }
    }
})

module.exports = router