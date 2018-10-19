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
  ref.set([])
  messageArray = []
  vo(run)(function () {
    addMessage("Bot Finished")
  });
  return res.json("Request Recived")
});

app.post("/stop", function (req, res) {
  stop = true
  return res.json("Stopping Bot")
});
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
// Firebase setup
// =============================================================
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fr-col-bot.firebaseio.com'
});
// reference strings and clears it
var db = admin.database();
var ref = db.ref("strings");
ref.set([])
// array to store conole messages
let messageArray = [];
// function to add values to our Array
const addMessage = value => {
  console.log(value)
  messageArray.push(value)
  ref.set(messageArray)
}
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
  addMessage("Bot Started")
  const ifStop = () => {
    if (stop) {
      addMessage("Bot Stopped")
      nightmare.end()
    }
  }
  yield nightmare
    // sequence to login and go to battle arena
    .goto('https://www1.flightrising.com/login')
    .type('#uname', userSettings.username || "lucaH")
    .type('#pword', userSettings.password || "UP43C7m3Kzu8ddD")
    .click('#big-login-form-button')
  addMessage("Logged In")
  ifStop()
  yield nightmare
    .wait(3000)
    .click('a[href="http://www1.flightrising.com/coliseum"]')
  addMessage("Entering Coliseum")
  ifStop()
  yield nightmare
    .wait(3000)
    .realClick('#cnv', {
      x: 175,
      y: 320
    })
  ifStop()
  yield nightmare
    .wait(3000)
    .realClick(`#venueSelects div:nth-child(${userSettings.level || 1})`, {
      x: 10,
      y: 10
    })
  addMessage(`Selected level ${userSettings.level || 1}`)
  ifStop()
  yield nightmare
    .wait(2000)
    .scrollTo(120, 0)
  // for loop to battle enimies. runs until user's chosen time is reached
  for (var i = 0; Date.now() < userSettings.runTime; i++) {
    // function to play alert music and alert screen 
    ifStop()
    // checks to see if their is a captcha
    var result = yield nightmare.exists(".camp-puzzle img")
    if (result) {
      // if there is a captcha it runs alertcaptcha function
      addMessage("Captcha Alert")
      yield nightmare.end()

    } else {
      // else it runs a fight sequnce
      addMessage("Fighting!")
      ifStop()
      yield nightmare
        .wait(4000)
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