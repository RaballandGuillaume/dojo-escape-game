const inventoryId = 'inventory'
const items = document.getElementById(inventoryId)
import { Item } from '../Game/Item'
import { World } from '../Game/World'

/**
 * Add an item to the interface
 * @param {Item} item item to register
 */
export const addItem = ({ name, callback, identifier }) => {
  const itemElement = document.createElement('button')
  Object.assign(itemElement, {
    classList: ['item-button'],
    onclick: callback,
    id: identifier,
    innerHTML: name,
  })
  items.append(itemElement)
}

/**
 * Add all enabled items for current state
 * @param {World} world
 */
export const addEnabledItems = (world) => {
    world.items.forEach((item) => item.isEnabled() && addItem(item))
    document.getElementById('inventory-button').innerHTML = 'Close Inventory'
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
  items.innerHTML = ''
  document.getElementById('inventory-button').innerHTML = 'Open Inventory'
  world.openInventory = false
}
