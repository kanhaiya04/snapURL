const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const ejs = require("ejs");

dotenv.config();
const dbURL = process.env.MONGODB_URL;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
(async function () {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.post("/submit", async (req, res) => {
  const link = req.body.url;
  if (!validUrl.isUri(link)) {
    // res.redirect("/notURL");
    console.log("notURL");
  }
  let randomValue = nanoid(4);
  newUrl = new Url({
    url: link,
    code: randomValue,
    hits: 0,
  });
  randomValue = process.env.URL + "/" + randomValue;
  await newUrl.save();
  res.render("shortURL", { url: randomValue });
});

app.get("/analytics", async (req, res) => {
  res.render("analytics");
});
app.get("/:name", async (req, res) => {
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
});

app.post("/analyticssubmit", async (req, res) => {
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
      currhit = data.hits;
    } else {
      console.log("error");
    }
    res.render("analytics", { hits: currhit });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
