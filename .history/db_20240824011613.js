//db.js

const mongoose = require("mongoose");

const url = `mongodb+srv://duyetleminh2004:<db_password>@database.hgwbyae.mongodb.net/?retryWrites=true&w=majority&appName=database`;

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
