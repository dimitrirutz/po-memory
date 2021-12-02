const update = (data, leaderboard) => {
    leaderboard.innerHTML = ""
    data.forEach(v => {
        let score = document.createElement("span")
        score.classList.add("score")
        let li = document.createElement("li")
        score.textContent = v.score
        li.textContent = v.player
        li.append(score)
        leaderboard.append(li)
    })
}
export default update