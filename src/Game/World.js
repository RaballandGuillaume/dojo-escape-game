import { Player } from './Player'
import { Room } from './Room'
import { drawRoom, drawPlayer, drawMap, restartDrawMap } from '../Interface/Map'
import { Action, MoveAction, InventoryAction } from './Action'
import { clearActions, addEnabledActions } from '../Interface/Action'
import { Item } from './Item'
import { clearItems, addEnabledItems } from '../Interface/Item'
import { say } from '../Interface/Text'
import Timer from './Timer'

// Custom JSON.parse and JSON.stringify functions to manage serializing functions in JSON data
var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}
(function () {
  JSONfn.stringify = function(obj) {
    return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
  }

  JSONfn.parse = function(str) {
    return JSON.parse(str,function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
  }
}());

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
    this.timer = new Timer(this)
    this.leaderBoard = []
    this.name = name
    this.notes = ''
    this.history = ''
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
    this.isEnigmaUsed = false
    this.isSecurityCardFound = false
    this.isRoom1Found = true
    this.isRoom2Found = false
    this.isRoom3Found = false
    this.isRoom4Found = false
    this.isRoom5Found = false
    this.isRoom6Found = false
    this.isRoom7Found = false
    this.openInventory = false
    this.playerWon = false
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
    this.isGreenGuardInRoom7 = () => (
      this.player.currentRoom === this.rooms[6] &&
      !this.isGoldenKeyFound
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
          drawMap(this)
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
          drawMap(this)
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

  /**
   * Reset all parameters to restart the game
   */
  resetGame = () => {
    if (!this.playerWon) { // because actions and items hava already been cleared if player has won
      clearItems(this)
    }
    this.notes = ''
    this.history = ''
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
    this.cookedMeals = {burger: 0, pasta: 0, cake: 0, specialMeal: 0}
    this.guards = {
      vestiary: {
        chat: 0, 
        sport: 0, 
        pasta: 0
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
    this.isPostItUsed = false
    this.isBackDoorFound = false
    this.isBackDoorOpened = false
    this.booksRead = 0
    this.isTrappedDoorFound = false
    this.isSpecialCookingBookFound = false
    this.isSpecialCookingBookUsed = false
    this.isCodeLockerFound = false
    this.isCodeLockerUsed = false
    this.isPictureFound = false
    this.isEnigmaUsed = false
    this.isSecurityCardFound = false
    this.isRoom1Found = true
    this.isRoom2Found = false
    this.isRoom3Found = false
    this.isRoom4Found = false
    this.isRoom5Found = false
    this.isRoom6Found = false
    this.isRoom7Found = false
    this.playerWon = false
    this.player.move(this.rooms[0], this)
    addEnabledActions(this)
    addEnabledItems(this)
    restartDrawMap(this)
    this.beginningAction()
    this.updateLocalData()
  }

  /**
   * Add all enabled items for current state /!\ alla parameters are set one by one because functions can't
   * @param {Object} jsonData - world data stored as a json object in local storage
   */
  getDataFromLocalStorage = (jsonData) => {
    const data = JSONfn.parse(jsonData)
    this.leaderBoard = data.world.leaderBoard
    this.timer = new Timer(this)
    this.notes = data.world.notes
    this.history = data.world.history
    this.isIronDoorOpened = data.world.isIronDoorOpened
    this.isIronKeyFound = data.world.isIronKeyFound
    this.isIronKeyUsed = data.world.isIronKeyUsed
    this.isGoldenKeyFound = data.world.isGoldenKeyFound
    this.isGoldenKeyUsed = data.world.isGoldenKeyUsed
    this.isGoldenDoorFound = data.world.isGoldenDoorFound
    this.isNoteBookFound = data.world.isNoteBookFound
    this.isLetterFound = data.world.isLetterFound
    this.isLetterUsed = data.world.isLetterUsed
    this.isSilverCoinFound = data.world.isSilverCoinFound
    this.isSilverCoinUsed = data.world.isSilverCoinUsed
    this.isBronzeKeyFound = data.world.isBronzeKeyFound
    this.isBronzeDoorFound = data.world.isBronzeDoorFound
    this.isBronzeDoorOpened = data.world.isBronzeDoorOpened
    this.cookedMeals = data.world.cookedMeals
    this.guards = data.world.guards
    this.lookedOnTheLeft = data.world.lookedOnTheLeft
    this.lookedOnTheRight = data.world.lookedOnTheRight
    this.isGoldCoinFound = data.world.isGoldCoinFound
    this.isGoldCoinUsed = data.world.isGoldCoinUsed
    this.isSmallBoxFound = data.world.isSmallBoxFound
    this.isSmallBoxUsed = data.world.isSmallBoxUsed
    this.isCookingBookFound = data.world.isCookingBookFound
    this.isCookingBookUsed = data.world.isCookingBookUsed
    this.isPostItFound = data.world.isPostItFound
    this.isPostItUsed = data.world.isPostItUsed
    this.isBackDoorFound = data.world.isBackDoorFound
    this.isBackDoorOpened = data.world.isBackDoorOpened
    this.booksRead = data.world.booksRead
    this.isTrappedDoorFound = data.world.isTrappedDoorFound
    this.isSpecialCookingBookFound = data.world.isSpecialCookingBookFound
    this.isSpecialCookingBookUsed = data.world.isSpecialCookingBookUsed
    this.isCodeLockerFound = data.world.isCodeLockerFound
    this.isCodeLockerUsed = data.world.isCodeLockerUsed
    this.isPictureFound = data.world.isPictureFound
    this.isEnigmaUsed = data.world.isEnigmaUsed
    this.isSecurityCardFound = data.world.isSecurityCardFound
    this.isRoom1Found = data.world.isRoom1Found
    this.isRoom2Found = data.world.isRoom2Found
    this.isRoom3Found = data.world.isRoom3Found
    this.isRoom4Found = data.world.isRoom4Found
    this.isRoom5Found = data.world.isRoom5Found
    this.isRoom6Found = data.world.isRoom6Found
    this.isRoom7Found = data.world.isRoom7Found
    this.playerWon = data.world.playerWon
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
    this.isGreenGuardInRoom7 = () => (
      this.player.currentRoom === this.rooms[6] &&
      !this.isGoldenKeyFound
    )
    this.rooms.forEach((room) => {
      if (room.name === data.world.player.currentRoom.name && !this.playerWon){
        this.player.move(room, this)
        return
      }
    })
    this.timer.play(this, data.world.timer.time)
  }

  updateLocalData = () => {
    const data = {
      world: this,
    }
    const jsonData = JSONfn.stringify(data)
    localStorage.setItem('dojoEscapeGameData', jsonData)
  }

  beginningAction = () => {
    this.timer.stopTimer()
    clearActions()
    setTimeout(() => {
      this.timer.play(this, 0)
      say(this, `${this.player.name} wakes up in the cell ...`)
      addEnabledActions(this)
      clearItems(this)
    }, 1000)
  }
}