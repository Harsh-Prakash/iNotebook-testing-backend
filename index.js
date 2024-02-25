const connectToMongo=require("./db")
const express = require('express')
var cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json());
const port = 8000
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook Backend listening on port ${port}`)
})
connectToMongo();