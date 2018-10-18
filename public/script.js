// creates audio variable for captcha alerts 
var audio = new Audio('Hey.mp3');
// user sound options
let musicState = {
    sound: false,
    mute: false
}
// allows users to mute sounds
const mute = () => {
    musicState.mute ? musicState.mute = false : musicState.mute = true
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
    }).then((response) => {
        return response.json();
    }).then((settings) => console.log(settings));
}
// runs startBot func with demo settings
const demo = () => {
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
    let settings = {
        level: document.getElementById("level").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        runTime: document.getElementById("hour").value * 3600000 +
            document.getElementById("minute").value * 60000 +
            Date.now(),
        display: document.getElementById("electron").checked
    }
    musicState.sound = document.getElementById("sound").checked
    startBot(settings)
}
// stops the bot
const stop = () => {
    fetch('/stop', {
        method: 'post',
    })
}