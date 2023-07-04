const express = require("express");
const cors = require("cors");
const router = require("./routes");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/", router);

app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
  console.log(`Server has started on 0.0.0.0 using port ${process.env.PORT}`)
);
