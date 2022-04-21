const express = require("express");

const app = express();
var cors = require("cors");
const port = 8000;
const roomsRoutes = require("./routes/roomRoutes");
const userRoute = require("./routes/userRoute");
const bookingRoutes = require("./routes/bookingRoute");
const dbConfig = require("./models/db")
app.use(express.json());
app.use(cors());
app.use("/api/rooms", roomsRoutes);
app.use("/api/users",userRoute);
app.use("/api/booking",bookingRoutes);

app.listen(port, () => console.log(`Server is listening on ${port}`));
