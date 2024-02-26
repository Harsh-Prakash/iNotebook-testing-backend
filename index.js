const connectToMongo=require("./db")
require('dotenv').config()
const express = require('express')
var cors = require('cors');
const app = express()
app.use(cors({origin:"https://inotebook-harshprakash.vercel.app"}));
app.use(express.json());
const port = 5000
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.get('/test',(req,res)=>{
  res.send("Testing Mode")
})

app.listen(process.env.PORT, () => {
  console.log(`iNoteBook Backend listening on port ${process.env.PORT}`)
})
connectToMongo();
