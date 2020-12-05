const randomValue = () => Math.floor(Math.random() * 255)
const randomColor = () =>
  `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`
import { drawRoom } from '../Interface/Map'

export class Room {
  /**
   * @param {Object} roomConfiguration - this is the room configuration
   * @param {string} roomConfiguration.name - the name of the room
   * @param {number} roomConfiguration.height - room height
   * @param {number} roomConfiguration.width - room width
   * @param {number} roomConfiguration.xPos - room horizontal emplacement
   * @param {number} roomConfiguration.yPos - room vertical emplacement
   * @param {string} roomConfiguration.color - the room color
   * @param {() => void | undefined} roomConfiguration.isDiscovered - if the player has discovered the room
   */
  constructor({ name, height = 1, width = 1, xPos = 0, yPos = 0, color, isDiscovered = () => false }) {
    this.name = name
    this.height = height
    this.width = width
    this.xPos = xPos
    this.yPos = yPos
    this.color = color ? color : randomColor()
    this.isDiscovered = isDiscovered
  }

  /**
   * @param {string} color - The new color
   */
  updateColor(color) {
    this.color = color ? color : randomColor()
    drawRoom(this)
  }
}
