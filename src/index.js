import { World } from './Game/World'
import { say } from './Interface/Text'
import { addAction, clearActions, addEnabledActions } from './Interface/Action'
import { askPlayerName, drawMap, winGame, restartDrawMap } from './Interface/Map'
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
  
  // Initialization of variables => variables in world
  /*if (!jsonData) {
    var isIronDoorOpened = false
    var isIronKeyFound = false
    var isIronKeyUsed = false
    var isGoldenKeyFound = false
    var isGoldenKeyUsed = false
    var isGoldenDoorOpened = false
    var isRoom3Found = false
    var isRoom4Found = false
    var isRoom5Found = false
    var isRoom6Found = false
    var isRoom7Found = false
  }*/
  /*
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
  })*/

  var room1 = world.createRoom({
    index: 1,
    name: 'Cell', 
    xPos: 2,
    isDiscovered: () => world.isRoom1Found
  })
  var room2 = world.createRoom({
    index: 2,
    name: 'Corridor', 
    xPos: 1,
    height: 2,
    isDiscovered: () => world.isRoom2Found
  })
  var room3 = world.createRoom({ 
    index: 3,
    name: 'Vestiary', 
    xPos: 2,
    yPos: 1,
    isDiscovered: () => world.isRoom3Found
  })
  var room4 = world.createRoom({ 
    index: 4,
    name: 'Restrooms',
    xPos: 2,
    yPos: 2,
    isDiscovered: () => world.isRoom4Found
  })
  var room5 = world.createRoom({ 
    index: 5,
    name: 'Kitchen', 
    xPos: 1,
    yPos: 2,
    isDiscovered: () => world.isRoom5Found
  })
  var room6 = world.createRoom({ 
    index: 6,
    name: 'Library', 
    height: 2,
    isDiscovered: () => world.isRoom6Found
  })
  var room7 = world.createRoom({ 
    index: 7,
    name: 'Outdoor', 
    yPos: 2,
    isDiscovered: () => world.isRoom7Found
  })

  var player = world.createPlayer('Player')

  // Check if data is already stored in local storage
  if (jsonData) {
    document.getElementById('ask-player-name-modal').style.display = 'none' // to avoid bug ...
    var data = JSONfn.parse(jsonData)
    player.name = data.world.player.name
    world.isIronDoorOpened = data.world.isIronDoorOpened
    world.isIronKeyFound = data.world.isIronKeyFound
    world.isIronKeyUsed = data.world.isIronKeyUsed
    world.isGoldenKeyFound = data.world.isGoldenKeyFound
    world.isGoldenKeyUsed = data.world.isGoldenKeyUsed
    world.isGoldenDoorOpened = data.world.isGoldenDoorOpened
    world.isRoom1Found = data.world.isRoom1Found
    world.isRoom2Found = data.world.isRoom2Found
    world.isRoom3Found = data.world.isRoom3Found
    world.isRoom4Found = data.world.isRoom4Found
    world.isRoom5Found = data.world.isRoom5Found
    world.isRoom6Found = data.world.isRoom6Found
    world.isRoom7Found = data.world.isRoom7Found
    world.rooms.forEach((room) => {
      if (room.name === data.world.player.currentRoom.name){
        player.move(room)
        return
      }
    })
  }

  // Game functions
  // reset world parameters => check if this section is the same as the default world parameters
  const resetGame = () => {
    world.isIronDoorOpened = false
    world.isIronKeyFound = false
    world.isIronKeyUsed = false
    world.isGoldenKeyFound = false
    world.isGoldenKeyUsed = false
    world.isGoldenDoorOpened = false
    world.isRoom1Found = true
    world.isRoom2Found = true
    world.isRoom3Found = false
    world.isRoom4Found = false
    world.isRoom5Found = false
    world.isRoom6Found = false
    world.isRoom7Found = false
    player.move(room1)
    clearItems(world)
    addEnabledItems(world)
    restartDrawMap(world)
    beginningAction()
  }

  const updateLocalData = () => {
    data = {
      world: world,
    }
    const jsonData = JSONfn.stringify(data)
    localStorage.setItem('dojoEscapeGameData', jsonData)
  }

  const beginningAction = () => {
    say(`${player.name} enters the room ...`)
    setTimeout(() => {
      say(`... and finds an iron door on the right of the room.`)
      clearActions()
      addEnabledActions(world)
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
          world.isIronKeyFound = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      world.isIronKeyFound === false
    ),
  })

  world.createMoveAction(
    {
      text: 'Move to room 1',
      callback: () => 
      new Promise((resolve) => {
        updateLocalData()
        resolve()
      }),
      isEnabled: () => (
        player.currentRoom === room2 &&
        room3.isDiscovered()
      ),
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
          world.isGoldenKeyFound = true
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 && 
      room3.isDiscovered() &&
      world.isGoldenKeyFound === false
    ),
  })

  world.createAction({
    text: 'Search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found a little trap door to another room`)
          world.isRoom3Found = true
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
    isEnabled: () => (
      world.isGoldenKeyFound === true
    ),
    isUsed: () => (
      world.isGoldenKeyUsed
    ),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the gold key ...`)
        setTimeout(() => {
          if (player.currentRoom === room3) {
            say(`${player.name} found the exit !`)
            world.isGoldenKeyUsed = true
            clearActions()
            addEnabledActions(world)
          } else {
            say(`But the key didn't work on this door ...`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      }),
  })

  world.createAction(
    {
      text: 'Escape',
      callback: () =>
        new Promise((resolve) => {
          say(`${player.name} escaped and won the game ! 🎉`)
          setTimeout(() => {
            winGame(player)
            updateLocalData()
            resolve()
          }, 500)
        }),
      isEnabled: () => (
        world.isGoldenKeyUsed
      ),
    }
  )

  world.createMoveAction(
    {
      text: 'Move to room 2',
      callback: () =>
        new Promise((resolve) => {
          updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        (player.currentRoom === room1 &&
          world.isIronDoorOpened) || 
        player.currentRoom === room3
      ),
    },
    room2
  )

  world.createItem({
    name: 'iron key',
    isEnabled: () => (world.isIronKeyFound === true),
    isUsed: () => (world.isIronKeyUsed === true),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the iron key ...`)
        setTimeout(() => {
          if (player.currentRoom === room1) {
            world.isIronDoorOpened = true
            world.isIronKeyUsed = true
            say(`${player.name} opened the iron door`)
            clearActions()
            addEnabledActions(world)
          } else {
            say(`But the key didn't work on this door ...`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      }),
  })

  world.createInventoryAction({
    text: (world.openInventory ? 'Close' : 'Open') + ' Inventory',
    isEnabled: () => true
  })

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
