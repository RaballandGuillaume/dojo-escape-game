import { World } from './Game/World'
import { say } from './Interface/Text'
import { addAction } from './Interface/Action'

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

  const player = world.createPlayer('John Doe')

  var isIronDoorOpened = false,
    isIronKeyFound = false

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
            say(`${player.name} found a golden door`)
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
    isEnabled: () => (true),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the golden key ...`)
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
    isEnabled: () => (
      isIronKeyFound === true
    ),
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the iron key ...`)
        setTimeout(() => {
          if (player.currentRoom === room1) {
            isIronDoorOpened = true
            say(`${player.name} opened the iron door`)
            addAction(
              world.createMoveAction(
                {
                  text: 'Move to room 2',
                  isEnabled: () => (
                    (player.currentRoom === room1) || 
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
      identifier: 'inventory-button',
      text: (world.openInventory ? 'Close' : 'Open') + ' Inventory',
      callback: () => {
        /* if (world.openInventory) {
          clearItems(world)
          
        } else {
          addEnabledItems(world)
        }
        world.openInventory = !(world.openInventory) */
      },
      isEnabled: () => true
    })
  )

  // Beginning of the scenario ...

  setTimeout(() => {
    say(`${player.name} wakes up ...\n and found an iron door.`)
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
      })
    )
  }, 1000)
}

void main()
