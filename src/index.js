import { World } from './Game/World'
import { say } from './Interface/Text'
import { clearActions, addEnabledActions } from './Interface/Action'
import { askPlayerName, drawMap, restartDrawMap, drawGuard } from './Interface/Map'
import { initializeParameters, displayLetterModal, displayEnigmaModal, displayCodeModal, helpModal, helpCloseModal, helpConfirmButton } from './Interface/Parameters'
import { clearItems, addEnabledItems, openNoteBook } from './Interface/Item'
import { addToLeaderBoard, displayWinLeaderBoard } from './Interface/LeaderBoard'

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
    name: 'Restroom',
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
            say(world, `${player.name} sees a lot of stuff in the boxes`)
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
      text: 'Go to the Restroom', 
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
            say(world, `This kitchen is really messy ...`)
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
              say(world, `A green guard is approaching ...`)
              world.updateLocalData()
              resolve()
            }, 1200)
          }
          else {
            say(world, `The green guard has left the place ...`)
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
        say(world, `${player.name} looks around the room ...`)
        setTimeout(() => {
          say(world, `${player.name} found a note book on the desk and saw the Corridor through the door of the Cell`)
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
        say(world, `${player.name} searches something in the furniture ...`)
        setTimeout(() => {
          say(world, `${player.name} found an iron key in a drawer`)
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
        say(world, `${player.name} searches the room ...`)
        setTimeout(() => {
          say(world, `${player.name} found a piece of paper in the room ... But there is nothing written on it.`)
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
        say(world, `${player.name} looks under the bed ...`)
        setTimeout(() => {
          say(world, `${player.name} found a letter under the bed.`)
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
        say(world, `${player.name} is sleeping ...`)
        setTimeout(() => {
          say(world, `${player.name} wakes up and feels better ! :)`)
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
        say(world, `${player.name} searches the room ...`)
        setTimeout(() => {
          say(world, `${player.name} found a gold coin under the furniture !`)
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
        say(world, `${player.name} looks on the left ...`)
        setTimeout(() => {
          say(world, `${player.name} saw a red guard in front of a door`)
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
        say(world, `${player.name} looks on the right ...`)
        setTimeout(() => {
          say(world, `${player.name} saw a blue guard in front of a door`)
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
    text: 'Walk to the end of the corridor',
    callback: () =>
      new Promise((resolve) => {
        say(world, `${player.name} walks forward to the end of the corridor ...`)
        setTimeout(() => {
          say(world, `${player.name} found a strong door at the end of the corridor`)
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
        say(world, `${player.name} talks with the red guard ...`)
        setTimeout(() => {
          switch (world.guards.vestiary.chat) {
            case 0:
              say(world, `Red Guard : Hello ${player.name}, you can go to the vestiary just behind me, it's open all day long and you can use it when you practice sport.`)
              world.isRoom3Found = true
              world.guards.vestiary.chat = 1
              break
            case 1:
              if (world.isBronzeDoorFound) {
                say(world, `Red Guard : Hello again ${player.name}, ahah do you want to open the strong door ? You can't, because I have the key and I won't give it to you ... (the guard moves to the vestiary)`)
                world.guards.vestiary.chat = 2
              }
              else {
                say(world, `Red Guard : Hello again ${player.name}, you can explore the corridor as you want.`)
              }
              break
            case 2:
              if (world.cookedMeals.pasta === 0) {
                say(world, `Red Guard : Hi my friend, I'm back, yet I'm hungry ! I feel like eating pastas ...`)
              }
              else {
                say(world, `Red Guard : Hi my friend, do you really have cooked some pasta ?? Thank you for this plate ! (${player.name} gave a plate of pasta to the guard)`)
                world.cookedMeals.pasta --
                world.guards.vestiary.pasta ++
                world.guards.vestiary.chat = 3
              }
              break
            case 3:
              if (world.cookedMeals.burger === 0) {
                say(world, `Red Guard : I would like to eat a burger ...`)
              }
              else {
                say(world, `Red Guard : Hi my friend, do you really have cooked some burgers ?? Thank you for this burger ! (${player.name} gave a burger to the guard)`)
                world.cookedMeals.burger --
                world.guards.vestiary.burger ++
                world.guards.vestiary.chat = 4
              }
              break
            case 4:
              say(world, `Red Guard : I think you should talk with other guards now ...`)
              world.guards.vestiary.chat = 5
              break
            case 5:
              say(world, `Red Guard : Stop talking to me. (the guard left)`)
              world.guards.vestiary.chat = -1
              break
            default:
              say(world, `Red Guard : Come later, I'm busy.`)
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
        say(world, `${player.name} talks with the blue guard ...`)
        setTimeout(() => {
          switch (world.guards.library.chat) {
            case 0:
              say(world, `Blue Guard : Hello ${player.name}, you're not allowed to go to the library.`)
              world.isRoom6Found = true
              world.guards.library.chat = 1
              break
            case 1:
              if (world.cookedMeals.burger > 0 && world.guards.library.burger === 0) {
                say(world, `(${player.name} gave a burger to the blue guard) Blue Guard : Oh thanks for this burger, I see that you are a good cooker, but do you know how to cook a cake ?`)
                world.guards.library.chat = 2
                world.cookedMeals.burger --
                world.guards.library.burger ++
              }
              else {
                say(world, `Blue Guard : Go ahead, I'm hungry. I miss burgers ...`)
              }
              break
            case 2:
              if (world.cookedMeals.cake > 0) {
                say(world, `Blue Guard : Hello again ${player.name}, indeed you know how to cook a cake. Can you give me this cake ? (${player.name} gave a cake to the blue guard)`)
                world.guards.library.chat = 3
                world.cookedMeals.cake --
                world.guards.library.cake ++
              }
              else {
                say(world, `Blue Guard : I see that you are a good cooker, but do you know how to cook a cake ?`)
              }
              break
            case 3:
              if (world.cookedMeals.cake > 0) {
                say(world, `Blue Guard : Give me this cake please, I loved the first one ! (${player.name} gave another cake to the blue guard)`)
                world.guards.library.chat = 4
                world.cookedMeals.cake --
                world.guards.library.cake ++
              }
              else {
                say(world, `Blue Guard : I would like to eat another cake ...`)
              }
              break
            case 4:
              say(world, `Blue Guard : Thanks for the food ! But It won't be enough to let you go in the library ahah ...`) // give silver coins to pass
              break
            case 5:
              say(world, `Blue Guard : Ok, you are good at bargaining ... I'll leave and let you enter the library ! (The blue guard leaves the corridor)`)
              world.guards.library.chat = -1
              break
            default:
              say(world, `Blue Guard : Come later, I'm busy.`)
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
          say(world, `A guard prevents ${player.name} from entering the library ... It would be better to wait until all the guards leave the Corridor !`)
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
        say(world, `Red Guard : Why did you follow me ?`)
        setTimeout(() => {
          say(world, `Red Guard : Don't steal, please, I'll go running outdoor. However, you can use the restroom of this vestiary as you want. (the red guard leaves the place for a moment)`)
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
        say(world, `${player.name} searches something to steal in the boxes ...`)
        setTimeout(() => {
          say(world, `${player.name} found some silver coins`)
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
    text: 'Search for interesting stuff here',
    callback: () =>
      new Promise((resolve) => {
        say(world, `${player.name} searches ...`)
        setTimeout(() => {
          if (world.isBronzeDoorFound) {
            say(world, `${player.name} found the bronze key of the red guard on the floor !`)
            world.isBronzeKeyFound = true
          }
          else {
            say(world, `${player.name} found nothing interesting`)
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
        say(world, `${player.name} uses the toilets ...`)
        setTimeout(() => {
            say(world, `You don't need to know what ${player.name} did ...`)
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
        say(world, `${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(world, `${player.name} cooked a plate of pastas`)
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
        say(world, `${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(world, `${player.name} cooked a burger`)
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
        say(world, `${player.name} cooks something tasty ...`)
        setTimeout(() => {
            say(world, `${player.name} cooked a cake`)
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
        say(world, `${player.name} cooks an awsome traditional meal thanks to the book found in the library ...`)
        setTimeout(() => {
          say(world, `${player.name} cooked the traditional meal.`)
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
    text: 'Search for interesting things',
    callback: () =>
      new Promise((resolve) => {
        say(world, `${player.name} searches for stuff in the Kitchen ...`)
        setTimeout(() => {
          if (!world.isCookingBookFound) {
            say(world, `${player.name} found a cooking book`)
            world.isCookingBookFound = true
          }
          else if (!world.isPostItFound) {
            say(world, `${player.name} found a post-it with a reference to a special cooking book`)
            world.isPostItFound = true
          }
          else if (!world.isSmallBoxFound) {
            say(world, `${player.name} found a small box locked with a code`)
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
        say(world, `${player.name} looks around ...`)
        setTimeout(() => {
          say(world, `${player.name} found a backdoor in this room`)
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
        say(world, `${player.name} tries to open the door ...`)
        setTimeout(() => {
          say(world, `But the door is locked and a security card is required to open it.`)
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
        say(world, `${player.name} chooses a book to read in the library ...`)
        setTimeout(() => {
          if (world.booksRead < 2) {
            say(world, `${player.name} read a book`)
            world.booksRead ++
          }
          else {
            say(world, `${player.name} activated a secret mechanism and opened a trap door in the library !`)
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
        say(world, `${player.name} searches the book in the library ...`)
        setTimeout(() => {
          say(world, `${player.name} found the book (referenced in the post-it note) !`)
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
        say(world, `${player.name} searches interesting things in the library ...`)
        setTimeout(() => {
          if (!world.isCodeLockerFound) {
            say(world, `${player.name} found a box locked with a code.`)
            world.isCodeLockerFound = true
          }
          else {
            if (world.booksRead < 1) {
              say(world, `${player.name} found nothing else that seemed interesting ... If I were ${player.name}, I would read some books to console myself :)`)
            }
            else if (world.booksRead < 2) {
              say(world, `${player.name} found nothing ... ${player.name} should read another book ! ^^`)
            }
            else if (world.booksRead < 3) {
              say(world, `${player.name} found nothing ... ${player.name} SHOULD REALLY READ ONE MORE BOOK ! :D`)
            }
            else {
              say(world, `${player.name} found an old picture of the guards between the books.`)
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
        say(world, `${player.name} goes through the trap door to see what's in this tiny secret room ...`)
        setTimeout(() => {
          say(world, `${player.name} sees some strange paintings on the walls ...`)
        }, 5000)
        setTimeout(() => {
          say(world, `${player.name} sees strange objects : old pistols and old maps in the furniture ...`)
        }, 10000)
        setTimeout(() => {
          say(world, `${player.name} found a gold coin in a drawer !`)
          world.isGoldCoinFound = true
          world.updateLocalData()
        }, 15000)
        setTimeout(() => {
          background.classList.remove('trap-door')
          resolve()
        }, 17000)
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
        say(world, `${player.name} looks around ...`)
        setTimeout(() => {
          if (world.guards.outdoor.chat !== -1) {
            say(world, `${player.name} saw a portal behind the guard.`)
          }
          else {
            say(world, `${player.name} saw a portal behind the place where the green guard was just before.`)
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
        say(world, `${player.name} tries to talk to the green guard ...`)
        setTimeout(() => {
          switch (world.guards.outdoor.chat) {
            case 0:
              say(world, `Green Guard : What are you doing ? Don't try to escape yourself ! You're not supposed to be here !`)
              world.guards.outdoor.chat = 1
              break
            case 1:
              if (world.guards.outdoor.specialMeal === 0 && world.guards.outdoor.goldCoins === 0) {
                say(world, `Green Guard : What are you doing ? Don't try to escape yourself ! You're not supposed to be here !`)
              }
              else if (world.guards.outdoor.specialMeal === 1 && world.guards.outdoor.goldCoins === 0) {
                say(world, `Green Guard : I must admit that this traditional meal is tasty, but it won't be enough ...`)
              } 
              else if (world.guards.outdoor.specialMeal === 0 && world.guards.outdoor.goldCoins === 1) {
                say(world, `Green Guard : I must admit that this gold coin has value, but it won't be enough ...`)
              }
              else {
                say(world, `${player.name} managed to corrupt the green guard and obtained a big key ! (the green guard left)`)
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
          say(world, `${player.name} escaped and won the game ! 🎉`)
          setTimeout(() => {
            world.playerWon = true
            world.timer.stopTimer()
            addToLeaderBoard(world, [world.timer.time, player.name])
            displayWinLeaderBoard(world)
            console.log("LeaderBoard : " + world.leaderBoard)
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
        say(world, `${player.name} used the iron key ...`)
        setTimeout(() => {
          if (player.currentRoom === room1) {
            world.isIronDoorOpened = true
            world.isIronKeyUsed = true
            say(world, `${player.name} opened the door of the Cell`)
            //drawMap(world)
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(world, `But the key didn't work on this door ...`)
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
        say(world, `${player.name} reads the letter ...`)
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
            say(world, `${player.name} gives several silver coins to the blue guard (in front of the Library).`)
            world.guards.library.silverCoins = 1
            world.guards.library.chat = 4
            world.isSilverCoinUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(world, `These coins are useless in this situation ...`)
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
        say(world, `${player.name} tries to use the bronze key ...`)
        setTimeout(() => {
          if (player.currentRoom === room2 && world.isBronzeDoorFound) {
            say(world, `${player.name} managed to open the strong door at the end of the corridor thanks to the bronze key !`)
            world.isBronzeDoorOpened = true
            world.isRoom5Found = true
            //drawMap(world)
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(world, `The bronze key is not useful in this room ...`)
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
        say(world, `${player.name} opens the small box ...`)
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
          say(world, `${player.name} reads the enigma ...`)
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
        say(world, `${player.name} reads the cooking book ...`)
        setTimeout(() => {
          if (player.currentRoom === room5) {
            say(world, `${player.name} learnt how to cook burgers and cakes !`)
            world.isCookingBookUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(world, `This is a cooking book with common recipes.`)
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
        say(world, `The post-it contains a note which is a reference to a special book for a traditional recipe ...`)
        resolve()
      }),
  })

  world.createItem({
    name: 'pastas',
    isEnabled: () => (world.cookedMeals.pasta !== 0),
    isUsed: () => (world.cookedMeals.pasta === -1),
    callback: () => 
      new Promise((resolve) => {
        say(world, `${player.name} has ${world.cookedMeals.pasta} plate(s) of pasta !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'burgers',
    isEnabled: () => (world.cookedMeals.burger !== 0),
    isUsed: () => (world.cookedMeals.burger === -1),
    callback: () => 
      new Promise((resolve) => {
        say(world, `${player.name} has ${world.cookedMeals.burger} burger(s) ready to eat !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'cakes',
    isEnabled: () => (world.cookedMeals.cake !== 0),
    isUsed: () => (world.cookedMeals.cake === -1),
    callback: () => 
      new Promise((resolve) => {
        say(world, `${player.name} has ${world.cookedMeals.cake} cake(s) hot and smelling good !`)
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
          world.guards.outdoor.specialMeal === 0 &&
          world.guards.outdoor.chat > 0) {
          say(world, `${player.name} gives the awesome traditional meal cooked in the Kitchen to the guard outdoor ...`)
          setTimeout(() => {
            if (world.guards.outdoor.goldCoins === 0) {
              say(world, `Guard : Hum, ok this is absolutely delicious, but don't try to corrupt myself with food, I'm not that easy to corrupt !`)
            }
            else {
              say(world, `Guard : Hum, ok this meal reminds me my childhood and the amazing recipes of my grandmother ... Thank you for that !`)
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
          say(world, `${player.name} has cooked an awesome traditional meal that looks really tasty ! (it can be offered to someone ...)`)
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
          say(world, `${player.name} learnt how to cook the traditional meal !`)
          world.isSpecialCookingBookUsed = true
          clearActions()
          addEnabledActions(world)
          world.updateLocalData()
        }
        else {
          say(world, `${player.name} needs to be in the Kitchen to learn cooking ...`)
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
        say(world, `${player.name} tries a code ...`)
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
        say(world, `This security card may be very useful to escape this maze !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'photo',
    isEnabled: () => (world.isPictureFound),
    isUsed: () => (false),
    callback: () => 
      new Promise((resolve) => {
        say(world, `This photo is useless ... but at least it's funny !`)
        resolve()
      }),
  })

  world.createItem({
    name: 'gold coin',
    callback: () =>
      new Promise((resolve) => {
        if (player.currentRoom === room7 &&
          world.isGoldCoinFound &&
          world.guards.outdoor.goldCoins === 0 &&
          world.guards.outdoor.chat > 0) {
          say(world, `${player.name} gives the gold coin to the guard outdoor ...`)
          setTimeout(() => {
            say(world, `Guard : Ah this coin is made of pure gold ! Thank you for the gift ... we can negociate now ...`)
            world.isGoldCoinUsed = true
            world.guards.outdoor.goldCoins = 1
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
            resolve()
          }, 2000)
        } else {
          say(world, `${player.name} thinks that this coin should be very useful ...`)
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
        say(world, `${player.name} takes the big key ...`)
        setTimeout(() => {
          if (player.currentRoom === room7 && world.isGoldenDoorFound) {
            say(world, `${player.name} opened the portal outdoor and found the exit !`)
            world.isGoldenKeyUsed = true
            clearActions()
            addEnabledActions(world)
            world.updateLocalData()
          } else {
            say(world, `This key may be used somewhere ...`)
          }
          resolve()
        }, 1500)
      }),
  })

  // Configuration of the parameters
  initializeParameters(world)

  // Beginning of the scenario ...
  if (!jsonData) {
    helpModal.style.display = 'block'
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
