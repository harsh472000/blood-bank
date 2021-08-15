const express=require('express')
const path=require('path')
const dotenv=require('dotenv')
const cors=require('cors')
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser')
//const hbs=require('hbs')
const ejs=require('ejs')
require('./db/conn.js')
const Doner = require('./models/Doner')
const Contact = require('./models/Contact')
const { executionAsyncResource, executionAsyncId } = require('async_hooks')


dotenv.config({ path:'./config/config.env'})
const app=express()
const static_path=path.join(__dirname,'../public')
const template_path=path.join(__dirname,'../templates/views')
const partials_path=path.join(__dirname,'../templates/partials')



app.use(express.static(static_path))
app.use(express.json())
app.use(cors())

//chatbot//

const sessionId = uuid.v4();
app.use(bodyParser.urlencoded({extended:false}))

//chat bot end

app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.set('views',template_path)
//ejs.registerPartials(partials_path)

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/Aboutus',(req,res)=>{
    res.render('Aboutus')
})

app.get('/Whydonate',(req,res)=>{
    res.render('Whydonate')
})

app.get('/DoneteBlood',(req,res)=>{
    res.render('DoneteBlood')
})

app.get('/NeedBlood',(req,res)=>{
    Doner.find()
    .then((result)=>{
        res.render('NeedBlood',{doners:result})
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

app.post('/NeedBlood',async(req,res)=>{
    //bloodgroup:req.body.bloodgroup;
    const task=await Doner.find({bloodgroup:req.body.bloodgroup})
    .then((result)=>{
        res.render('NeedBlood',{doners:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.post('/DoneteBlood',async(req,res)=>{
    const userDoner = new Doner({
        name:req.body.name,
        mobileno:req.body.mobileno,
        email:req.body.email,
        address:req.body.address,
        state:req.body.state,
        bloodgroup:req.body.bloodgroup,
        gender:req.body.gender,
        age:req.body.age
    })

    const donered=await userDoner.save()
    console.log(donered)
    res.redirect('/')
    // console.log(req.body)
})

app.get('/contactus',(req,res)=>{
    res.render('contactus')
})
app.post('/contactus',async(req,res)=>{
    const userContact=new Contact({
        name:req.body.name,
        mobileno:req.body.mobileno,
        email:req.body.email,
        message:req.body.message
    })

    const contactus=await userContact.save()
    console.log(contactus)
    //alert('message sent successfully');
    res.redirect('/')
})

app.get('/camplocation',(req,res)=>{
    res.render('camplocation')
})

app.get('/addlocation',(req,res)=>{
    res.render('addlocation')
})

app.use('/api/v1/stores',require('./routers/stores'))


/*chat bot start*/
app.get('/bot',(req,res)=>{
    res.render('bot')
})
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTION,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials',true)
  
    next()
  })
  app.post('/send-msg',(req,res)=>{
      runSample(req.body.MSG).then(data=>{
        res.send({Reply:data})
      })
  })
  
  /**
   * Send a query to the dialogflow agent, and return the query result.
   * @param {string} projectId The project to be used
   */
  async function runSample(msg,projectId = 'rakt-bot-wyf9') {
    // A unique identifier for the given session
    
  
    // Create a new session
    //const sessionClient = new dialogflow.SessionsClient({keyFilename:'rakt-bot-wyf9-7859e83047b7.json'});
    const sessionClient = new dialogflow.SessionsClient({keyFilename:'./public/rakt-bot-wyf9-7859e83047b7.json'});
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
  
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: msg,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };
  
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    //console.log('Detected intent');
    const result = responses[0].queryResult;
    //console.log(`  Query: ${result.queryText}`);
    //console.log(`  Response: ${result.fulfillmentText}`);
    /*if (result.intent) {
      //console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      //console.log('  No intent matched.');
    }*/
    return result.fulfillmentText
  }

  /*chat bot end*/

app.listen(3000,()=>{
    console.log('server running on port number 3000')
})