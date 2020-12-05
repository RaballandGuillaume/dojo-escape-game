const inventoryId = 'inventory-items'
const inventory = document.getElementById(inventoryId)
const inventoryContainerId = 'inventory'
const inventoryContainer = document.getElementById(inventoryContainerId)
import { Item } from '../Game/Item'
import { World } from '../Game/World'

/**
 * Add an item to the interface
 * @param {Item} item item to register
 */
export const addItem = ({ name, callback, identifier, isUsed }) => {
  const itemElement = document.createElement('button')
  if (isUsed()) {
    Object.assign(itemElement, {
      classList: ['item-button item-button-used'],
      title: 'You already used this item',
      onclick: null,
      disabled: true,
      id: identifier,
      innerHTML: name,
    })
  }
  else {
    Object.assign(itemElement, {
      classList: ['item-button'],
      title: 'Use this item',
      onclick: callback,
      disabled: false,
      id: identifier,
      innerHTML: name,
    })
  }
  
  inventory.append(itemElement)
}

/**
 * Add all enabled items for current state
 * @param {World} world
 */
export const addEnabledItems = (world) => {
    const inventoryButton = document.getElementById('inventory-button')
    world.items.forEach((item) => item.isEnabled() && addItem(item))
    inventoryButton.innerHTML = 'Close Inventory'
    inventoryContainer.style.display = 'block'
    world.openInventory = true
}

/**
 * Remove an item from the interface
 * @param {Item} item item to register
 */
export const removeItem = ({ identifier }) => {
  const itemElement = document.getElementById(identifier)
  if (itemElement) itemElement.parentNode.removeChild(itemElement)
}

/**
 * Clear all items from the interface
 */
export const clearItems = (world) => {
  const inventoryButton = document.getElementById('inventory-button')
  inventory.innerHTML = ''
  inventoryButton.innerHTML = 'Open Inventory'
  inventoryContainer.style.display = 'none'
  world.openInventory = false
}
