import { Player } from './Player'
import { Room } from './Room'
import { drawRoom, drawPlayer } from '../Interface/Map'
import { Action, MoveAction, InventoryAction } from './Action'
import { clearActions, addEnabledActions } from '../Interface/Action'
import { Item } from './Item'
import { clearItems, addEnabledItems } from '../Interface/Item'

export class World {
  /**
   * @type {Room[]}
   */
  rooms = []

  /**
   * @type {Action[]}
   */
  actions = []

  /**
   * @type {Player | undefined}
   */
  player = undefined

  /**
   * @type {Item[]}
   */
  items = []

  constructor(name) {
    this.name = name
    this.notes = ''
    this.isIronDoorOpened = false
    this.isIronKeyFound = false
    this.isIronKeyUsed = false
    this.isGoldenKeyFound = false
    this.isGoldenKeyUsed = false
    this.isGoldenDoorFound = false
    this.isNoteBookFound = false
    this.isLetterFound = false
    this.isLetterUsed = false
    this.lookedOnTheLeft = false
    this.lookedOnTheRight = false
    this.isSilverCoinFound = false
    this.isSilverCoinUsed = false
    this.isBronzeKeyFound = false
    this.isBronzeDoorFound = false
    this.isBronzeDoorOpened = false
    this.cookedMeals = {
      burger: 0, 
      pasta: 0, 
      cake: 0, 
      specialMeal: 0
    }
    this.guards = {
      vestiary: {
        chat: 0, 
        sport: 0, 
        pasta: 0,
        burger: 0
      }, 
      library: {
        chat: 0, 
        burger: 0, 
        cake: 0,
        silverCoins: 0
      },
      outdoor: {
        chat: 0,
        goldCoins: 0,
        specialMeal: 0
      }
    }
    this.isGoldCoinFound = false
    this.isGoldCoinUsed = false
    this.isSmallBoxFound = false
    this.isSmallBoxUsed = false
    this.isCookingBookFound = false
    this.isCookingBookUsed = false
    this.isPostItFound = false
    this.isBackDoorFound = false
    this.isBackDoorOpened = false
    this.booksRead = 0
    this.isTrappedDoorFound = false
    this.isSpecialCookingBookFound = false
    this.isSpecialCookingBookUsed = false
    this.isCodeLockerFound = false
    this.isCodeLockerUsed = false
    this.isPictureFound = false
    this.isSecurityCardFound = false
    this.isRoom1Found = true
    this.isRoom2Found = false
    this.isRoom3Found = false
    this.isRoom4Found = false
    this.isRoom5Found = false
    this.isRoom6Found = false
    this.isRoom7Found = false
    this.openInventory = false
    this.isRedGuardInRoom2 = () => (
      (this.player.currentRoom === this.rooms[1] &&
      this.guards.vestiary.chat >= 0 && 
      this.lookedOnTheLeft &&
      this.guards.vestiary.chat !== 2) ||
      (this.player.currentRoom === this.rooms[1] &&
        this.isBronzeKeyFound &&
        this.guards.vestiary.chat === 2)
    )
    this.isRedGuardInRoom3 = () => (
      this.player.currentRoom === this.rooms[2] &&
      this.guards.vestiary.sport === 0 &&
      this.guards.vestiary.chat === 2
    )
    this.isBlueGuardInRoom2 = () => (
      this.player.currentRoom === this.rooms[1] &&
      this.lookedOnTheRight &&
      this.guards.library.chat >= 0
    )
  }

  /**
   * @private
   * @param {()=>Promise<void> | undefined} callback to do on action click
   */
  wrapCallbackForAutomaticActionsDisplay(callback) {
    return () => {
      clearActions()
      return (callback ? callback() : Promise.resolve(null))
        .then(() => {
          addEnabledActions(this)
          clearItems(this)
        })
        .catch(console.error)
    }
  }

  /**
   * @private
   * @param {()=>Promise<void> | undefined} callback to do on item click
   */
  wrapCallbackForAutomaticItemsDisplay(callback) {
    return () => {
      clearItems(this)
      return (callback ? callback() : Promise.resolve(null))
        .then(() => {
          addEnabledItems(this)
        })
        .catch(console.error)
    }
  }

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
  createRoom(roomConfiguration) {
    const room = new Room(roomConfiguration)
    this.rooms.push(room)
    drawRoom(room)
    return room
  }

  /**
   * Create an action
   * @param {Object} actionConfig the action config
   * @param {string} actionConfig.text the action text
   * @param {()=>void | undefined} actionConfig.isEnabled evaluated after each action for action availability, if undefined the action is not automatically enabled
   * @param {()=>Promise<void> | undefined} actionConfig.callback to do on action click
   */
  createAction(actionConfig) {
    const action = new Action({
      ...actionConfig,
      world: this,
      callback: this.wrapCallbackForAutomaticActionsDisplay(
        actionConfig.callback
      ),
    })
    this.actions.push(action)
    return action
  }

  /**
   * Create a move action
   * @param {Object} actionConfig the action config
   * @param {string} actionConfig.text the action text
   * @param {()=>void | undefined} actionConfig.isEnabled evaluated after each action for action availability, if undefined the action is not automatically enabled
   * @param {()=>Promise<void> | undefined} actionConfig.callback to do on action click
   * @param {Room} wantedRoom the room to move to
   */
  createMoveAction(actionConfig, wantedRoom) {
    const action = new MoveAction(
      {
        ...actionConfig,
        world: this,
        callback: this.wrapCallbackForAutomaticActionsDisplay(
          actionConfig.callback
        ),
      },
      this.player,
      wantedRoom
    )
    this.actions.push(action)
    return action
  }

  /**
   * Create a new player
   * @param {string} name the player name
   * @returns {Player} the created player
   */
  createPlayer(name) {
    if (this.rooms.length === 0) {
      throw new Error(
        'The world needs to have at least one room for the player to start'
      )
    }
    const player = new Player(this.rooms[0], name)
    this.player = player
    drawPlayer(player)
    return player
  }

  /**
   * Create the inventory as an action
   * @param {Object} actionConfig the action config
   * @param {string} actionConfig.text the action text
   * @param {()=>void | undefined} actionConfig.isEnabled evaluated after each action for action availability, if undefined the action is not automatically enabled
   * @param {()=>Promise<void> | undefined} actionConfig.callback to do on action click
   */
  createInventoryAction(actionConfig) {
    const action = new InventoryAction(
      {
        ...actionConfig,
        world: this,
        callback: this.wrapCallbackForAutomaticActionsDisplay(
          actionConfig.callback
        ),
      }
    )
    this.actions.push(action)
    return action
  }

  /**
   * Create an item
   * @param {Object} itemConfig the item config
   * @param {string} itemConfig.name the item name
   * @param {boolean} itemConfig.isEnabled evaluated when opening the inventory, if undefined the item is not enabled
   * @param {()=>Promise<void>} itemConfig.callback to do on item click
   */
  createItem(itemConfig) {
    for (let k = 0 ; k < this.items.length ; k++) {
      const item = this.items[k]
      if (item.name === itemConfig.name) {
        return item
      }
    }
    const item = new Item(
      {
      ...itemConfig,
      world: this,
      callback: this.wrapCallbackForAutomaticItemsDisplay(
        itemConfig.callback
      ),
    })
    this.items.push(item)
    return item
  }
}


