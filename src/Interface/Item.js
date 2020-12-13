const inventoryId = 'inventory-items'
const inventory = document.getElementById(inventoryId)
const inventoryContainerId = 'inventory'
const inventoryContainer = document.getElementById(inventoryContainerId)
const noteBookModal = document.getElementById('note-book-modal')
const closeNoteBookModal = document.getElementById('close-note-book-modal')
const writtenNotes = document.getElementById('notes')
const saveNotes = document.getElementById('note-book-confirm-button')
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
    inventory.innerHTML = ''
    world.items.forEach((item) => item.isEnabled() && addItem(item))
    if (inventory.innerHTML === '') {
      inventory.innerHTML = 'Your inventory is empty'
      inventory.style.fontStyle = 'italic'
      inventory.style.textAlign = 'center'
    }
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

/**
 * Close the modal with the notes
 * @param {World} world
 */
export const closeNoteBook = (world) => {
    world.notes = writtenNotes.value
    noteBookModal.style.display = 'none'
    world.updateLocalData()
  }

/**
 * Open the modal with the notes stored in local storage
 * @param {World} world
 */
export const openNoteBook = (world) => {
  noteBookModal.style.display = 'block'
  writtenNotes.value = world.notes
  closeNoteBookModal.onclick = () => {
    closeNoteBook(world)
  }
  saveNotes.onclick = () => {
    closeNoteBook(world)
  }
  window.onclick = (event) => {
    if (event.target == noteBookModal) {
      closeNoteBook(world)
    }
  }
  
  return
}