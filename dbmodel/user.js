const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt")
let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[isEmail,"email does not exist"]
    },
    password:{
        type:String,
        minlength:[6,"password should be more than 6 characters "]
    },
     courses:{
        type:String
    }
})


    


//pre save function
userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    console.log("about to save" +this)
    next()
})

//post save function
userSchema.post("save",async function(doc,next){
    console.log("saved" , doc)
    next()
})

//login compare details
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };


const user = mongoose.model("user",userSchema);

module.exports = user