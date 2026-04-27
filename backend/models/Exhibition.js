const mongoose = require("mongoose");

const ExhibitionSchema = new mongoose.Schema({
  url:  String,
  type: { type: String, enum: ["image", "video"], default: "image" },
  name: String
}, { timestamps: true });

module.exports = mongoose.model("Exhibition", ExhibitionSchema);