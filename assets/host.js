import Memory from "./Modules/Memory"
import MemoryCard from "./Modules/Card"
import {io} from 'socket.io-client'
import {updateWaitingList} from "./functions/host";
import update from "./Modules/Leaderborad";

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
}

const socket = io("ws://socket.drutz.ch:53333", {
    secure: true,
})
socket.connect()
socket.emit("host-join")

customElements.define('memory-card', MemoryCard)
const image_list = [
    '../images/Memory-02.svg',
    '../images/Memory-03.svg',
    '../images/Memory-04.svg',
    '../images/Memory-05.svg',
    '../images/Memory-17.svg',
    '../images/Memory-07.svg',
    '../images/Memory-08.svg',
    '../images/Memory-09.svg',
    '../images/Memory-10.svg',
    '../images/Memory-11.svg',
    '../images/Memory-12.svg',
    '../images/Memory-13.svg',
    '../images/Memory-14.svg',
    '../images/Memory-15.svg',
    '../images/Memory-16.svg',
]


let element = document.querySelector("#memory")
let waiting_list = document.querySelector(".waiting-list")
let leaderboard = document.querySelector("#leaderboard-list")

let stopBtn = document.querySelector("#stop-button")

let playerList

socket.on("scores", scores => {
    update(scores, leaderboard)
})

socket.on("update-waiting-list", (players) => {
    playerList = players
    updateWaitingList(waiting_list, players)
})

let memory

socket.on("reload", () => {
    window.location = window.location.pathname
})

socket.on("allScores", (scores) => {
    console.log(scores)
})

socket.on("next-start", (player) => {
    memory = new Memory(
        element,
        {
            cards: 30,
            columns: 6,
            time: 2,
            images: image_list
        },
        socket,
        player)
})




