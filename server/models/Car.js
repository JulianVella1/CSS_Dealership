const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number },
    condition: { type: String, enum: ['New', 'Used', 'Certified'], default: 'Used' },
    description: { type: String },
    image: { type: String }, // URL or path
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);
