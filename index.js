const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
var cors = require("cors");
dotenv.config();


app.use(cors());
app.use(express.json());

const dbURL = process.env.MONGODB_URL;
(async function () {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Failed to connect to database");
  }
})();

const urlSchema = new mongoose.Schema({
  code: String,
  url: String,
  hits: Number,
});

const Url = mongoose.model("Url", urlSchema);

app.post("/submit", async (req, res) => {
  try {
    let randomValue = nanoid(4);
    const link = req.body.url;
    if (!validUrl.isUri(link)) {
      randomValue="Invalid input";
      res.send({randomValue});
      return;
    }
    newUrl = new Url({
      url: link,
      code: randomValue,
      hits: 0,
    });
    randomValue = process.env.URL + "/" + randomValue;
    await newUrl.save();
    res.send({randomValue});
  } catch (error) {
    res.send("Internal Server Error");
  }
});

app.get("/:name", async (req, res) => {
  try {
    let name = req.params.name;
    let currhit;
    await Url.findOne({ code: name }).then((data) => {
      if (data) {
        const longUrl = data.url;
        currhit = data.hits + 1;
        res.redirect(longUrl);
      } else {
        console.log("error");
      }
    });
    await Url.updateOne({ code: name }, { hits: currhit });
  } catch (error) {
    res.send("Internal Server Error");
  }
});

app.post("/analyticssubmit", async (req, res) => {
  try {
    const link = req.body.shorturl;
    let j = 0;
    for (let i = 0; i < link.length; i++) {
      if (link[i] === "/") j = i;
    }

    let name = "";
    for (j++; j < link.length; j++) {
      name += link[j];
    }
    let currhit = "Invalid URL";
    await Url.findOne({ code: name }).then((data) => {
      if (data) {
        currhit = data.hits.toString();
      } else {
        console.log("error");
      }
      res.send({currhit});
    });
  } catch (error) {
    res.send({"message":"Internal Server Error"});
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
