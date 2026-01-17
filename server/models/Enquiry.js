const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    message: { type: String, required: true },
    adminReply: { type: String },
    status: { type: String, enum: ['New', 'Replied'], default: 'New' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
