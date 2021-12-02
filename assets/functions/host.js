export function updateWaitingList(listElement, players) {
    listElement.innerHTML = ""
    players.forEach(v => {
        let pElement = document.createElement("li")
        pElement.textContent = v.username
        listElement.append(pElement)
    })
}

export function removePlayerFromList() {

}