import { World } from './Game/World'
import { say } from './Interface/Text'
import { clearActions, addEnabledActions } from './Interface/Action'
import { askPlayerName, drawMap, winGame, restartDrawMap } from './Interface/Map'
import { playerButton, resetButton, pauseButton, soundButton } from './Interface/Parameters'
import { clearItems, addEnabledItems, openNoteBook } from './Interface/Item'

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
  
  document.getElementById('note-book-modal').style.display = 'none' // to avoid bug ...
  
  var world = new World({name: 'World'})

  // Check if data is already stored in local storage
  const jsonData = localStorage.getItem('dojoEscapeGameData')

  // Create rooms for the world
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

  // Create the player
  var player = world.createPlayer('Player')

  // Check if data is already stored in local storage
  if (jsonData) {
    document.getElementById('ask-player-name-modal').style.display = 'none' // to avoid bug ...
    var data = JSONfn.parse(jsonData)
    player.name = data.world.player.name
    world.notes = data.world.notes
    world.isIronDoorOpened = data.world.isIronDoorOpened
    world.isIronKeyFound = data.world.isIronKeyFound
    world.isIronKeyUsed = data.world.isIronKeyUsed
    world.isGoldenKeyFound = data.world.isGoldenKeyFound
    world.isGoldenKeyUsed = data.world.isGoldenKeyUsed
    world.isGoldenDoorFound = data.world.isGoldenDoorFound
    world.isNoteBookFound = data.world.isNoteBookFound
    world.isLetterFound = data.world.isLetterFound
    world.isLetterUsed = data.world.isLetterUsed
    world.isSilverCoinFound = data.world.isSilverCoinFound
    world.isBronzeKeyFound = data.world.isBronzeKeyFound
    world.isBronzeDoorFound = data.world.isBronzeDoorFound
    world.isBronzeDoorOpened = data.world.isBronzeDoorOpened
    world.cookedMeals = data.world.cookedMeals
    world.guards = data.world.guards
    world.lookedOnTheLeft = data.world.lookedOnTheLeft
    world.lookedOnTheRight = data.world.lookedOnTheRight
    world.isGoldCoinFound = data.world.isGoldCoinFound
    world.isGoldCoinUsed = data.world.isGoldCoinUsed
    world.isSmallBoxFound = data.world.isSmallBoxFound
    world.isSmallBoxUsed = data.world.isSmallBoxUsed
    world.isCookingBookFound = data.world.isCookingBookFound
    world.isCookingBookUsed = data.world.isCookingBookUsed
    world.isPostItFound = data.world.isPostItFound
    world.isPostItUsed = data.world.isPostItUsed
    world.isBackDoorFound = data.world.isBackDoorFound
    world.isBackDoorOpened = data.world.isBackDoorOpened
    world.booksRead = data.world.booksRead
    world.isTrappedDoorFound = data.world.isTrappedDoorFound
    world.isSpecialCookingBookFound = data.world.isSpecialCookingBookFound
    world.isSpecialCookingBookUsed = data.world.isSpecialCookingBookUsed
    world.isCodeLockerFound = data.world.isCodeLockerFound
    world.isCodeLockerUsed = data.world.isCodeLockerUsed
    world.isPictureFound = data.world.isPictureFound
    world.isSecurityCardFound = data.world.isSecurityCardFound
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
    world.notes = ''
    world.isIronDoorOpened = false
    world.isIronKeyFound = false
    world.isIronKeyUsed = false
    world.isGoldenKeyFound = false
    world.isGoldenKeyUsed = false
    world.isGoldenDoorFound = false
    world.isNoteBookFound = false
    world.isLetterFound = false
    world.isLetterUsed = false
    world.lookedOnTheLeft = false
    world.lookedOnTheRight = false
    world.isSilverCoinFound = false
    world.isBronzeKeyFound = false
    world.isBronzeDoorFound = false
    world.isBronzeDoorOpened = false
    world.cookedMeals = {burger: 0, pasta: 0, cake: 0, specialMeal: 0}
    world.guards = {
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
    world.isGoldCoinFound = false
    world.isGoldCoinUsed = false
    world.isSmallBoxFound = false
    world.isSmallBoxUsed = false
    world.isCookingBookFound = false
    world.isCookingBookUsed = false
    world.isPostItFound = false
    world.isPostItUsed = false
    world.isBackDoorFound = false
    world.isBackDoorOpened = false
    world.booksRead = 0
    world.isTrappedDoorFound = false
    world.isSpecialCookingBookFound = false
    world.isSpecialCookingBookUsed = false
    world.isCodeLockerFound = false
    world.isCodeLockerUsed = false
    world.isPictureFound = false
    world.isSecurityCardFound = false
    world.isRoom1Found = true
    world.isRoom2Found = false
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
    updateLocalData()
  }

  const updateLocalData = () => {
    data = {
      world: world,
    }
    const jsonData = JSONfn.stringify(data)
    localStorage.setItem('dojoEscapeGameData', jsonData)
  }

  const beginningAction = () => {
    clearActions()
    setTimeout(() => {
      say(`${player.name} wakes up in the cell ...`)
      addEnabledActions(world)
    }, 1000)
  }

  // Create actions and items
  // inventory
  world.createInventoryAction({
    text: 'Close Inventory',
    isEnabled: () => true
  })

  // move actions
  // room 1
  world.createMoveAction(
    {
      text: 'Return to the Cell', 
      callback: () => 
      new Promise((resolve) => {
        updateLocalData()
        resolve()
      }),
      isEnabled: () => (
        player.currentRoom === room2
      ),
    },
    room1
  )

  // room 2
  world.createMoveAction(
    {
      text: 'Move to the Corridor', 
      callback: () =>
        new Promise((resolve) => {
          updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        (player.currentRoom === room1 &&
          room2.isDiscovered() && 
          world.isIronDoorOpened) || 
        player.currentRoom === room3 ||
        player.currentRoom === room5 ||
        player.currentRoom === room6
      ),
    },
    room2
  )

  // room 3
  world.createMoveAction(
    {
      text: 'Move to the Vestiary', 
      callback: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            say(`${player.name} sees a lot of stuffs in the boxes`)
            updateLocalData()
            resolve()
          }, 1000)
        }),
      isEnabled: () => (
        (player.currentRoom === room2 && 
        room3.isDiscovered() && 
        world.guards.vestiary.chat > 0) ||
        player.currentRoom === room4
      ),
    },
    room3
  )

  // room 4
  world.createMoveAction(
    {
      text: 'Go to the Restrooms', 
      callback: () =>
        new Promise((resolve) => {
          updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        player.currentRoom === room3 && 
        room4.isDiscovered()
      ),
    },
    room4
  )
  
  // room 5
  world.createMoveAction(
    {
      text: 'Go inside the Kitchen', 
      callback: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            say(`This kitchen is really messy ...`)
            updateLocalData()
            resolve()
          }, 1500)
        }),
      isEnabled: () => (
        player.currentRoom === room2 && 
        room5.isDiscovered() &&
        world.guards.vestiary.chat > 1 &&
        world.isBronzeKeyUsed
      ),
    },
    room5
  )

  // room 6
  world.createMoveAction(
    {
      text: 'Enter the Library', 
      callback: () =>
        new Promise((resolve) => {
          updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        player.currentRoom === room2 && 
        room6.isDiscovered() &&
        world.guards.library.cake > 1 &&
        world.guards.vestiary.burger > 0 &&
        world.guards.vestiary.pasta > 0 &&
        world.guards.vestiary.sport > 0 &&
        world.guards.library.chat === -1 &&
        world.isPostItFound
      ),
    },
    room6
  )

  // room 7
  world.createMoveAction(
    {
      text: 'Open the backdoor and go outside', 
      callback: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            say(`A guard is approaching ...`)
            updateLocalData()
            resolve()
          }, 1200)
        }),
      isEnabled: () => (
        player.currentRoom === room6 && 
        room7.isDiscovered() && 
        world.isSecurityCardFound
      ),
    },
    room3
  )

  // actions
  // actions in room 1
  world.createAction({
    text: 'Look around',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks around the room ...`)
        setTimeout(() => {
          say(`${player.name} found a note book on the desk and saw the Corridor throw the door of the Cell`)
          world.isNoteBookFound = true
          world.isRoom2Found = true
          drawMap(world)
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      !world.isNoteBookFound &&
      !world.isIronKeyFound
    ),
  })

  world.createAction({
    text: 'Search inside the furniture',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches something in the furniture ...`)
        setTimeout(() => {
          say(`${player.name} found an iron key in a drawer`)
          world.isIronKeyFound = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      world.isNoteBookFound &&
      !world.isIronKeyFound
    ),
  })

  world.createAction({
    text: 'Search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found a piece of paper in the room ... But there is nothing written on it.`)
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      world.isNoteBookFound &&
      !world.isLetterFound
    ),
  })

  world.createAction({
    text: 'Search under the bed',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks under the bed ...`)
        setTimeout(() => {
          say(`${player.name} found a letter under the bed.`)
          world.isLetterFound = true
          updateLocalData()
          resolve()
        }, 1500)
      }),
    isEnabled: () => (
      player.currentRoom === room1 && 
      world.isNoteBookFound &&
      !world.isLetterFound
    ),
  })

  world.createAction({
    text: 'Lay in the bed and take a nap',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} is sleeping ...`)
        setTimeout(() => {
          say(`${player.name} wakes up and feels better ! :)`)
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 &&
      world.isNoteBookFound
    ),
  })

  world.createAction({
    text: 'Search again the entire room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the room ...`)
        setTimeout(() => {
          say(`${player.name} found silver coins under the furniture !`)
          world.isSilverCoinFound = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 &&
      world.isRoom4Found
    ),
  })

  // actions in room 2
  world.createAction({
    text: 'Look on the left of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks on the left ...`)
        setTimeout(() => {
          say(`${player.name} saw a guard in front of a door`)
          world.lookedOnTheLeft = true
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.vestiary.chat === 0
    ),
  })

  world.createAction({
    text: 'Look on the right of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks on the right ...`)
        setTimeout(() => {
          say(`${player.name} saw a guard in front of a door`)
          world.lookedOnTheRight = true
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.library.chat === 0
    ),
  })

  world.createAction({
    text: 'Go to the end of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} walks forward to the end of the corridor ...`)
        setTimeout(() => {
          say(`${player.name} found a strong door at the end of the corridor`)
          world.isBronzeDoorFound = true
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.vestiary.chat > 0 &&
      !world.isBronzeDoorFound
    ),
  })

  world.createAction({
    text: 'Chat with the guard on the left',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} talks with the guard on the left ...`)
        setTimeout(() => {
          switch (world.guards.vestiary.chat) {
            case 0:
              say(`Guard : Hello ${player.name}, you can go to the vestiary just behind me, it's open all day long and you can practice sport there.`)
              world.isRoom3Found = true
              drawMap(world)
              world.guards.vestiary.chat = 1
              break
            case 1:
              if (world.isBronzeDoorFound) {
                say(`Guard : Hello again ${player.name}, ahah do you want to open the strong door ? You can't, because I have the key and I won't give it to you :)`)
                world.guards.vestiary.chat = 2
              }
              else {
                say(`Guard : Hello again ${player.name}, you can explore the corridor as you want.`)
              }
              break
            case 2:
              if (world.cookedMeals.burger === 0) {
                say(`Guard : Hi my friend, I'm hungry, don't you ?`)
              }
              else {
                say(`Guard : Hi my friend, do you really have some cooked some burgers ?? Can you give me one please ?`)
                world.cookedMeals.burger --
                world.guards.vestiary.burger ++
                world.guards.vestiary.chat = 3
              }
              break
            case 3:
              say(`Guard : Thank you for the burger !`)
              world.guards.vestiary.chat = 4
              break
            case 4:
              say(`Guard : I think you should talk with other guards now ...`)
              world.guards.vestiary.chat ++
              break
            case 5:
              say(`Guard : I think you should talk with other guards now ...`)
              world.guards.vestiary.chat ++
              break
            case 6:
              say(`Guard : Stop talking to me.`)
              world.guards.vestiary.chat = -1
              break
            default:
              say(`Guard : Come later, I'm busy.`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.vestiary.chat >= 0 && 
      world.lookedOnTheLeft
    ),
  })

  world.createAction({
    text: 'Chat with the guard on the right',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} talks with the guard on the right ...`)
        setTimeout(() => {
          switch (world.guards.library.chat) {
            case 0:
              say(`Guard : Hello ${player.name}, you're not allowed to go to the library.`)
              world.isRoom6Found = true
              world.guards.library.chat = 1
              break
            case 1:
              if (world.cookedMeals.burger > 0 && world.cookedMeals.cake === 0) {
                say(`Guard : Hello again ${player.name}, oh thanks for this burger, I see that you are a good cooker, but do you know how to cook a cake ?`)
              }
              if (world.cookedMeals.cake > 0) {
                say(`Guard : Hello again ${player.name}, indeed you know how to cook a cake. Can you give me this cake ?`)
                world.guards.library.chat = 2
                world.cookedMeals.cake --
                world.guards.library.cake ++
              }
              else {
                say(`Guard : Go ahead, I'm hungry.`)
              }
              break
            case 2:
              if (world.cookedMeals.cake === 0) {
                say(`Guard : I would like to have another cake like the other.`)
              }
              if (world.cookedMeals.cake > 0) {
                say(`Guard : Yes give me this cake please, I loved the first one !`)
                world.guards.library.chat = 3
                world.cookedMeals.cake --
                world.guards.library.cake ++
              }
              break
            case 3:
              say(`Guard : Thanks for the food ! But It won't be enough to let you go in the library ahah ...`) // give a silver coin to pass
              break
            case 4:
              say(`Guard : Ok, I will leave and let you enter the library ... The guard leaves the corridor.`)
              world.guards.library.chat = -1
              break
            default:
              say(`Guard : Come later, I'm busy.`)
          }
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.vestiary.chat !== 0 &&
      world.lookedOntheRight &&
      world.guards.library.chat >= 0
    ),
  })

  // actions in room 3
  world.createAction({
    text: 'Chat with the guard here',
    callback: () =>
      new Promise((resolve) => {
        say(`Guard : Yes, I followed you to be sure you were not trying to steal coins in these boxes ...`)
        setTimeout(() => {
          say(`Guard : Don't steal, please, I'll go running outdoor. However, you can use the restrooms of this vestiary.`)
          world.guards.vestiary.sport = 1
          world.isRoom4Found = true
          drawMap(world)
          updateLocalData()
          resolve()
        }, 6000)
      }),
    isEnabled: () => (
      player.currentRoom === room3 &&
      world.guards.vestiary.sport === 0 &&
      world.guards.vestiary.chat >= 2
    ),
  })

  world.createAction({
    text: 'Search in the stuffs here',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches some coins ...`)
        setTimeout(() => {
          say(`${player.name} found some silver coins`)
          world.isSilverCoinFound = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room3 &&
      world.guards.vestiary.sport > 0
    ),
  })

  // actions in the room 4
  world.createAction({
    text: 'Search for interresting stuffs here',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches ...`)
        setTimeout(() => {
          if (world.isBronzeDoorFound && !world.isBronzeKeyFound) {
            say(`${player.name} found the bronze key of the guard on the floor`)
            world.isBronzeKeyFound = true
          }
          else {
            say(`${player.name} found nothing interresting`)
          }
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room4 &&
      world.guards.vestiary.sport > 0 &&
      world.guards.vestiary.chat >= 2 &&
      !world.isBronzeKeyFound
    ),
  })

  // actions in room 5
  world.createAction({
    text: 'Cook something',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks something tasty ...`)
        setTimeout(() => {
          if (!world.isCookingBookUsed) {
            say(`${player.name} cooked pasta`)
            world.cookedMeals.pasta ++
          }
          if (world.isCookingBookUsed) {
            const random = Math.floor(Math.random()*5)
            if (random <= 1) {
              say(`${player.name} cooked pasta`)
              world.cookedMeals.pasta ++
            }
            else if (random <= 3) {
              say(`${player.name} cooked a burger`)
              world.cookedMeals.burger ++
            }
            else {
              say(`${player.name} cooked a cake`)
              world.cookedMeals.cake ++
            }
          }
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5
    ),
  })

  world.createAction({
    text: 'Cook something special',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks an awsome traditional meal thanks to the book found in the library ...`)
        setTimeout(() => {
          say(`${player.name} cooked the special meal.`)
          world.cookedMeals.specialMeal ++
          world.isSpecialCookingBookUsed = true
          updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      world.isSpecialCookingBookUsed &&
      world.cookedMeals.specialMeal === 0
    ),
  })

  world.createAction({
    text: 'Search for interresting stuffs',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} search for stuffs in the Kitchen ...`)
        setTimeout(() => {
          if (!world.isCookingBookFound) {
            say(`${player.name} found a cooking book`)
            world.isCookingBookFound = true
          }
          if (world.isCookingBookFound && !world.isPostItFound) {
            say(`${player.name} found a post-it with a reference to a special cooking book`)
            world.isPostItFound = true
          }
          if (world.isCookingBookFound && world.isPostItFound && !world.isSmallBoxFound) {
            say(`${player.name} found a small box locked with a code`)
            world.isSmallBoxFound = true
          }
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      !(world.isCookingBookFound && 
        world.isPostItFound && 
        world.isSmallBoxFound)
    ),
  })

  world.createAction({
    text: 'Look around',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks around ...`)
        setTimeout(() => {
          say(`${player.name} found a backdoor in this room`)
          world.isRoom7Found = true
          world.isBackDoorFound
          drawMap(world)
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      !world.isBackDoorFound
    ),
  })

  world.createAction({
    text: 'Try to open the backdoor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} tries to open the door ...`)
        setTimeout(() => {
          say(`But the door is locked and needs a security card to be opened.`)
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      world.isBackDoorFound
    ),
  })

  // actions in room 6
  world.createAction({
    text: 'Read a book',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} chooses a book to read in the library ...`)
        setTimeout(() => {
          if (world.booksRead < 10 || world.cookedMeals.specialMeal !== -1) {
            say(`${player.name} read a book`)
            world.booksRead ++
          }
          else {
            say(`${player.name} activated a secret mechanism and opened a trapped door in the library !`)
            world.isTrappedDoorFound = true
          }
          updateLocalData()
          resolve()
        }, 1500)
      }),
    isEnabled: () => (
      player.currentRoom === room6
    ),
  })

  world.createAction({
    text: 'Search the book with the reference written on the post-it note',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the book in the library ...`)
        setTimeout(() => {
          say(`${player.name} found the book !`)
          world.isSpecialCookingBookFound = true
          updateLocalData()
          resolve()
        }, 2500)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      !world.isSpecialCookingBookFound
    ),
  })

  world.createAction({
    text: 'Look around and search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} chooses a book to read in the library ...`)
        setTimeout(() => {
          if (!world.isCodeLockerFound) {
            say(`${player.name} found a box locked with a code.`)
            world.isCodeLockerFound = true
          }
          else {
            if (world.booksRead < 10) {
              say(`${player.name} found nothing else that seemed interresting ... you should read a book to console yourself :)`)
              world.booksRead ++
            }
            else {
              say(`${player.name} found an old picture of the guards between the books.`)
              world.isPictureFound = true
            }
          } 
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      !world.isPictureFound
    ),
  })

  world.createAction({
    text: 'Explore the small room behing the trapped door',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} goes through the trapped door to see what's in this tiny secret room ...`)
        setTimeout(() => {
          say(`${player.name} sees some strange paintings on the walls ...`)
        }, 2000)
        setTimeout(() => {
          say(`${player.name} sees strange objects : old pistols and old maps in the furniture ...`)
        }, 4000)
        setTimeout(() => {
          say(`${player.name} found a gold coin in a drawer !`)
          world.isGoldCoinFound = true
          updateLocalData()
          resolve()
        }, 6000)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      world.isTrappedDoorFound &&
      !world.isGoldCoinFound
    ),
  })

  // actions in room 7
  world.createAction({
    text: 'Look around',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks around ...`)
        setTimeout(() => {
            say(`${player.name} saw a golden portal behind the guard.`)
            world.isGoldenDoorFound
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room7 &&
      !world.isGoldenDoorFound
    ),
  })

  world.createAction({
    text: 'Talk to the guard',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} tries to talk to the guard ...`)
        setTimeout(() => {
          switch (world.guards.outdoor.chat) {
            case 0:
              say(`Guard : What are you doing ? Don't try to escape yourself ! You're not supposed to be here !`)
              world.guards.outdoor.chat = 1
              break
            case 1:
              if (world.guards.outdoor.specialMeal !== -1 && world.guards.outdoor.goldCoins !== -1) {
                say(`Guard : What are you doing ? Don't try to escape yourself ! You're not supposed to be here !`)
              }
              else {
                say(`Guard : I must admit that this traditional meal and overall this gold coin have value ... Ok for this time I will let you go out ... Take this golden key !`)
                world.isGoldenKeyFound = true
              }
          }
          updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room7 &&
      !world.isGoldenKeyFound
    ),
  })

  /*world.createAction({
    text: 'Try to corrupt the guard with the traditional meal',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} gives the awsome traditional meal cooked in the Kitchen to the guard outdoor ...`)
        setTimeout(() => {
          say(`Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
          world.cookedMeals.specialMeal = -1
          world.guards.outdoor.specialMeal = 1
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room7 &&
      world.cookedMeals.specialMeal === 1 &&
      world.guards.outdoor.specialMeal === 0
    ),
  })

  world.createAction({
    text: 'Try to corrupt the guard with the gold coin',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} gives the gold coin to the guard outdoor ...`)
        setTimeout(() => {
          say(`Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
          world.cookedMeals.specialMeal = -1
          world.guards.outdoor.specialMeal = 1
          updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room7 &&
      world.isGoldCoinFound &&
      world.guards.outdoor.goldCoins === 0
    ),
  })*/

  // action to win the game
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
        player.currentRoom === room7 &&
        world.isGoldenDoorFound &&
        world.isGoldenKeyUsed &&
        world.guards.outdoor.goldCoins === 1 &&
        world.guards.outdoor.specialMeal === 1
      ),
    }
  )
  
  // items
  world.createItem({
    name: 'note book',
    isEnabled: () => (world.isNoteBookFound),
    isUsed: () => false,
    callback: () => 
      new Promise((resolve) => {
        openNoteBook(world, updateLocalData)
        resolve()
      })
  })

  world.createItem({
    name: 'iron key',
    isEnabled: () => (world.isIronKeyFound),
    isUsed: () => (world.isIronKeyUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the iron key ...`)
        setTimeout(() => {
          if (player.currentRoom === room1) {
            world.isIronDoorOpened = true
            world.isIronKeyUsed = true
            say(`${player.name} opened the door of the Cell`)
            clearActions()
            addEnabledActions(world)
            updateLocalData()
          } else {
            say(`But the key didn't work on this door ...`)
          }
          resolve()
        }, 1000)
      }),
  })

  // items
  world.createItem({
    name: 'letter',
    isEnabled: () => world.isLetterFound,
    isUsed: () => world.isLetterUsed,
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} reads the letter ...`)
        alert('letter gives enigma for code 1234')
        resolve()
      })
  })

  world.createItem({
    name: 'silver coins',
    isEnabled: () => (world.isSilverCoinFound),
    isUsed: () => (world.isSilverCoinUsed),
    callback: () => 
      new Promise((resolve) => {
        setTimeout(() => {
          if (player.currentRoom === room2 && world.guards.library.chat === 3 && world.guards.library.silverCoins === 0) {
            say(`${player.name} gives several silver coins to the guard on the right (in front of the Library).`)
            world.guards.library.silverCoins = 1
            world.guards.library.chat = 4
            clearActions()
            addEnabledActions(world)
            updateLocalData()
          } else {
            say(`These coins are useless in this situation ...`)
          }
          resolve()
        }, 500)
      }),
  })

  world.createItem({
    name: 'bronze key',
    isEnabled: () => (world.isBronzeKeyFound),
    isUsed: () => (world.isBronzeKeyUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} tries to use the bronze key ...`)
        setTimeout(() => {
          if (player.currentRoom === room2 && world.isBronzeDoorFound) {
            say(`${player.name} managed to open the strong door at the end of the corridor thanks to the bronze key !`)
            world.isBronzeKeyUsed = true
            world.isBronzeDoorOpened = true
            world.isRoom5Found = true
            drawMap(world)
            clearActions()
            addEnabledActions(world)
            updateLocalData()
          } else {
            say(`The bronze key is not useful in this room ...`)
          }
          resolve()
        }, 1500)
      }),
  })

  world.createItem({
    name: 'small box with code',
    isEnabled: () => (world.isSmallBoxFound),
    isUsed: () => (world.isSmallBoxUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} opens the small box ...`)
        setTimeout(() => {
          alert('add a modal to ask the code 1234 to player')
          say(`A document with on enigma was in the small box found in the Kitchen.`)
          world.isSmallBoxUsed = true
          world.isLetterUsed = true
          updateLocalData()
          resolve()
        }, 500)
      }),
  })

  world.createItem({
    name: 'enigma',
    isEnabled: () => (world.isSmallBoxUsed),
    isUsed: () => (world.isEnigmaUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} reads the enigma ...`)
        alert('enigma gives the code 5678')
        resolve()
      }),
  })

  world.createItem({
    name: 'cooking book',
    isEnabled: () => (world.isCookingBookFound),
    isUsed: () => (world.isCookingBookUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} reads the cooking book ...`)
        setTimeout(() => {
            say(`${player.name} learnt how to cook burgers and cakes !`)
            world.isCookingBookUsed = true
            updateLocalData()
          resolve()
        }, 500)
      }),
  })

  world.createItem({
    name: 'post-it note',
    isEnabled: () => (world.isPostItFound),
    isUsed: () => (world.isPostItUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`The post-it contains a note which is a reference to a special book for a traditional recipe ...`)
        resolve()
      }),
  })

  world.createItem({
    name: 'pastas',
    isEnabled: () => (world.cookedMeals.pasta !== 0),
    isUsed: () => (world.cookedMeals.pasta === -1),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} has ${world.cookedMeals.pasta} plates of pasta !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'burgers',
    isEnabled: () => (world.cookedMeals.burger !== 0),
    isUsed: () => (world.cookedMeals.burger === -1),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} has ${world.cookedMeals.burger} burgers ready to eat !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'cakes',
    isEnabled: () => (world.cookedMeals.cake !== 0),
    isUsed: () => (world.cookedMeals.cake === -1),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} has ${world.cookedMeals.cake} cakes hot and smelling good !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'traditional meal',
    isEnabled: () => (world.cookedMeals.specialMeal !== 0),
    isUsed: () => (world.cookedMeals.specialMeal === -1),
    callback: () => 
      new Promise((resolve) => {
        if (player.currentRoom === room7 &&
          world.cookedMeals.specialMeal === 1 &&
          world.guards.outdoor.specialMeal === 0) {
          say(`${player.name} gives the awsome traditional meal cooked in the Kitchen to the guard outdoor ...`)
          setTimeout(() => {
            say(`Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
            world.cookedMeals.specialMeal = -1
            world.guards.outdoor.specialMeal = 1
            clearActions()
            addEnabledActions(world)
            updateLocalData()
            resolve()
          }, 1000)
        }
        else {
          say(`${player.name} has cooked an awsome traditional meal that looks really tasty !`)
        }
        resolve()
      }),
  })

  world.createItem({
    name: 'traditional cooking book',
    isEnabled: () => (world.isSpecialCookingBookFound),
    isUsed: () => (world.isSpecialCookingBookUsed),
    callback: () => 
      new Promise((resolve) => {
        if (player.currentRoom === room5) {
          say(`${player.name} learnt how to cook the traditional meal !`)
          world.isSpecialCookingBookUsed = true
          updateLocalData()
        }
        else {
          say(`${player.name} needs to be in the Kitchen to learn cooking ...`)
        }
        
        resolve()
      }),
  })

  world.createItem({
    name: 'code locker',
    isEnabled: () => (world.isCodeLockerFound),
    isUsed: () => (world.isCodeLockerUsed),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} tries a code ...`)
        alert('modal to ask the code 5678 to the player')
        updateLocalData()
        resolve()
      }),
  })

  world.createItem({
    name: 'gold coin',
    callback: () =>
      new Promise((resolve) => {
        if (player.currentRoom === room7 &&
          world.isGoldCoinFound &&
          world.guards.outdoor.goldCoins === 0) {
          say(`${player.name} gives the gold coin to the guard outdoor ...`)
          setTimeout(() => {
            say(`Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
            world.cookedMeals.specialMeal = -1
            world.guards.outdoor.specialMeal = 1
            clearActions()
            addEnabledActions(world)
            updateLocalData()
            resolve()
          }, 1000)
        }
      }),
    isEnabled: () => world.isGoldCoinFound,
    isUsed: () => world.isGoldCoinUsed
  })

  world.createItem({
    name: 'gold key',
    isEnabled: () => world.isGoldenKeyFound,
    isUsed: () => world.isGoldenKeyUsed,
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the gold key ...`)
        setTimeout(() => {
          if (player.currentRoom === room7) {
            say(`${player.name} opened a portal outdoor and found the exit !`)
            world.isGoldenKeyUsed = true
            clearActions()
            addEnabledActions(world)
            updateLocalData()
          } else {
            say(`But the key was useless in this room ...`)
          }
          resolve()
        }, 1000)
      }),
  })

  // Configuration of the parameters
  playerButton.onclick = () => askPlayerName(player, updateLocalData)
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
  updateLocalData()
}

void main()
