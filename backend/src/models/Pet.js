const mongoose = require("../database/connection");
const { Schema } = mongoose;

const petSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    pictures: {
      type: Array,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
    user: Object,
    adopter: Object,
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
