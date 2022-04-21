const express = require("express");
const router = express.Router();
const Joi = require("joi");
const moment = require("moment");
let Booking = require("../models/booking");
let Rooms = require("../models/room");
const stripe = require("stripe")(
  "sk_test_51Kl9sVSANuXunhxKpABA2PWdEgLNTNZedb5T0G3jutIsPOq6QYeQAhqEQTD27Ghhdx4st3bCW3CXHQdDyzNoZtuu00naxJQKpE"
);
const { v4: uuidv4 } = require("uuid");

router.get("/bookroom", function (req, res) {
  res.send(Booking);
});
router.get("/getAllBookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});

    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/bookroom", async (req, res) => {
  const { userId, fromDate, toDate, totalAmount, totalDays, room, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
      currency: "inr",
      receipt_email: token.email,
    });
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
console.log(customer);
console.log(payment);
    if (payment) {
      const bookRoomData = {
        room: room.name,
        roomId: room._id,
        userId: userId,
        fromDate: fromDate,
        toDate: toDate,
        totalAmount: totalAmount,
        totalDays: totalDays,
        transactionId: "1234",
        status: true,
      };
      const newBooking = new Booking(bookRoomData);
      const booking = await newBooking.save();
      const tempBook = await Rooms.findOne({ _id: room._id });
      const pushBookData = {
        bookingId: booking._id,
        userId: userId,
        fromDate: fromDate,
        toDate: toDate,

        status: booking.status,
      };

      tempBook.currentbookings.push(pushBookData);
      await tempBook.save();
      // console.log(tempBook);
      // res.send(booking);
    }

    res.send("Payment Successful,Your room booked");
  } catch (error) {
    return res.status(404).json({ error });
  }

  // try {
  //   const bookRoomData = {
  //             room: room.name,
  //             roomId: room._id,
  //             userId: userId,
  //             fromDate: (fromDate),
  //             toDate: (toDate),
  //             totalAmount: totalAmount,
  //             totalDays: totalDays,
  //             transactionId: "1234",
  //             status: true,
  //           };
  //           const newBooking = new Booking(bookRoomData);
  //           const booking = await newBooking.save();
  //           const tempBook = await Rooms.findOne({ _id: room._id });
  //           const pushBookData = {
  //             bookingId: booking._id,
  //             userId: userId,
  //             fromDate: (fromDate),
  //             toDate: (toDate),

  //             status: booking.status,
  //           };

  //           tempBook.currentbookings.push(pushBookData);
  //           await tempBook.save();
  //           res.send(booking);
  // } catch (error) {
  //   return res.status(404).json({  error});
  // }
});

// router.post("/bookroom", async (req, res) => {
//   console.log(req.body);

//   const { userId, fromDate, toDate, totalAmount, totalDays, room } = req.body;

//   console.log();

//   const bookRoomData = {
//     bookid: Booking.length + 1,
//     room: room.name,
//     roomId: room.roomId,
//     userId: userId,
//     fromDate: fromDate,
//     toDate: toDate,
//     totalAmount: totalAmount,
//     totalDays: totalDays,
//     transactionId: "1234",
//     status: true,
//   };
//   Booking.push(bookRoomData);

//   const tempBook = rooms.find((room) => room.roomId === room.roomId);
//   const pushBookData = {
//     BookingId: Booking.id,
//     userId: userId,
//     fromDate: fromDate,
//     toDate: toDate,

//     status: true,
//   };

//   tempBook.currentBooking.push(pushBookData);
//   const res1 = await axios.put(
//     `http://localhost:8000/api/rooms/getAllRooms/${room.roomId}`,
//     tempBook
//   );
//   res.send(bookRoomData);
// });
router.post("/getBookingbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const booking = await Booking.find({ userId: userid });
    res.send(booking);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Failed" });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingId, roomId } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingId });
    bookingItem.status = false;
    await bookingItem.save();

    const room = await Rooms.findOne({ _id: roomId });
    console.log(room);
    const bookedRoom = room.currentbookings;
    console.log(bookedRoom);
    const temp = bookedRoom.filter(
      (booked) => booked.bookingId.toString() !== bookingId
    );
    room.currentbookings = temp;
    await room.save();

    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Failed" });
  }
});

module.exports = router;
