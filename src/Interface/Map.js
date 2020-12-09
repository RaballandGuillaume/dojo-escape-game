const askPlayerNameModal = document.getElementById('ask-player-name-modal')
const playerName = document.getElementById('new-player-name')
const closePlayerNameModal = document.getElementById('close-player-name-modal')
const alertEmptyPlayerName = document.getElementById('alert-empty-player-name')
const confirmButton = document.getElementById('player-name-confirm-button')
const title = document.getElementById('title')
const background = document.getElementById('background')
const mapImages = ['win', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7']

import { Room } from '../Game/Room'
import { Player } from '../Game/Player'
import { World } from '../Game/World'

const canvasId = 'map'
const scaling = 100
const playerSize = 1 / 10

const mapCanvas = document.getElementById(canvasId)
const mapContext = mapCanvas.getContext('2d')

/**
 * @private
 * @param {Player} player - the player
 */
const updateTitle = (player) => {
  const backgroundImage = mapImages[player.currentRoom.index]
  title.innerHTML = player.currentRoom.name
  background.classList = [backgroundImage]
}

/**
 * @param {Room} room - The room to draw
 */
export const drawRoom = (room) => {
  if (!room.isDiscovered()) {
    mapContext.fillStyle = 'black'
    mapContext.fillRect(
      room.xPos * scaling,
      room.yPos * scaling,
      room.width * scaling,
      room.height * scaling
    )
  }
  if (room.isDiscovered()) {
    // clear the room to wipe out the player
    mapContext.clearRect(
      room.xPos * scaling,
      room.yPos * scaling,
      room.width * scaling,
      room.height * scaling
    )
    // add darkness above the map
    mapContext.fillStyle = 'rgba(0,0,0,0.5)'
    mapContext.fillRect(
      room.xPos * scaling,
      room.yPos * scaling,
      room.width * scaling,
      room.height * scaling
    )
    mapContext.strokeStyle = 'black'
    mapContext.strokeRect(
      room.xPos * scaling,
      room.yPos * scaling,
      room.width * scaling,
      room.height * scaling
    )
    // add the name of the room
    mapContext.font = '0.8rem Arial'
    mapContext.fillStyle = 'white'
    mapContext.textAlign = 'start'
    mapContext.fillText(room.name, room.xPos * scaling + 5, room.yPos * scaling + 20)
  }
}

/**
 * @param {Player} player - The player to draw
 */
export const drawPlayer = (player) => {
  // draw the player
  mapContext.fillStyle = 'rgb(255, 180, 0)'
  const playerXPos =
    (player.currentRoom.xPos + player.currentRoom.width / 2) * scaling
  const playerYPos =
    (player.currentRoom.yPos + player.currentRoom.height / 2) * scaling + 10
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
  // draw the name of the player
  mapContext.fillStyle = 'white'
  mapContext.textAlign = 'center'
  mapContext.font = '0.8rem Arial'
  mapContext.fillText(player.name, playerXPos, playerYPos - playerSize * scaling - 5)
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
  if (world.isRedGuardInRoom2()) {
    drawGuard(world.rooms[1], 'red')
  }
  if (world.isRedGuardInRoom3()) {
    drawGuard(world.rooms[2], 'red')
  }
  if (world.isBlueGuardInRoom2()) {
    drawGuard(world.rooms[1], 'blue')
  }
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

/**
 * @param {Player} player - The player who won the game
 */
export const winGame = (player) => {
  background.classList = ['win']
  title.innerHTML = 'Congratulations !'
  mapCanvas.classList = ['win-map']
  erasePlayer(player)
}

/**
 * Draw a given world.
 * @param {World} world - The world to draw.
 */
export const restartDrawMap = (world) => {
  mapCanvas.classList = ['original-map']
  drawMap(world)
}

/**
 * Draw guard in the room with the corresponding color.
 * @param {Room} room - The room where to draw the guard.
 * @param {string} color - the color of the guard to draw.
 */
export const drawGuard = (room, color) => {
  mapContext.fillStyle = color
  var guardXPos = room.xPos * scaling
  if (color === 'blue') {
    guardXPos = room.xPos * scaling + playerSize * scaling + 3
  }
  else if (color === 'red') {
    guardXPos = room.xPos * scaling + room.width * scaling - playerSize * scaling - 3
  }
  const guardYPos =
    (room.yPos + room.height * 4 / 5) * scaling
  mapContext.beginPath()
  mapContext.arc(
    guardXPos,
    guardYPos,
    playerSize * scaling,
    0,
    Math.PI * 2,
    true
  )
  mapContext.fill()
}

/**
 * Draw door in the room with the corresponding color.
 * @param {Room} room - The room where to draw the guard.
 * @param {string} color - the color of the guard to draw.
 */
export const drawDoor = (room, color, side) => {
  mapContext.fillStyle = color
  var doorXPos, doorYPos, doorWidth, doorHeight
  switch (side) {
    case 'left':
      doorXPos = room.xPos
  }
  mapContext.fillStyle = 'black'
  mapContext.fillRect(
    doorXPos * scaling,
    doorYPos * scaling,
    doorWidth * scaling,
    doorHeight * scaling
  )
}