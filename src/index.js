import { World } from './Game/World'
import { say } from './Interface/Text'
import { addAction } from './Interface/Action'
import { askPlayerName } from './Interface/Map'

const main = () => {
  const world = new World('World')

  const room1 = world.createRoom({ name: 'room 1', height: 2 })
  const room2 = world.createRoom({ name: 'room 2', xPos: 1 })
  const room3 = world.createRoom({
    name: 'room 3',
    xPos: 1,
    yPos: 1,
    color: 'black',
  })

  
  const player = world.createPlayer('Player')

  var isIronDoorOpened = false
  var isIronKeyFound = false
  var isIronKeyUsed = false
  var isGoldenKeyFound = false
  var isGoldenKeyUsed = false

  function beginningAction() {
    say(`${player.name} enters the room ...`)
    setTimeout(() => {
      say(`... and finds an iron door on the right of the room.`)
      addAction(
        world.createAction({
          text: 'Search the room with care',
          callback: () =>
            new Promise((resolve) => {
              say(`${player.name} searches the room ...`)
              setTimeout(() => {
                say(`${player.name} found an iron key in the room`)
                isIronKeyFound = true
                resolve()
              }, 3000)
            }),
          isEnabled: () => (
            player.currentRoom === room1 && 
            isIronKeyFound === false
          ),
          id: 'inventory-button'
        })
      )
    }, 1000)
  }

  // end of var definition

  world.createMoveAction(
    {
      text: 'Move to room 1',
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
          }, 1200)
          resolve()
        }),
      isEnabled: () => (
        player.currentRoom === room2 && 
        room3.color !== 'black'
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
          resolve()
        }, 2000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 && 
      room3.color !== 'black' &&
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
          room3.updateColor()
          resolve()
        }, 3000)
      }),
    isEnabled: () => (
      player.currentRoom === room2 && 
      room3.color === 'black'
    ),
  })

  world.createItem({
    name: 'gold key',
    isEnabled: () => (isGoldenKeyFound === true),
    isUsed: () => (isGoldenKeyUsed === true),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the gold key ...`)
        setTimeout(() => {
          if (player.currentRoom === room3) {
            say(`${player.name} found the exit 🎉`)
          } else {
            say(`But the key didn't work on this door ...`)
          }
          resolve()
        }, 1000)
      })
  })

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
            addAction(
              world.createMoveAction(
                {
                  text: 'Move to room 2',
                  isEnabled: () => (
                    (player.currentRoom === room1 && isIronDoorOpened) || 
                    player.currentRoom === room3
                    ),
                  world,
                },
                room2
              )
            )

          } else {
            say(`But the key didn't work on this door ...`)
          }
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

  // Beginning of the scenario ...

  askPlayerName(player, beginningAction)
}

void main()
