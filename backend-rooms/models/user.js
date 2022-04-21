const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const usersModel=mongoose.model('users',userSchema);

module.exports =usersModel;

user = [
  {
    id: 1,
    name: "Kurtis Weissnat",
    email: "kw@gmail.com",
    password: "123456",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Hassan",
    email: "hassan@gmail.com",
    password: "123456",
    isAdmin: false,
  },
  {
    id: 3,
    name: "Adam",
    email: "adam@gmail.com",
    password: "123456",
    isAdmin: false,
  },
];


