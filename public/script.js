// Initialize Firestore settings and create ref to database
const config = {
    apiKey: "AIzaSyCIYNLnZpJTNgfkAu7l-4RnpzRDWapuvSE",
    authDomain: "fr-col-bot.firebaseapp.com",
    databaseURL: "https://fr-col-bot.firebaseio.com",
    projectId: "fr-col-bot",
};
firebase.initializeApp(config);
const database = firebase.database();

// expects an arry of strings. appends them to textarea
const createList = data => {
    for (i = 0; i < data.length; i++) {
        let textarea = document.querySelector("#textarea")
        let paragraph = document.createElement('P')
        let text = document.createTextNode(data[i])
        paragraph.appendChild(text)
        textarea.appendChild(paragraph)
        textarea.scrollTop = textarea.scrollHeight;
    }
}

// retrieves all data in consoleText document
const starCountRef = firebase.database().ref('strings');
starCountRef.on('value', function (snapshot) {
    document.getElementById("textarea").innerHTML = ""
    let lastElement = snapshot.val()[snapshot.val().length- 1]
    if(lastElement === "Captcha Alert"){
        musicState.captcha = true;
        if(!musicState.mute){
            audio.play()
        }
    }
    createList(snapshot.val())
});


// creates audio variable for captcha alerts 
var audio = new Audio('Hey.mp3');
// user sound options
let musicState = {
    mute: false,
    captcha: false,
}
// allows users to mute sounds
const mute = () => {
    if (musicState.captcha) {
        audio.pause()
    }
    musicState.mute = true;
    toggleView("unmute", "mute")

}
// allows user to unmute sounds
const unmute = () => {
    if (musicState.captcha) {
        audio.play()
    }
    musicState.mute = false;
    toggleView("mute", "unmute")
}
// fetch call to pass user settings to backend 
const startBot = settings => {
    fetch('/api', {
        method: 'post',
        body: JSON.stringify({
            settings
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        })
    }).then(response => {
        return response.json();
    }).then(settings => console.log(settings));
}
// runs startBot func with demo settings
const demo = () => {
    toggleView("stop", "start")
    let demoSettings = {
        level: 0,
        username: "lucaH",
        pass: "UP43C7m3Kzu8ddD",
        display: true,
        runTime: Date.now() + 1800000
    }
    startBot(demoSettings)
}
// runs startBot func with user form settings
const runBot = () => {
    event.preventDefault()
    toggleView("stop", "start")
    let settings = {
        level: document.getElementById("level").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        runTime: document.getElementById("hour").value * 3600000 +
            document.getElementById("minute").value * 60000 +
            Date.now(),
        display: document.getElementById("electron").checked
    }
    startBot(settings)
}
// stops the bot
const stop = () => {
    toggleView("start", "stop")
    fetch('/stop', {
        method: 'post',
    })
}

const toggleView = (show, hide) => {
    x = document.getElementById(show)
    y = document.getElementById(hide)
    x.style.display = "block";
    y.style.display = "none"
}