const textId = 'text'
const textElement = document.getElementById(textId)

import { World } from '../Game/World'
import { formatTime } from './Timer'

/**
 * Text to say
 * @param {string} textContent
 */
export const say = (world, textContent) => {
  textElement.innerHTML = textContent
  world.history += formatTime(world.timer.time) + ' - ' + textContent + '\n'
}
