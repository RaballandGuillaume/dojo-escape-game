var askPlayerNameModal = document.getElementById('ask-player-name-modal')
var playerName = document.getElementById('new-player-name')
var closePlayerNameModal = document.getElementById('close-player-name-modal')
var alertEmptyPlayerName = document.getElementById('alert-empty-player-name')
var confirmButton = document.getElementById('player-name-confirm-button')

import { Room } from '../Game/Room'
import { Player } from '../Game/Player'
import { World } from '../Game/World'

const canvasId = 'map'
const scaling = 150
const playerSize = 1 / 10

const mapCanvas = document.getElementById(canvasId)
const mapContext = mapCanvas.getContext('2d')

/**
 * @param {Room} room - The room to draw
 */
export const drawRoom = (room) => {
  mapContext.fillStyle = room.color
  mapContext.fillRect(
    room.xPos * scaling,
    room.yPos * scaling,
    room.width * scaling,
    room.height * scaling
  )
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
}

/**
 * @param {Player} player - The player to erase
 */
export const erasePlayer = (player) => {
  mapContext.fillStyle = player.currentRoom.color
  mapContext.strokeStyle = player.currentRoom.color
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
  mapContext.stroke()
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
export const askPlayerName = (player, callback) => {
  const checkPlayerName = () => {
    if(playerName.value.length > 0) {
      askPlayerNameModal.style.display = 'none'
      alertEmptyPlayerName.style.display = 'none'
      player.name = playerName.value
      callback()
    }
    else {
      alertEmptyPlayerName.style.display = 'block'
      playerName.style.backgroundColor = 'red'
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
}