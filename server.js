const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const db = require("./app/models")
const app = express();
// db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081"
  //接続許可箇所(back~)
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  console.log('ssssssssssss');
  res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});