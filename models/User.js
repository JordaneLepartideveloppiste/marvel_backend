const mongoose = require("mongoose");
const { isEmail } = require("validator");

const User = mongoose.model("User", {
  pseudo: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 55,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    lowercase: true,
    unique: true,
    trim: true,
  },
  profil_pic: {
    type: String,
    //default: "",
  },
  token: String,
  hash: String,
  salt: String,
  favoritesHeroes: [String],
  favoritesComics: [String],
});

module.exports = User;
