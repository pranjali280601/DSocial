require("dotenv").config();

const express=require('express')
const app=express()

const cors = require("cors")
const path = require("path")

const PORT= process.env.PORT || 5000

const mongoose=require('mongoose')

mongoose.connect(process.env.MONGOURI,{
    
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false

})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})
mongoose.connection.on('error',()=>{
    console.log("err connecting",err)
})
require('./models/user')
require('./models/post')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")))

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT)
})