const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const route = require("./routes/route");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connecting to db
mongoose.connect(process.env.DB)
.then(()=>{console.log("db connected")})
.catch((err)=>{console.log("error in db connection", err)});

app.use("/", route);

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  )
});
 
// running application on server
app.listen(process.env.PORT, ()=>{
    console.log("server is running on port", 5000)
})

 