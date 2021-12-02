import './styles/app.css'
import './bootstrap'
import {io} from 'socket.io-client'
import {v4} from 'uuid'
import {strToDom} from "./polyfills";

let socket


if (!localStorage.getItem('socketId')) {
    let uuid = v4()
    socket = io("ws://socket.drutz.ch:53333", {
        secure: true,
        auth: {
            token: uuid
        }
    })
    setTimeout(() => {
        localStorage.setItem('socketId', uuid)
    }, 500)

} else {
    socket = io("ws://socket.drutz.ch:53333", {
        secure: true,
        auth: {
            token: localStorage.getItem('socketId')
        }
    })
}

let currentUser


let pseudoInput = document.querySelector("#username")
let form = document.querySelector("#form")
let email = document.querySelector("#email")
let quitBtn = document.querySelector("#quit")
let pageWarper = document.querySelector(".page-warper")

quitBtn.onclick = (e) => {
    e.preventDefault()
    socket.emit("quit-game", currentUser)
}


window.reload = () => {
    socket.emit("reload")
}


let connectedContent = strToDom(`
        <div id="zone">
        <h2>Vous êtes en liste d'attente</h2>
        <div>
        <h4>Vos informations</h4>
        <p id="username"></p>
        <p id="email"></p>
        </div>
    </div>`)

socket.on("player", data => {
    let pseudoInput = document.querySelector("#username")
    let email = document.querySelector("#email")
    currentUser = data
    console.log(data)
    if (!currentUser.status) {
        console.log("User need to register")
        quitBtn.style.display = "none"
        form.onsubmit = (e) => {
            e.preventDefault()
            socket.emit("want-to-play", {
                username: pseudoInput.value,
                email: email.value
            })
        }
        email.value = ''
        pseudoInput.value = ''
    } else {
        pageWarper.innerHTML = ""
        connectedContent.getElementById("username").textContent = data.username
        connectedContent.getElementById("email").textContent = data.email
        connectedContent.querySelector(".position").textContent = data.position
        pageWarper.append(connectedContent)
    }
})


function loggedInterface(player) {

}







