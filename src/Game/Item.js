import { randomId } from './utils'

export class Item {
    /**
   * Create an item
   * @param {Object} itemConfig the item config
   * @param {string} itemConfig.name the item name
   * @param {()=>void | undefined} itemConfig.isEnabled evaluated when opening the inventory, if false the item is not displayed
   * @param {()=>void | undefined} itemConfig.isUsed evaluated when opening the inventory, if true the item is displayed as used
   * @param {()=>Promise<void>} itemConfig.callback to do on item click
   */
  constructor({ name, callback, isEnabled = () => false, isUsed = () => false }) {
    this.name = name
    this.callback = callback
    this.isEnabled = isEnabled
    this.isUsed = isUsed
    this.identifier = randomId()
  }

  useItem() {
    this.isUsed = true
  }

  unuseItem() {
    this.isUsed = false
  }
}