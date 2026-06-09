require('dotenv').config();
const mongoose = require('mongoose');
const Learning = require('./models/Learning');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const resources = await Learning.find({});
    console.log(JSON.stringify(resources, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
