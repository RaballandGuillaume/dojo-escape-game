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
import { clearActions } from './Action'
import { clearItems } from './Item'

const canvasId = 'map'
const scaling = 100
const playerSize = 1 / 12

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
    if (room.yPos > 1) {
      mapContext.fillText(room.name, room.xPos * scaling + 5, (room.yPos + room.height) * scaling - 10)
    }
    else {
      mapContext.fillText(room.name, room.xPos * scaling + 5, room.yPos * scaling + 20)
    }
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
  // update the title with the name of the current room
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
  
  // draw the rooms
  world.rooms.forEach(drawRoom)

  // draw the player
  drawPlayer(world.player)

  // draw the doors in the room
  if (world.player.currentRoom === world.rooms[0]) { // room 1 : left
    if (world.isIronDoorOpened) { // door to corridor
      drawDoor(world.rooms[0], 'left', true)
    }
    else {
      drawDoor(world.rooms[0], 'left', false)
    }
  }
  if (world.player.currentRoom === world.rooms[1]) { // room 2 : bottom-left, bottom, bottom-right and top-right
    drawDoor(world.rooms[1], 'top-right', true) // door to cell
    if (world.player.currentRoom === world.rooms[1] && 
      world.rooms[5].isDiscovered() &&
      world.guards.library.chat === -1 &&
      world.guards.vestiary.chat === -1) { // door to library
      drawDoor(world.rooms[1], 'bottom-left', true)
    }
    else if (world.lookedOnTheRight) {
      drawDoor(world.rooms[1], 'bottom-left', false)
    }
    if (world.isBronzeDoorFound) { // door to kitchen
      if (world.isBronzeDoorOpened) {
        drawDoor(world.rooms[1], 'bottom', true)
      } 
      else if (!world.isBronzeDoorOpened) {
        drawDoor(world.rooms[1], 'bottom', false)
      }
    }
    if (world.rooms[2].isDiscovered()) { // door to vestiary
      drawDoor(world.rooms[1], 'bottom-right', true)
    }
    else if (world.lookedOnTheLeft) {
      drawDoor(world.rooms[1], 'bottom-right', false)
    }
  }
  if (world.player.currentRoom === world.rooms[2]) { // room 3 : left and bottom
    drawDoor(world.rooms[2], 'left', true)
    if (world.rooms[3].isDiscovered()) {
      drawDoor(world.rooms[2], 'bottom', true)
    }
  }
  if (world.player.currentRoom === world.rooms[3]) { // room 4 : top
    drawDoor(world.rooms[3], 'top', true)
  }
  if (world.player.currentRoom === world.rooms[4]) { // room 5 : left and top
    drawDoor(world.rooms[4], 'top', true)
    if (world.rooms[6].isDiscovered() &&
      !world.isSecurityCardFound) {
      drawDoor(world.rooms[4], 'left', false)
    }
    else if (world.rooms[6].isDiscovered() &&
      world.isSecurityCardFound) {
        drawDoor(world.rooms[4], 'left', false)
      }
  }
  if (world.player.currentRoom === world.rooms[5]) { // room 6 : bottom-right
    drawDoor(world.rooms[5], 'bottom-right', true)
  }
  if (world.player.currentRoom === world.rooms[6]) { // room 6 : right
    drawDoor(world.rooms[6], 'right', true)
  }

  // draw the guards in the room
  if (world.isRedGuardInRoom2()) {
    drawGuard(world.rooms[1], 'red')
  }
  if (world.isRedGuardInRoom3()) {
    drawGuard(world.rooms[2], 'red')
  }
  if (world.isBlueGuardInRoom2()) {
    drawGuard(world.rooms[1], 'blue')
  }
  if (world.isGreenGuardInRoom7()) {
    drawGuard(world.rooms[6], 'darkgreen')
  }
  
  // if player escaped and won the game
  if (world.playerWon) {
    winGame(world.player)
    clearItems(world)
    clearActions()
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
  erasePlayer(player)
  background.classList = ['win']
  title.innerHTML = 'Congratulations !'
  mapCanvas.classList = ['win-map']
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
 * @param {string} color - The color of the guard to draw.
 */
export const drawGuard = (room, color) => {
  mapContext.fillStyle = color
  var guardXPos, guardYPos
  if (color === 'blue') {
    guardXPos = room.xPos * scaling + playerSize * scaling + 20
    guardYPos = (room.yPos + room.height * 4 / 5) * scaling
  }
  if (color === 'red') {
    guardXPos = room.xPos * scaling + room.width * scaling - playerSize * scaling - 20
    guardYPos = (room.yPos + room.height * 4 / 5) * scaling
  }
  if (color === 'darkgreen') {
    guardXPos = room.xPos * scaling + playerSize * scaling + 5
    guardYPos = (room.yPos + room.height * 1 / 2) * scaling
  }
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
 * @param {string} side - The side where to draw the door in the room
 * @param {boolean} opened - If the door is opened or closed
 */
export const drawDoor = (room, side, opened) => {
  var doorXPos, doorYPos, doorWidth, doorHeight
  switch (side) {
    case 'left':
      doorXPos = room.xPos * scaling
      doorYPos = (room.yPos + room.height / 2) * scaling - (opened ? 7 : 10)
      doorWidth = (opened ? 20 : 7)
      doorHeight = (opened ? 7 : 20)
      break
    case 'right':
      doorXPos = (room.xPos + room.width) * scaling - (opened ? 20 : 7)
      doorYPos = (room.yPos + room.height / 2) * scaling - (opened ? 7 : 10)
      doorWidth = (opened ? 20 : 7)
      doorHeight = (opened ? 7 : 20)
      break
    case 'bottom':
      doorXPos = (room.xPos + room.width / 2) * scaling - (opened ? 10 : 7)
      doorYPos = (room.yPos + room.height) * scaling - (opened ? 20 : 7)
      doorWidth = (opened ? 7 : 20)
      doorHeight = (opened ? 20 : 7)
      break
    case 'top':
      doorXPos = (room.xPos + room.width / 2) * scaling - (opened ? 10 : 7)
      doorYPos = room.yPos * scaling
      doorWidth = (opened ? 7 : 20)
      doorHeight = (opened ? 20 : 7)
      break
    case 'bottom-left':
      doorXPos = room.xPos * scaling
      doorYPos = (room.yPos + room.height * 3 / 4) * scaling - (opened ? 10 : 10)
      doorWidth = (opened ? 20 : 7)
      doorHeight = (opened ? 7 : 20)
      break
    case 'bottom-right':
      doorXPos = (room.xPos + room.width) * scaling - (opened ? 20 : 7)
      doorYPos = (room.yPos + room.height * 3 / 4) * scaling - (opened ? 10 : 10)
      doorWidth = (opened ? 20 : 7)
      doorHeight = (opened ? 7 : 20)
      break
    case 'top-right':
      doorXPos = (room.xPos + room.width) * scaling - (opened ? 20 : 7)
      doorYPos = (room.yPos + room.height * 1 / 4) * scaling - (opened ? 10 : 10)
      doorWidth = (opened ? 20 : 7)
      doorHeight = (opened ? 7 : 20)
      break
    default:
      console.log('error when drawing the door : ', room, side, opened)
  }
  
  mapContext.fillStyle = '#664400' // door in brown
  mapContext.fillRect(
    doorXPos,
    doorYPos,
    doorWidth,
    doorHeight
  )
  mapContext.strokeStyle = 'black' // edges of door in black
  mapContext.strokeRect(
    doorXPos,
    doorYPos,
    doorWidth,
    doorHeight
  )
}