const mongoose = require('mongoose');
// const config = require('config');
// const db = process.env.mongoURI;
require('dotenv').config()
const db = process.env['MONGOURI']

const connectDB = async () => {
  try {
    await mongoose.connect(
      db,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;