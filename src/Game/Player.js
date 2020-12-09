import { Room } from './Room'
import { drawMap, erasePlayer } from '../Interface/Map'
import World from './World'
import { say } from '../Interface/Text'

/**
 *
 */
export class Player {
  /**
   * Create a player
   * @param {Room} room the initial room where the player is
   * @param {string} name the player name
   */
  constructor(room, name) {
    this.currentRoom = room
    this.name = name
  }

  /**
   * Move to another room
   * @param {Room} wantedRoom
   * @param {World} world
   */
  move(wantedRoom, world) {
    erasePlayer(this)
    this.currentRoom = wantedRoom
    drawMap(world)
  }
}
