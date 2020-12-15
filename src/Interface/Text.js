export const textElement = document.getElementById('text')

import { World } from '../Game/World'
import { formatTime } from './Timer'

/**
 * Text to say
 * @param {World} world - the world
 * @param {string} textContent - the text to display
 */
export const say = (world, textContent) => {
  textElement.innerHTML = textContent
  world.lastSay = textContent
  world.history += formatTime(world.timer.time) + ' - ' + textContent + '\n'
}
