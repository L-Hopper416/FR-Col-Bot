// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
// =============================================================

// Html Route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api", function (req, res) {
  userSettings = req.body.settings;
  stop = false;
  vo(run)(function () {
    console.log("bot done")
  });
  return res.json("Request Recived")
});

app.post("/stop", function (req, res) {
  stop = true
});
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

// Nightmare dependencies
// =============================================================
const Nightmare = require('nightmare')
const vo = require('vo');
const realMouse = require('nightmare-real-mouse');

// Declare user settings variable
let userSettings;
let stop = false;

// function to play flight rising collesium
function* run() {
  //setting up nightmare window and realmouse
  realMouse(Nightmare);
  let nightmare = Nightmare({
    show: userSettings.display,
    height: 1000,
    width: 1200
  })
  console.log("bot going")

  const ifStop = () => {
    if (stop) {
      nightmare.end()
    }
  }
  yield nightmare
    // sequence to login and go to battle arena
    .goto('https://www1.flightrising.com/login')
    .type('#uname', userSettings.username || "lucaH")
    .type('#pword', userSettings.password || "UP43C7m3Kzu8ddD")
    .click('#big-login-form-button')
  ifStop()
  yield nightmare
    .wait(3000)
    .click('a[href="http://www1.flightrising.com/coliseum"]')
    .wait(3000)
  ifStop()
  yield nightmare
    .realClick('#cnv', {
      x: 175,
      y: 320
    })
    .wait(3000)
  ifStop()
  yield nightmare
    .realClick(`#venueSelects div:nth-child(${userSettings.level || 1})`, {
      x: 10,
      y: 10
    })
    .wait(2000)
  ifStop()
  yield nightmare
    .scrollTo(120, 0)
  // for loop to battle enimies. runs until user's chosen time is reached
  console.log(Date.now() < userSettings.runTime)
  for (var i = 0; Date.now() < userSettings.runTime; i++) {
    console.log(Date.now() < userSettings.runTime)
    // function to play alert music and alert screen 
    ifStop()
    // checks to see if their is a captcha
    var result = yield nightmare.exists(".camp-puzzle img")
    if (result) {
      // if there is a captcha it runs alertcaptcha function
      console.log("captcha")
      yield nightmare.end()

    } else {
      // else it runs a fight sequnce
      console.log("fight sequence")
      yield nightmare
        .wait(4000)
      ifStop()
      yield nightmare
        .realClick('#pl_content', {
          x: 560,
          y: 480
        })
        .wait(2000)
      ifStop()
      yield nightmare
        .realClick('#pl_content', {
          x: 560,
          y: 510
        })
        .wait(2000)
      ifStop()
      yield nightmare
        .realClick('#pl_content', {
          x: 450,
          y: 480
        })
        .wait(1000)
      ifStop()
      yield nightmare
        .type('body', 'a')
        .wait(1000)
        .type('body', 'a')
        .wait(300)
      ifStop()
      yield nightmare
        .type('body', 'e')
        .wait(500)
        .type('body', 'q')
        .wait(100)
        .type('body', 'w')
        .wait(100)
        .type('body', 'e')
        .wait(100)
        .type('body', 'r')
      // done fighting rechecks if their is a captcha or chosen time is reached
    }
  }
  // stops running nigthmare             
  yield nightmare.end()
  nightmare.proc.disconnect()
  nightmare.ended = true;
  nightmare = Nightmare({
    show: userSettings.display || true,
    height: 1000,
    width: 1200
  })
}