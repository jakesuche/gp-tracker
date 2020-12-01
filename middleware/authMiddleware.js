const jwt = require("jsonwebtoken");

const requireAuth = (req,res,next)=>{
  const token = req.cookies.jwt;

  if(token){
   jwt.verify(token,"secret",(err,decodedtoken)=>{
     if(err){
       console.log(err.message);
       res.redirect(303,"/login");
       next;
     }else{
      // console.log(decodedtoken);
      req.userId = decodedtoken.id
       next();
     }
   })
  }else{
    res.redirect(303,"/login")
  }
}

const permit = (req,res,next)=>{
  const token = req.cookies.jwt
  if(token){
     return res.redirect(303,"/main")
     
   }
   return next()
}

module.exports = {requireAuth,permit}