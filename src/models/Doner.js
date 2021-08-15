const mongoose=require('mongoose');

const donerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobileno:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    bloodgroup:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
})

const Doners=new mongoose.model('Doners',donerSchema)

module.exports=Doners
