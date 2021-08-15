const mongoose = require('mongoose')

const url='mongodb+srv://harsh47:harsh@3820@cluster0.ueceu.mongodb.net/bloodbank?retryWrites=true&w=majority'
mongoose.connect(url,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(()=>{
    console.log('connection is successful')
})
.catch((e)=>{
    console.log("this is error"+e)
})