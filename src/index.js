import { World } from './Game/World'
import { say } from './Interface/Text'
import { addAction } from './Interface/Action'
import { clearItems, addEnabledItems } from './Interface/Item'

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
            say(`${player.name} found the exit 🎉`)
          }, 1200)
          resolve()
        }),
      isEnabled: () => player.currentRoom === room2 && room3.color !== 'black',
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
    isEnabled: () => player.currentRoom === room2 && room3.color === 'black',
  })

  world.createItem({
    name: 'gold key',
    isEnabled: true,
    callback: () => 
      new Promise((resolve) => {
        say(`${player.name} used the golden key ...`)
        setTimeout(() => {
          say(`But the key didn't work on this door ...`)
          resolve()
        }, 1000)
      })
  })

  setTimeout(() => {
    say(`${player.name} wakes up.`)
    addAction(
      world.createMoveAction(
        {
          text: 'Move to room 2',
          isEnabled: () => player.currentRoom === room1,
          world,
        },
        room2
      )
    )
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
  }, 1200)
}

void main()
