const mongoose = require('mongoose');
require('dotenv').config();
const Car = require('./models/Car');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars`);

        cars.forEach(c => {
            console.log(`ID: ${c._id} | Make: ${c.make} | Model: ${c.model} | ImageSize: ${c.image ? c.image.length : 0}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
