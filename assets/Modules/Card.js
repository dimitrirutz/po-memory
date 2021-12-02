export default class MemoryCard extends HTMLElement {

    finded = false
    open = false
    couple
    bg

    constructor() {
        super();
        this.classList.add("memory-card")
    }

    displayImage() {
        this.style.setProperty('--card-background', `url(${this.bg})`)
    }

    hideImage() {
        this.style.removeProperty('--card-background')
    }

    placeInGrid(parentElement, index, colSpan, rowSpan, cardSize) {
        this.classList.add("movingTo")
        let destination = {
            top: (cardSize + 26) * rowSpan,
            left: (cardSize + 26) * colSpan
        }
        this.style.setProperty('--top', `${destination.top}px`)
        this.style.setProperty('--left', `${destination.left}px`)

        setTimeout(() => {
            parentElement.append(this)
        }, 100 * index)


    }

    /**
     * @param {MemoryCard} card
     */
    assignCouple(card) {
        this.couple = card
    }
}