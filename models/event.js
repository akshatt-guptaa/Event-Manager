const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  organizer: String,
  image: String // store image URL or relative path (/uploads/...)
}); 

module.exports = mongoose.model('Event', eventSchema);
