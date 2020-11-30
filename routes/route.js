let { Router } = require("express");
let app = Router();
const {requireAuth,permit} = require("../middleware/authmiddleware")
let controllers = require("../controllers/authController")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser())
app.use(cookieParser())

app.get("/signup", controllers.signup_get)
app.post("/signup", controllers.signup_post)
app.get("/login",permit,controllers.login_get)
app.post("/login",controllers.login_post)

app.get("/main",requireAuth,controllers.main)
app.post("/mains",controllers.addData)


app.get("/logout",controllers.logout)
module.exports = app