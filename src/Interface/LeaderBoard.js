const actionsTitle = document.getElementById('actions-title')
const winLeaderBoardContainer = document.getElementById('leaderboard-win-container')
const winLeaderBoardText = document.getElementById('leaderboard-win-text')
const leaderBoardModal = document.getElementById('leaderboard-modal')
const leaderBoardModalText = document.getElementById('leaderboard-modal-text')

import { World } from '../Game/World'
import { formatTime } from './Timer'

/**
 * Add the new time and player name to the leader board
 * @param {World} world - the world that contains the leader board
 * @param {array} newLine - the new array containing time and player name
 */
export const addToLeaderBoard = (world, newLine) => {
  if (world.leaderBoard.length === 0) {
    world.leaderBoard.push(newLine)
    return
  }
  for (let k = 0 ; k < world.leaderBoard.length ; k++) {
    const line = world.leaderBoard[k]
    if (line[0] >= newLine[0]) {
      world.leaderBoard.splice(k, 0, newLine)
      return
    }
  }
  world.leaderBoard.push(newLine)
}

/**
 * Display the leader board instead of actions when the player wins the game
 * @param {World} world - the world that contains the leader board
 */
export const displayWinLeaderBoard = (world) => {
  actionsTitle.innerText = 'Leaderboard - Top 10'
  winLeaderBoardText.innerHTML = ''
  for (let k = 0 ; k < world.leaderBoard.length && k < 10 ; k++) {
    const line = world.leaderBoard[k]
    var textLine = '<p>' + String(k+1) + ' - ' + formatTime(line[0]) + ' - ' + line[1] + '</p>'
    winLeaderBoardText.innerHTML += textLine
  }
  winLeaderBoardContainer.style.display = 'block'
}

export const hideWinLeaderBoard = () => {
  winLeaderBoardContainer.style.display = 'none'
}

/**
 * Display the modal with the leader board at any moment
 * @param {World} world - the world that contains the leader board
 */
export const displayLeaderBoardModal = (world) => {
  leaderBoardModalText.innerHTML = 'Win at least 1 game to see the leaderboard here'
  for (let k = 0 ; k < world.leaderBoard.length && k < 10 ; k++) {
    const line = world.leaderBoard[k]
    var textLine = '<p>' + String(k+1) + ' - ' + formatTime(line[0]) + ' - ' + line[1] + '</p>'
    leaderBoardModalText.innerHTML += textLine
  }
  leaderBoardModal.style.display = 'block'
}

export const hideLeaderBoardModal = () => {
  leaderBoardModal.style.display = 'none'
}