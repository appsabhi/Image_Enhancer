const express = require("express")

const routes= require("./Routes/routes")

const app  = express();
app.use(express.static("public"))
app.set("views","Views")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/",routes)

app.listen('5000',()=>{
console.log(`app is running on ${5000}`)
})