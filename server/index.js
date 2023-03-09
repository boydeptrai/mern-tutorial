const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require('./routes/auth')
const app = express();

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

app.use(express.json())

app.use("/api/auth",authRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
