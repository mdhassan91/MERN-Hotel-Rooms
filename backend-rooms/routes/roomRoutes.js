const express = require("express");
const router = express.Router();
let Rooms = require("../models/room");


router.get("/", (req, res) => {
  res.send("Welcome to demo");
});

router.get("/getAllRooms", async(req, res) => {

try {
  const rooms=await Rooms.find({});

  res.send(rooms);
  
} catch (error) {
  return res.status(400).json({message:error});

}




});

router.get("/getAllRooms/:id",async (req, res) => {
  const { id } = req.params;
  // let roomDataById = Rooms.find((room) => room.roomId === parseInt(id));
  try {
    const room=await Rooms.findOne({_id:id});
  
    res.send(room);
    
  } catch (error) {
    return res.status(400).json({message:error});
  
  }
  

});

router.put("/getAllRooms/:id", (req, res) => {
  const { id } = req.params;
  const roomDataById = Rooms.find((room) => room.roomId === parseInt(id));
  if(!roomDataById) return res.status(404).send('User not found');
  console.log(req.body);

 

  res.send( roomDataById);
});


router.post("/addroom", async function (req, res) {
  const newRoom=new Rooms(req.body);

  try {
    const room= await newRoom.save()
    res.send(room);

    
  } catch (error) {
    return res.status(400).json({message:error});
  }


});


module.exports = router;
