const mongoose = require('mongoose');
require('dotenv').config();
const Car = require('./models/Car');

async function debugCars() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cars = await Car.find({});
        console.log('--- CARS DUMP ---');
        cars.forEach(c => {
            console.log(`ID: ${c._id}`);
            console.log(`Make: ${c.make}`);
            // console.log(`Image: ${c.image}`); // Don't dump image
        });
        console.log('--- END DUMP ---');
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
}
debugCars();
