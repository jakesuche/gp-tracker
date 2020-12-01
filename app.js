const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const route  = require("./routes/route")

app.set("view engine","ejs")
app.use(bodyParser())

app.use(express.static("public"))
app.use(express.json())

//mongodb connection
let db = "mongodb://localhost:27017/GPT"
mongoose.connect(db,{useNewUrlParser:true ,useUnifiedTopology:true , useCreateIndex:true})
.then(()=>{
    console.log("mongodb connnect")
})


//home page
app.get("/",(req,res)=>{
  res.render("index")
})

//other routes
app.use(route)

app.listen(3000,console.log("server connected"))

 