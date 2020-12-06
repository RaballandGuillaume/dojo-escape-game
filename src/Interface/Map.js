const askPlayerNameModal = document.getElementById('ask-player-name-modal')
const playerName = document.getElementById('new-player-name')
const closePlayerNameModal = document.getElementById('close-player-name-modal')
const alertEmptyPlayerName = document.getElementById('alert-empty-player-name')
const confirmButton = document.getElementById('player-name-confirm-button')
const title = document.getElementById('title')

import { Room } from '../Game/Room'
import { Player } from '../Game/Player'
import { World } from '../Game/World'

const canvasId = 'map'
const scaling = 150
const playerSize = 1 / 10

const mapCanvas = document.getElementById(canvasId)
const mapContext = mapCanvas.getContext('2d')

/**
 * @private
 * @param {Player} player - the player
 */
const updateTitle = (player) => {
  title.innerHTML = player.currentRoom.name
}

/**
 * @param {Room} room - The room to draw
 */
export const drawRoom = (room) => {
  mapContext.fillStyle = room.isDiscovered()?room.color:'black'
  mapContext.fillRect(
    room.xPos * scaling,
    room.yPos * scaling,
    room.width * scaling,
    room.height * scaling
  )
  if (room.isDiscovered()) {
    mapContext.font = '1rem Arial'
    mapContext.fillStyle = 'white'
    mapContext.textAlign = 'start'
    mapContext.fillText(room.name, room.xPos * scaling + 5, room.yPos * scaling + 20)
  }
}

/**
 * @param {Player} player - The player to draw
 */
export const drawPlayer = (player) => {
  mapContext.fillStyle = 'rgb(255, 165, 0)'
  const playerXPos =
    (player.currentRoom.xPos + player.currentRoom.width / 2) * scaling
  const playerYPos =
    (player.currentRoom.yPos + player.currentRoom.height / 2) * scaling
  mapContext.beginPath()
  mapContext.arc(
    playerXPos,
    playerYPos,
    playerSize * scaling,
    0,
    Math.PI * 2,
    true
  )
  mapContext.fill()
  mapContext.fillStyle = 'white'
  mapContext.textAlign = 'center'
  mapContext.fillText(player.name, playerXPos, playerYPos - playerSize * scaling - 8)
  updateTitle(player)
}

/**
 * @param {Player} player - The player to erase
 */
export const erasePlayer = (player) => {
  drawRoom(player.currentRoom)
}

/**
 * Draw a given world.
 * @param {World} world - The world to draw.
 */
export const drawMap = (world) => {
  world.rooms.forEach(drawRoom)
  drawPlayer(world.player)
}

/**
 * @param {Player} player - The player whose name will be changed
 * @param {function} callback - The function to call after changing the name
 */
export const askPlayerName = (player, callback = undefined) => {
  
  const pressEnterListener = (event) => {
    if (event.key === 'Enter') {
      checkPlayerName()
    }
  }
  var checkPlayerName = () => {
    if(playerName.value.length > 0) {
      askPlayerNameModal.style.display = 'none'
      alertEmptyPlayerName.style.display = 'none'
      player.name = playerName.value
      callback?callback():{};
      playerName.removeEventListener('keyup', pressEnterListener)
      erasePlayer(player)
      drawPlayer(player)
      return
    }
    else {
      alertEmptyPlayerName.style.display = 'block'
      playerName.style.backgroundColor = 'lightred'
    }
  }
  alertEmptyPlayerName.style.display = 'none'
  askPlayerNameModal.style.display = 'block'
  playerName.value = player.name
  playerName.focus()
  confirmButton.onclick = () => {
    checkPlayerName()
  }
  closePlayerNameModal.onclick = () => {
    checkPlayerName()
  }
  window.onclick = (event) => {
    if (event.target == askPlayerNameModal) {
      checkPlayerName()
    }
  }
  playerName.addEventListener('keyup', pressEnterListener)
}