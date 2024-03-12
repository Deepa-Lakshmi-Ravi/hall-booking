const express = require("express");

const PORT = 3000;
const app = express();

app.use(express.json());
//rooms collection
let rooms = [
  {
    name: "Standard",
    seats: "200",
    price: "2000",
    amenities: "wifi,non-ac,screen with projector",
    roomID: "101",
    bookedDetails: [
      {
        customerName: "Deepa",
        bookedDate: new Date("2023-11-20"),
        startTime: "2023-11-20T08:30",
        endTime: "2023-11-20T11:30",
        status: "confirmed",
        roomID: "101",
      },
    ],
  },
  {
    name: "Elite",
    seats: "350",
    price: "3000",
    amenities: "wifi,ac,screen with projector",
    roomID: "102",
    bookedDetails: [
      {
        customerName: "Karthik",
        bookedDate: new Date("2023-11-25"),
        startTime: "2023-11-25T15:30",
        endTime: "2023-11-25T17:30",
        status: "confirmed",
        roomID: "102",
      },
    ],
  },
  {
    name: "Premium",
    seats: "450",
    price: "4000",
    amenities: "wifi,ac,screen with projector",
    roomID: "103",
    bookedDetails: [
      {
        customerName: "Sajeev",
        bookedDate: new Date("2023-12-25"),
        startTime: "2023-12-25T20:30",
        endTime: "2023-12-25T22:30",
        status: "Payment_Pending",
        roomID: "103",
      },
    ],
  },
  {
    name: "Standard",
    seats: "550",
    price: "5000",
    amenities: "wifi,ac",
    roomID: "104",
    bookedDetails: [
      {
        customerName: "Keerthika",
        bookedDate: new Date("2024-01-02"),
        startTime: "2024-01-02T20:30",
        endTime: "2024-01-02T22:30",
        status: "Payment_Pending",
        roomID: "104",
      },
    ],
  },
];

app.get("/", (req, res) => {
  res.send({
    message: "Server Running!",
  });
});
app.get("/rooms/all", (req, res) => {
  res.status(200).json({ RoomsList: rooms });
  console.log(rooms);
});
//create a Room
app.post("/createRoom", (req, res) => {
  const { name, seats, price, amenities, roomID, bookedDetails } = req.body;
  rooms.push([
    {
      name,
      seats,
      price,
      amenities,
      roomID,
      bookedDetails,
    },
  ]);
  res.send("Room Created");
});
//booking room
app.post("/bookRoom", (req, res) => {
  let { customerName, bookedDate, startTime, endTime, status, roomID } =
    req.body;

  let startTS = Date.parse(startTime);
  let endTS = Date.parse(endTime);

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].roomID === roomID) {
      let isBooked = rooms[i].bookedDetails.some((booking) => {
        let startBookedTS = Date.parse(booking.startTime);
        let endBookedTS = Date.parse(booking.endTime);

        return (
          (startTS >= startBookedTS && startTS < endBookedTS) ||
          (endTS > startBookedTS && endTS <= endBookedTS) ||
          (startTS <= startBookedTS && endTS >= endBookedTS)
        );
      });

      if (!isBooked) {
        let tobeBooked = {
          customerName,
          bookedDate,
          startTime,
          endTime,
          status,
          roomID,
        };
        rooms[i].bookedDetails.push(tobeBooked);
        return res.status(200).send({ message: "Booking confirmed", rooms });
      } else {
        return res.status(400).send({
          message: "Already booked Room,Please Select Different Time slot",
        });
      }
    }
  }

  return res.status(404).send({ message: "Room not found" });
});

//list all rooms with booked data
app.get("/listRooms", (req, res) => {
  res.send(rooms);
});

//list all customers with booked data(room name included)
app.get("/listCustomers", (req, res) => {
  const customers = rooms.map((room) => {
    return [...room.bookedDetails, { RoomName: room.name }];
  });
  res.send(customers);
});
app.listen(PORT, () => console.log("Server Started"));
