import MemoryCard from "./Card";
import {updateWaitingList} from "../functions/host";
import '../polyfills'


export default class Memory {

    cards = []
    config
    element
    openCards = []
    tries = 0
    $leaderboardList
    socket
    currentPlayer

    /**
     * @param {HTMLDivElement} gridElement HTML element of memory grid
     * @param {Object} config Configuration Object
     * @param {Socket} socket
     * @param player
     */
    constructor(gridElement, config, socket, player) {
        gridElement.innerHTML = ''
        this.config = config
        this.element = gridElement
        this.currentPlayer = player
        this.$leaderboardList = this.qs("#leaderboard-list")
        this.socket = socket
        this.startBtn = document.createElement("div")
        this.startBtn.id = "start-button"
        this.btnContent = document.createElement("div")
        this.btnContent.classList.add("content")
        this.startBtn.append(this.btnContent)
        this.element.append(this.startBtn)
        this.displayCurrentPlayer(this.currentPlayer.username)
        this.btnContent.textContent = this.currentPlayer.username
        this.socket.emit("player-ready-to-start", this.currentPlayer)
        this.startTimer()
        this.init()
    }

    /**
     * @param {string} selector
     * @return {HTMLElement}
     */
    qs(selector) {
        return document.querySelector(selector)
    }

    startBtnHandleClick = () => {
        this.start()
        setTimeout(() => {
            this.startBtn.style.display = "none"
        }, 3300)
    }

    init() {
        for (let i = 1; i <= this.config.cards; i++) {
            let card = this.card()
            card.addEventListener("click", this.handleCardClick)
            card.id = i.toString()
            this.cards.push(card)
        }

        this.startBtn.addEventListener("click", this.startBtnHandleClick)

        this.audio = document.querySelector("audio")

        this.socket.on("abort-game", () => {
            this.stop()
        })

    }

    start() {
        console.log(this.currentPlayer)
        this.btnContent.textContent = this.currentPlayer.username
        this.handleServerEvents()

        clearInterval(this.timerUpdate)

        this.socket.emit("start", this.currentPlayer)

        this
            .setCouples()
            .randomizeCards()
            .insertCards()
    }

    displayCurrentPlayer(pseudo) {
        let item = document.createElement("li")
        let pseudoElement = document.createElement("span")
        pseudoElement.textContent = `${pseudo}`
        this.countElement = document.createElement("span")
        this.countElement.textContent = this.tries.toString()
        item.append(pseudoElement, this.countElement)
        this.$leaderboardList.append(item)
    }

    updateCount() {
        this.countElement.textContent = this.tries.toString()
    }

    findPair() {
        let p = this.audio.play()
        this.openCards.forEach(value => {
            value.finded = true
        })
        this.updateCount()
        this.openCards = []
        if (this.isAllFinded()) {
            this.stop()
        }
    }

    setCouples() {
        let iindex = 0
        for (let o = 0; o < this.cards.length; o++) {
            let img = this.config.images[iindex]
            iindex++
            let card2_index = o++
            let card2 = this.cards[o]
            let card = this.cards[card2_index]
            card.assignCouple(card2)
            card2.assignCouple(card)
            card.bg = img
            card2.bg = img
        }
        return this
    }

    insertCards() {
        let index = 1
        let number = 0
        let computedStyle = getComputedStyle(document.body)
        let cardSize = parseInt(computedStyle.getPropertyValue('--card-size'))
        let row = 0

        for (let card of this.cards) {

            if (number === 6) {
                number = 0;
                row++
            }

            card.placeInGrid(this.element, index, number, row, cardSize)
            //card.displayImage()
            index++
            number++
        }
        return this
    }

    randomizeCards() {
        for (let i = 1; i < this.config.cards; i++) {
            let randomTo = Math.floor(Math.random() * this.cards.length)
            this.cards.move(i, randomTo)
        }
        return this
    }

    card() {
        return new MemoryCard()
    }

    handleCardClick = async (e) => {
        if (this.openCards.length === 2) {
            this.hideAllSelected()
        }
        let card = e.currentTarget
        if (!card.open) {
            card.open = true
            this.openCards.push(card)
            if (card.couple.open) {
                this.findPair()
            }
            card.displayImage()
            if (this.openCards.length > 2) {
                this.hideAllSelected()
            }
        }
    }

    isAllFinded() {
        let count = 0
        this.cards.forEach(v => {
            v.finded ? count++ : count
        })
        return count === this.cards.length
    }

    hideAllSelected = () => {
        this.hide(this.openCards)
        this.tries++
        this.updateCount()
        this.openCards = []
    }

    hide = (cards) => {
        cards.forEach((value => {
            value.hideImage()
            value.open = false
            value.finded = false
        }))
    }

    stop() {

        clearInterval(this.timerUpdate)
        this.socket.emit("stop", {
            game: this.game,
            stats: {
                tries: this.tries
            }
        })
        this.startBtn.removeEventListener('click', this.startBtnHandleClick)
        this.startBtn.style.display = "block"
        this.btnContent.textContent = "En attentes de joueurs"

        this.cards.forEach(v => {
            v.style.display = "none"
        })


    }

    startTimer() {

        let timeToStart = 20

        this.timerUpdate = setInterval(() => {
            if (timeToStart === 0) {
                clearInterval(this.timerUpdate)
                this.stop()
            } else {
                timeToStart--
                this.btnContent.textContent = `${this.currentPlayer.username} - ${timeToStart.toString()}`
                //this.btnContent.textContent = timeToStart.toString()
            }
        }, 1000)
    }

    handleServerEvents() {
        this.socket.on("game-info", game => {
            console.log(game)
            this.game = game
        })
    }
}

