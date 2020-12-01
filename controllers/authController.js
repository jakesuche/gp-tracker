const mongoose = require("mongoose");
const User = require("../dbmodel/user");
const Course = require("../dbmodel/course");
const jwt = require("jsonwebtoken");

function handleError(err) {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //already creeated user

  if (err.code === 11000) {
    console.log(err.message);
    errors["email"] = "user exists";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  //login post
  if (err.message === "incorrect email") {
    errors["email"] = err.message;
  }

  if (err.message === "incorrect password") {
    errors["password"] = err.message;
  }

  return errors;
}

//json web token
const maxAge = 3 * 24 * 3600;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", { expiresIn: maxAge });
};

module.exports.signup_get = (req, res) => {
  res.render("register");
};

//signup process
module.exports.signup_post = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    let user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200);
    return res.json({ user: user.id });
  } catch (error) {
    let err = handleError(error);
    res.status(404);
    res.json({ err });
  }
};

//login get
module.exports.login_get = (req, res) => {
  // const token = req.cookies.jwt;
  //if(token){
  //  res.redirect(303,"/main")
  // }else{
  res.render("login");
  // }
};

//login post
module.exports.login_post = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.login(email, password);
    // const token = createToken(User._id);
    const token = createToken(user._id);
    
    User.findById({ _id: user._id }, function (err, user) {
      if (err) {
        return err;
      } else {
        req.user = user
        res.cookie("jwt", token, { maxAge: maxAge * 1000 });
        res.status(200);
        res.json({ user: user,token });
        
       
      }
    });
    //  res.cookie("jwt",token,{maxAge:maxAge*1000})
    //  res.status(200);
    //  res.json({user:user._id})
  } catch (error) {
    let errors = handleError(error);
    res.status(404).json({ errors });
  }
};

//main page

module.exports.main = (req, res) => {
  console.log(req.cookies.jwt)
  res.render("main");
};

// addding courses to the db  
// the will reference the creator of the course which is user
module.exports.addData = async (req, res) => {
  const { courses, gradePoint } = req.body;

 const course = new Course({
    courses:courses,
    identifier:gradePoint,
    // the creator of the course
    user:req.userId
  })
  console.log(course)

  course.save(function(err){
    if(err){
     return  res.status(422).json({error:'An error occured, Please try later'})
    }else{
      const token = req.cookies.jwt
      jwt.verify(token , "secret", function(err,decoded){
        if(err){
          console.log(err)
        }
        global.userId = decoded.id
        // the couse will be updated on the user data....Note this is an array of courses ....
        // create a course for more understanding 
        User.updateOne({_id:decoded.id},
          {
            $push:{
              courses:{
                courses:courses,
                identifier:gradePoint   
              }
            }
          },
          function(err,result){
            if(err){
              console.log(err)
            }else{
              res.status(200).send({message:'courses added'})
            }
          }
          )
      })
      // console.log('console comming from cookei', req.cookies.jwt)
      // console.log('console comming from req.user', req.userId)
      //  res.json({ course: 'cool' });
    }
  })
  // return res.json({ course: user });
};



//logout
module.exports.logout = (req, res) => {
  // console.log(req.cookies.jwt)
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect(303, "/");
};
