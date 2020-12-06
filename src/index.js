import { World } from './Game/World'
import { say } from './Interface/Text'
import { addAction, clearActions, addEnabledActions } from './Interface/Action'
import { askPlayerName, drawMap } from './Interface/Map'
import { playerButton, resetButton, pauseButton, soundButton } from './Interface/Parameters'
import { clearItems, addEnabledItems } from './Interface/Item'

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

const main = () => {

  var world = new World({name: 'World'})

  // Check if data is already stored in local storage
  const jsonData = localStorage.getItem('dojoEscapeGameData')
  
  // Initialization of variables
  if (!jsonData) {
    var isIronDoorOpened = false
    var isIronKeyFound = false
    var isIronKeyUsed = false
    var isGoldenKeyFound = false
    var isGoldenKeyUsed = false
    var isGoldenDoorOpened = false
    var isRoom3Found = false
  }

  var room1 = world.createRoom({ 
    name: 'Room 1', 
    height: 2, 
    isDiscovered: () => true
  })
  var room2 = world.createRoom({ 
    name: 'Room 2', 
    xPos: 1,
    isDiscovered: () => true
  })
  var room3 = world.createRoom({
    name: 'Room 3',
    xPos: 1,
    yPos: 1,
    isDiscovered: () => isRoom3Found
  })
  var player = world.createPlayer('Player')
  var currentRoom = player.currentRoom

  // Check if data is already stored in local storage
  if (jsonData) {
    document.getElementById('ask-player-name-modal').style.display = 'none' // to avoid bug ...
    var data = JSONfn.parse(jsonData)
    player.name = data.world.player.name
    var isIronDoorOpened = data.isIronDoorOpened
    var isIronKeyFound = data.isIronKeyFound
    var isIronKeyUsed = data.isIronKeyUsed
    var isGoldenKeyFound = data.isGoldenKeyFound
    var isGoldenKeyUsed = data.isGoldenKeyUsed
    var isGoldenDoorOpened = data.isGoldenDoorOpened
    var isRoom3Found = data.isRoom3Found
    world.rooms.forEach((room) => {
      if (room.name === data.world.player.currentRoom.name){
        currentRoom = room
        return
      }
    })
    player.move(currentRoom)
  }

  // Game functions
  const resetGame = () => {
    isIronDoorOpened = false
    isIronKeyFound = false
    isIronKeyUsed = false
    isGoldenKeyFound = false
    isGoldenKeyUsed = false
    isGoldenDoorOpened = false
    isRoom3Found = false
    player.move(room1)
    clearActions()
    addEnabledActions(world)
    clearItems(world)
    addEnabledItems(world)
    drawMap(world)
    beginningAction()
  }

  const updateLocalData = () => {
    data = {
      world: world,
      isIronDoorOpened: isIronDoorOpened,
      isIronKeyFound: isIronKeyFound,
      isIronKeyUsed: isIronKeyUsed,
      isGoldenKeyFound: isGoldenKeyFound,
      isGoldenKeyUsed: isGoldenKeyUsed,
      isGoldenDoorOpened: isGoldenDoorOpened,
      isRoom3Found: isRoom3Found
    }
    const jsonData = JSONfn.stringify(data)
    localStorage.setItem('dojoEscapeGameData', jsonData)
  }

  const beginningAction = () => {
    say(`${player.name} enters the room ...`)
    setTimeout(() => {
      say(`... and finds an iron door on the right of the room.`)
    }, 1000)
  }

  // Create actions and items
  world.createAction({
    text: 'Search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found an iron key in the room`)
          isIronKeyFound = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      isIronKeyFound === false
    ),
    id: 'inventory-button'
  })

  world.createMoveAction(
    {
      text: 'Move to room 1',
      callback: () => updateLocalData(),
      isEnabled: () => player.currentRoom === room2,
    },
    room1
  )

  world.createMoveAction(
    {
      text: 'Move to room 3',
      callback: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            say(`${player.name} sees a golden door on the left`)
            updateLocalData()
            resolve()
          }, 1200)
        }),
      isEnabled: () => (
        player.currentRoom === room2 && 
        room3.isDiscovered()
      ),
    },
    room3
  )

  world.createAction({
    text: 'Search again the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found a gold key in the room`)
          isGoldenKeyFound = true
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 && 
      room3.isDiscovered() &&
      isGoldenKeyFound === false
    ),
  })

  world.createAction({
    text: 'Search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found a little trap door to another room`)
          isRoom3Found = true
          room3.updateColor()
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 && 
      !room3.isDiscovered()
    ),
  })

  world.createItem({
    name: 'gold key',
    isEnabled: () => (isGoldenKeyFound === true),
    isUsed: () => (false),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the gold key ...`)
        setTimeout(() => {
          if (player.currentRoom === room3) {
            say(`${player.name} found the exit 🎉`)
            isGoldenKeyUsed = true
          } else {
            say(`But the key didn't work on this door ...`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      })
  })

  world.createMoveAction(
    {
      text: 'Move to room 2',
      callback: () =>
        new Promise((resolve) => {
          updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        (player.currentRoom === room1 && isIronDoorOpened) || 
        player.currentRoom === room3
        ),
      world,
    },
    room2
  )

  world.createItem({
    name: 'iron key',
    isEnabled: () => (isIronKeyFound === true),
    isUsed: () => (isIronKeyUsed === true),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the iron key ...`)
        setTimeout(() => {
          if (player.currentRoom === room1) {
            isIronDoorOpened = true
            isIronKeyUsed = true
            say(`${player.name} opened the iron door`)
            clearActions()
            addEnabledActions(world)
          } else {
            say(`But the key didn't work on this door ...`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      })
  })

  addAction(
    world.createInventoryAction({
      text: (world.openInventory ? 'Close' : 'Open') + ' Inventory',
      isEnabled: () => true
    })
  )

  // Configuration of the parameters
  playerButton.onclick = () => askPlayerName(player)
  resetButton.onclick = () => resetGame()
  pauseButton.onclick = () => console.log('pause')

  // Beginning of the scenario ...
  if (!jsonData) {
    askPlayerName(player, beginningAction)
  }
  if (jsonData) {
    clearActions()
    addEnabledActions(world)
    addEnabledItems(world)
    drawMap(world)
  }
  
}

void main()
