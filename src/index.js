import { World } from './Game/World'
import { say } from './Interface/Text'
import { clearActions, addEnabledActions } from './Interface/Action'
import { askPlayerName, drawMap, restartDrawMap, drawGuard } from './Interface/Map'
import { initializeParameters, displayLetterModal, displayEnigmaModal, displayCodeModal } from './Interface/Parameters'
import { clearItems, addEnabledItems, openNoteBook } from './Interface/Item'

const main = () => {
    
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
    world.getDataFromLocalStorage(jsonData)
    player = world.player
  }

  // Create actions and items
  // inventory
  world.createInventoryAction({
    text: 'Open Inventory',
    isEnabled: () => true
  })

  // move actions
  // room 1
  world.createMoveAction(
    {
      text: 'Return to the Cell', 
      callback: () => 
      new Promise((resolve) => {
        world.updateLocalData()
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
          world.updateLocalData()
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
            say(`${player.name} sees a lot of stuff in the boxes`)
            world.updateLocalData()
            resolve()
          }, 500)
        }),
      isEnabled: () => (
        (player.currentRoom === room2 && 
        room3.isDiscovered() && 
        world.guards.vestiary.chat !== 0) ||
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
          world.updateLocalData()
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
            world.updateLocalData()
            resolve()
          }, 500)
        }),
      isEnabled: () => (
        (player.currentRoom === room2 && 
        room5.isDiscovered() &&
        world.isBronzeDoorOpened) ||
        player.currentRoom === room7
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
          world.updateLocalData()
          resolve()
        }),
      isEnabled: () => (
        player.currentRoom === room2 && 
        room6.isDiscovered() &&
        world.guards.library.chat === -1 &&
        world.guards.vestiary.chat === -1
      ),
    },
    room6
  )

  // room 7
  world.createMoveAction(
    {
      text: 'Open the backdoor with the security card and go outside', 
      callback: () =>
        new Promise((resolve) => {
          if (!world.isGoldenKeyFound) {
            setTimeout(() => {
              say(`A green guard is approaching ...`)
              world.updateLocalData()
              resolve()
            }, 1200)
          }
          else {
            say(`The green guard has left the place ...`)
            resolve()
          }
        }),
      isEnabled: () => (
        player.currentRoom === room5 && 
        room7.isDiscovered() && 
        world.isSecurityCardFound
      ),
    },
    room7
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
          //drawMap(world)
          world.updateLocalData()
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
          world.updateLocalData()
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
          world.updateLocalData()
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
          world.updateLocalData()
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
          world.updateLocalData()
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
          say(`${player.name} found a gold coin under the furniture !`)
          world.isGoldCoinFound = true
          world.updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room1 &&
      world.isRoom4Found &&
      !world.isGoldCoinFound
    ),
  })

  // actions in room 2
  world.createAction({
    text: 'Look on one side of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks on the left ...`)
        setTimeout(() => {
          say(`${player.name} saw a red guard in front of a door`)
          world.lookedOnTheLeft = true
          drawGuard(room2, 'red')
          world.updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      !world.lookedOnTheLeft
    ),
  })

  world.createAction({
    text: 'Look on the other side of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks on the right ...`)
        setTimeout(() => {
          say(`${player.name} saw a blue guard in front of a door`)
          world.lookedOnTheRight = true
          drawGuard(room2, 'blue')
          world.updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.lookedOnTheLeft &&
      !world.lookedOnTheRight
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
          world.updateLocalData()
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
    text: 'Chat with the red guard',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} talks with the guard on the left ...`)
        setTimeout(() => {
          switch (world.guards.vestiary.chat) {
            case 0:
              say(`Guard : Hello ${player.name}, you can go to the vestiary just behind me, it's open all day long and you can practice sport there.`)
              world.isRoom3Found = true
              //drawMap(world)
              world.guards.vestiary.chat = 1
              break
            case 1:
              if (world.isBronzeDoorFound) {
                say(`Guard : Hello again ${player.name}, ahah do you want to open the strong door ? You can't, because I have the key and I won't give it to you ... (the guard moves to the vestiary)`)
                world.guards.vestiary.chat = 2
                //drawMap(world)
              }
              else {
                say(`Guard : Hello again ${player.name}, you can explore the corridor as you want.`)
              }
              break
            case 2:
              if (world.cookedMeals.pasta === 0) {
                say(`Guard : Hi my friend, I'm back, yet I'm hungry ! I feel like eating pastas ...`)
              }
              else {
                say(`Guard : Hi my friend, do you really have cooked some pasta ?? Thank you for this plate ! (${player.name} gave a plate of pasta to the guard)`)
                world.cookedMeals.pasta --
                world.guards.vestiary.pasta ++
                world.guards.vestiary.chat = 3
              }
              break
            case 3:
              if (world.cookedMeals.burger === 0) {
                say(`Guard : I would like to eat a burger ...`)
              }
              else {
                say(`Guard : Hi my friend, do you really have cooked some burgers ?? Thank you for this burger ! (${player.name} gave a burger to the guard)`)
                world.cookedMeals.burger --
                world.guards.vestiary.burger ++
                world.guards.vestiary.chat = 4
              }
              break
            case 4:
              say(`Guard : Thank you for the burger !`)
              world.guards.vestiary.chat ++
              break
            case 5:
              say(`Guard : I think you should talk with other guards now ...`)
              world.guards.vestiary.chat ++
              break
            case 6:
              say(`Guard : Stop talking to me. (the guard left)`)
              world.guards.vestiary.chat = -1
              //drawMap(world)
              break
            default:
              say(`Guard : Come later, I'm busy.`)
          }
          world.updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      (player.currentRoom === room2 &&
      world.guards.vestiary.chat >= 0 && 
      world.lookedOnTheLeft &&
      world.guards.vestiary.chat !== 2) ||
      (player.currentRoom === room2 &&
        world.isBronzeKeyFound &&
        world.guards.vestiary.chat === 2)
    ),
  })

  world.createAction({
    text: 'Chat with the blue guard',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} talks with the blue guard ...`)
        setTimeout(() => {
          switch (world.guards.library.chat) {
            case 0:
              say(`Guard : Hello ${player.name}, you're not allowed to go to the library.`)
              world.isRoom6Found = true
              world.guards.library.chat = 1
              //drawMap(world)
              break
            case 1:
              if (world.cookedMeals.burger > 0 && world.cookedMeals.cake === 0) {
                say(`(${player.name} gave a burger to the guard) Guard : Oh thanks for this burger, I see that you are a good cooker, but do you know how to cook a cake ?`)
                world.cookedMeals.burger --
                world.guards.library.burger ++
              }
              else if (world.cookedMeals.cake > 0) {
                say(`Guard : Hello again ${player.name}, indeed you know how to cook a cake. Can you give me this cake ? (${player.name} gave a cake to the guard)`)
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
                say(`Guard : I would like to eat another cake ...`)
              }
              if (world.cookedMeals.cake > 0) {
                say(`Guard : Give me this cake please, I loved the first one ! (${player.name} gave another cake to the guard)`)
                world.guards.library.chat = 3
                world.cookedMeals.cake --
                world.guards.library.cake ++
              }
              break
            case 3:
              say(`Guard : Thanks for the food ! But It won't be enough to let you go in the library ahah ...`) // give a silver coin to pass
              break
            case 4:
              say(`Guard : Ok, you are good at bargaining ... I'll leave and let you enter the library ! (The guard leaves the corridor)`)
              world.guards.library.chat = -1
              //drawMap(world)
              break
            default:
              say(`Guard : Come later, I'm busy.`)
          }
          world.updateLocalData()
          resolve()
        }, 1000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      world.guards.vestiary.chat !== 0 &&
      world.lookedOnTheRight &&
      world.guards.library.chat >= 0
    ),
  })

  world.createAction({
    text: 'Move to Library',
    callback: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          say(`A guard prevents ${player.name} from entering the library ... It would be better to wait until all the guards leave the Corridor !`)
          resolve()
        }, 500)
      }),
    isEnabled: () => (
      player.currentRoom === room2 &&
      (world.guards.library.chat > 0 || 
        (world.guards.library.chat === -1 &&
        world.guards.vestiary.chat !== -1))
    ),
  })

  // actions in room 3
  world.createAction({
    text: 'Chat with the red guard who is here',
    callback: () =>
      new Promise((resolve) => {
        say(`Guard : Why did you follow me ?`)
        setTimeout(() => {
          say(`Guard : Don't steal, please, I'll go running outdoor. However, you can use the restrooms of this vestiary as you want. (the red guard left the place for a moment)`)
          world.guards.vestiary.sport = 1
          world.isRoom4Found = true
          //drawMap(world)
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room3 &&
      world.guards.vestiary.sport === 0 &&
      world.guards.vestiary.chat === 2
    ),
  })

  world.createAction({
    text: 'Search in the stuff here',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches something to steal in the boxes ...`)
        setTimeout(() => {
          say(`${player.name} found some silver coins`)
          world.isSilverCoinFound = true
          world.updateLocalData()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room3 &&
      world.guards.vestiary.sport > 0 &&
      !world.isSilverCoinFound
    ),
  })

  // actions in the room 4
  world.createAction({
    text: 'Search for interresting stuff here',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches ...`)
        setTimeout(() => {
          if (world.isBronzeDoorFound) {
            say(`${player.name} found the bronze key of the red guard on the floor !`)
            world.isBronzeKeyFound = true
          }
          else {
            say(`${player.name} found nothing interresting`)
          }
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room4 &&
      world.guards.vestiary.sport > 0 &&
      world.guards.vestiary.chat === 2 &&
      !world.isBronzeKeyFound
    ),
  })

  world.createAction({
    text: 'Use toilets',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} uses the toilets ...`)
        setTimeout(() => {
            say(`You don't need to know what ${player.name} did ...`)
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room4
    ),
  })

  // actions in room 5
  world.createAction({
    text: 'Cook pastas',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(`${player.name} cooked a plate of pastas`)
            world.cookedMeals.pasta ++
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5
    ),
  })

  world.createAction({
    text: 'Cook a burger',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(`${player.name} cooked a burger`)
            world.cookedMeals.burger ++
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      world.isCookingBookUsed
    ),
  })

  world.createAction({
    text: 'Cook a cake',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(`${player.name} cooked a cake`)
            world.cookedMeals.cake ++
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      world.isCookingBookUsed
    ),
  })

  world.createAction({
    text: 'Cook the traditional meal',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} cooks an awsome traditional meal thanks to the book found in the library ...`)
        setTimeout(() => {
          say(`${player.name} cooked the traditional meal.`)
          world.cookedMeals.specialMeal = 1
          world.updateLocalData()
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
    text: 'Search for interresting thigs',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} search for stuff in the Kitchen ...`)
        setTimeout(() => {
          if (!world.isCookingBookFound) {
            say(`${player.name} found a cooking book`)
            world.isCookingBookFound = true
          }
          else if (!world.isPostItFound) {
            say(`${player.name} found a post-it with a reference to a special cooking book`)
            world.isPostItFound = true
          }
          else if (!world.isSmallBoxFound) {
            say(`${player.name} found a small box locked with a code`)
            world.isSmallBoxFound = true
          }
          world.updateLocalData()
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
          world.isBackDoorFound = true
          //drawMap(world)
          world.updateLocalData()
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
          say(`But the door is locked and a security card is required to open it.`)
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room5 &&
      world.isBackDoorFound &&
      !world.isSecurityCardFound
    ),
  })

  // actions in room 6
  world.createAction({
    text: 'Read a book',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} chooses a book to read in the library ...`)
        setTimeout(() => {
          if (world.booksRead < 2) {
            say(`${player.name} read a book`)
            world.booksRead ++
          }
          else {
            say(`${player.name} activated a secret mechanism and opened a trap door in the library !`)
            world.isTrappedDoorFound = true
          }
          world.updateLocalData()
          resolve()
        }, 1500)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      !world.isTrappedDoorFound
    ),
  })

  world.createAction({
    text: 'Search the book with the reference written on the post-it note',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches the book in the library ...`)
        setTimeout(() => {
          say(`${player.name} found the book (referenced in the post-it note) !`)
          world.isSpecialCookingBookFound = true
          world.isPostItUsed = true
          world.updateLocalData()
          resolve()
        }, 2500)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      world.isPostItFound &&
      !world.isSpecialCookingBookFound
    ),
  })

  world.createAction({
    text: 'Look around and search the room with care',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} searches interresting things in the library ...`)
        setTimeout(() => {
          if (!world.isCodeLockerFound) {
            say(`${player.name} found a box locked with a code.`)
            world.isCodeLockerFound = true
          }
          else {
            if (world.booksRead < 1) {
              say(`${player.name} found nothing else that seemed interresting ... If I were ${player.name}, I would read a book to console myself :)`)
            }
            else if (world.booksRead < 2) {
              say(`${player.name} found nothing ... ${player.name} SHOULD REALLY READ A BOOK ! ^^`)
            }
            else {
              say(`${player.name} found an old picture of the guards between the books.`)
              world.isPictureFound = true
            }
          } 
          world.updateLocalData()
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      !world.isPictureFound
    ),
  })

  world.createAction({
    text: 'Explore the small room behind the trap door',
    callback: () =>
      new Promise((resolve) => {
        const background = document.getElementById('background')
        background.classList.add('trap-door')
        say(`${player.name} goes through the trap door to see what's in this tiny secret room ...`)
        setTimeout(() => {
          say(`${player.name} sees some strange paintings on the walls ...`)
        }, 5000)
        setTimeout(() => {
          say(`${player.name} sees strange objects : old pistols and old maps in the furniture ...`)
        }, 10000)
        setTimeout(() => {
          say(`${player.name} found a gold coin in a drawer !`)
          world.isGoldCoinFound = true
          world.updateLocalData()
          background.classList.remove('trap-door')
          resolve()
        }, 15000)
      }),
    isEnabled: () => (
      player.currentRoom === room6 &&
      world.isTrappedDoorFound
    ),
  })

  // actions in room 7
  world.createAction({
    text: 'Look around',
    callback: () =>
      new Promise((resolve) => {
        say(`${player.name} looks around ...`)
        setTimeout(() => {
          if (world.guards.outdoor.chat !== -1) {
            say(`${player.name} saw a portal behind the guard.`)
          }
          else {
            say(`${player.name} saw a portal behind the place where the guard was just before.`)
          }
          world.isGoldenDoorFound = true
          world.updateLocalData()
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
              if (world.guards.outdoor.specialMeal === 0 && world.guards.outdoor.goldCoins === 0) {
                say(`Guard : What are you doing ? Don't try to escape yourself ! You're not supposed to be here !`)
              }
              else if (world.guards.outdoor.specialMeal === 1 && world.guards.outdoor.goldCoins === 0) {
                say(`Guard : I must admit that this traditional meal is tasty, but it won't be enough ...`)
              } 
              else if (world.guards.outdoor.specialMeal === 0 && world.guards.outdoor.goldCoins === 1) {
                say(`Guard : I must admit that this gold coin has value, but it won't be enough ...`)
              }
              else {
                say(`${player.name} managed to corrupt the guard and obtained a big key ! (the guard left)`)
                world.isGoldenKeyFound = true
              }
          }
          world.updateLocalData()
          resolve()
        }, 1500)
      }),
    isEnabled: () => (
      player.currentRoom === room7 &&
      !world.isGoldenKeyFound
    ),
  })

  // action to win the game
  world.createAction(
    {
      text: 'Escape',
      callback: () =>
        new Promise((resolve) => {
          say(`${player.name} escaped and won the game ! 🎉`)
          setTimeout(() => {
            world.playerWon = true
            world.timer.stopTimer()
            world.updateLocalData()
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
        openNoteBook(world)
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
            //drawMap(world)
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(`But the key didn't work on this door ...`)
          }
          resolve()
        }, 1000)
      }),
  })

  world.createItem({
    name: 'letter',
    isEnabled: () => world.isLetterFound,
    isUsed: () => world.isLetterUsed,
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} reads the letter ...`)
        displayLetterModal()
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
            say(`${player.name} gives several silver coins to the blue guard (in front of the Library).`)
            world.guards.library.silverCoins = 1
            world.guards.library.chat = 4
            world.isSilverCoinUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
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
    isUsed: () => (world.isBronzeDoorOpened),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} tries to use the bronze key ...`)
        setTimeout(() => {
          if (player.currentRoom === room2 && world.isBronzeDoorFound) {
            say(`${player.name} managed to open the strong door at the end of the corridor thanks to the bronze key !`)
            world.isBronzeDoorOpened = true
            world.isRoom5Found = true
            //drawMap(world)
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
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
          displayCodeModal(world, "kitchen")
          world.updateLocalData()
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
        setTimeout(() => {
          say(`${player.name} reads the enigma ...`)
          displayEnigmaModal()
          resolve()
        }, 500)
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
          if (player.currentRoom === room5) {
            say(`${player.name} learnt how to cook burgers and cakes !`)
            world.isCookingBookUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(`This is a cooking book with common recipes.`)
          }
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
        say(`${player.name} has ${world.cookedMeals.pasta} plate(s) of pasta !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'burgers',
    isEnabled: () => (world.cookedMeals.burger !== 0),
    isUsed: () => (world.cookedMeals.burger === -1),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} has ${world.cookedMeals.burger} burger(s) ready to eat !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'cakes',
    isEnabled: () => (world.cookedMeals.cake !== 0),
    isUsed: () => (world.cookedMeals.cake === -1),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} has ${world.cookedMeals.cake} cake(s) hot and smelling good !`)
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
          say(`${player.name} gives the awesome traditional meal cooked in the Kitchen to the guard outdoor ...`)
          setTimeout(() => {
            if (world.guards.outdoor.goldCoins === 0) {
              say(`Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
            }
            else {
              say(`Guard : Hum, ok this meal reminds me my childhood and the amazing recipes of my grandmother ... Thank you for that !`)
            }
            world.cookedMeals.specialMeal = -1
            world.guards.outdoor.specialMeal = 1
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
            resolve()
          }, 3000)
        }
        else {
          say(`${player.name} has cooked an awesome traditional meal that looks really tasty ! (it can be offered to someone ...)`)
          resolve()
        }
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
          clearActions()
          addEnabledActions(world)
          world.updateLocalData()
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
        displayCodeModal(world, "library")
        world.updateLocalData()
        resolve()
      }),
  })

  world.createItem({
    name: 'security card',
    isEnabled: () => (world.isSecurityCardFound),
    isUsed: () => false,
    callback: () => 
      new Promise((resolve) => {
        say(`This security card may be very useful to escape this maze !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'photo',
    isEnabled: () => (world.isPictureFound),
    isUsed: () => (false),
    callback: () => 
      new Promise((resolve) => {
        say(`This photo is useless ... but at least it's funny !`)
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
            say(`Guard : Ah this coin is made of pure gold ! Thank you for the gift ... we can negociate now ...`)
            world.isGoldCoinUsed = true
            world.guards.outdoor.goldCoins = 1
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
            resolve()
          }, 2000)
        } else {
          say(`${player.name} thinks that this coin should be very useful ...`)
        }
      }),
    isEnabled: () => world.isGoldCoinFound,
    isUsed: () => world.isGoldCoinUsed
  })

  world.createItem({
    name: 'big key',
    isEnabled: () => world.isGoldenKeyFound,
    isUsed: () => world.isGoldenKeyUsed,
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} takes the big key ...`)
        setTimeout(() => {
          if (player.currentRoom === room7 && world.isGoldenDoorFound) {
            say(`${player.name} opened the portal outdoor and found the exit !`)
            world.isGoldenKeyUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(`This key may be used somewhere ...`)
          }
          resolve()
        }, 1500)
      }),
  })

  // Configuration of the parameters
  initializeParameters(world)

  // Beginning of the scenario ...
  if (!jsonData) {
    askPlayerName(player, world.beginningAction)
  }
  if (jsonData) {
    clearActions()
    addEnabledActions(world)
    addEnabledItems(world)
    drawMap(world)
  }
  world.updateLocalData()
}

void main()
