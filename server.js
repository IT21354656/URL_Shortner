require('dotenv').config()
const express = require('express')
const mongoose= require('mongoose')

//express app
const app = express();


//middleware
app.use(express.json())//to add json to the 'req' Object

app.use((req, res,next)=>{
    console.log(req.path, req.method)
    next()
})

const bodyParser = require('body-parser')
const cors = require('cors')
 
app.use(bodyParser.json());
app.use(cors());


//connect to DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {

    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('Connected to db & listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 

  // module.exports = app;

const ShortUrl = require('./models/shortUrl')


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
