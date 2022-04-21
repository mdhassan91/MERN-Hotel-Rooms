const express = require("express");
const router = express.Router();
const Joi = require("joi");
let User = require("../models/user");

router.get("/register", function (req, res) {
  res.send(user);
});
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/register", async function (req, res) {
  const newUser=new User(req.body);

  try {
    const user = await newUser.save()
    res.send(user);

    
  } catch (error) {
    return res.status(400).json({message:error});
  }


});

// router.post("/register", (req, res) => {
//   console.log(req.body);
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).send(error.details[0].message);
//   }
//   console.log();

//   const userData = {
//     id: user.length + 1,
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     isAdmin: false,
//   };
//   user.push(userData);
//   res.send(userData);
// });


// router.post("/login" ,(req,res)=>{
// const {email,password} = req.body;
// try {
//   const userData=user.find((user)=>{
//     if((user.email === email) && (user.password === password)){
//       return user;
//          }
//   }
// );
//   if(userData){
//     const temp={
//       id: userData.id,
//       name: userData.name,
//       email: userData.email,
//       isAdmin: userData.isAdmin,
//     }
//     res.send(temp);
//   }
//   else{
//     return res.status(404).json({message:"Login Failed"})
//   }


// } catch (error) {
//   return res.status(404).json({error})
// }


// })

router.post('/login',async (req,res)=>{
  const {email,password} = req.body;
  

  try {
    const user=await User.findOne({email: email, password: password});
    if(user){
      const temp={
              id: user.id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
            }
            res.send(temp);
    }
    else{
      return res.status(404).json({message:"Login Failed"})
    }
  
  } catch (error) {
    return res.status(400).json({message:error});
  }





})






module.exports = router;
