const playerButton = document.getElementById('parameter-player-button')
const resetButton = document.getElementById('parameter-reset-button')
const pauseButton = document.getElementById('parameter-pause-button')
const displayHistoryButton = document.getElementById('parameter-history-button')
const helpButton = document.getElementById('help-button')
const helpEnigma = document.getElementById('help-enigma-icon')
const helpEnigmaText = document.getElementById('help-enigma')
const enigmaModal = document.getElementById('enigma-modal')
const closeEnigmaModal = document.getElementById('close-enigma-modal')
const enigmaConfirmButton = document.getElementById('enigma-confirm-button')
const letterModal = document.getElementById('letter-modal')
const closeLetterModal = document.getElementById('close-letter-modal')
const letterConfirmButton = document.getElementById('letter-confirm-button')
const codeModal = document.getElementById('ask-code-modal')
const closeCodeModal = document.getElementById('close-code-modal')
const codeConfirmButton = document.getElementById('code-confirm-button')
const codeInput = document.getElementById('code-input')
const wrongCodeAlert = document.getElementById('wrong-code-alert')
const timerModal = document.getElementById('timer-paused-modal')
const timerCloseModal = document.getElementById('close-timer-paused-modal')
const confirmPlayTimer = document.getElementById('timer-confirm-button')
const historyModal = document.getElementById('history-modal')
const historyText = document.getElementById('game-history')
const hitoryCloseModal = document.getElementById('close-history-modal')
const historyConfirmButton = document.getElementById('history-confirm-button')
const helpModal = document.getElementById('help-modal')
const helpCloseModal = document.getElementById('close-help-modal')
const helpConfirmButton = document.getElementById('help-confirm-button')

import { World } from '../Game/World'
import { say } from './Text'
import { askPlayerName } from './Map'
import { addEnabledItems, clearItems } from './Item'

/**
 * Check if the code written by the player is the good one
 * @param {World} world - the world
 * @param {string} roomName  - the room where the padlock was found
 */
const checkCode = (world, roomName) => {
  if (roomName === 'library') {
      const code = '10'
      if(codeInput.value === code) {
        codeModal.style.display = 'none'
        wrongCodeAlert.style.display = 'none'
        codeInput.removeEventListener('keyup', pressEnterListener)
        say(world, `${world.player.name} found a security card inside the code locker !`)
        world.isEnigmaUsed = true
        world.isCodeLockerUsed = true
        world.isSecurityCardFound = true
        clearItems(world)
        addEnabledItems(world)
        world.updateLocalData()
        return
      }
    else {
        wrongCodeAlert.style.display = 'block'
    }
  }
  if (roomName === 'kitchen') {
    const code = '25'
    if(codeInput.value === code) {
      codeModal.style.display = 'none'
      wrongCodeAlert.style.display = 'none'
      codeInput.removeEventListener('keyup', pressEnterListener)
      say(world, `${world.player.name} found an enigma in the small box found in the Kitchen.`)
      world.isSmallBoxUsed = true
      world.isLetterUsed = true
      clearItems(world)
      addEnabledItems(world)
      world.updateLocalData()
      return
    }
    else {
        wrongCodeAlert.style.display = 'block'
    }
  }
}

const pressEnterListener = (event) => {
    wrongCodeAlert.style.display = 'none'
      if (event.key === 'Enter') {
          checkCode(event.target.world, event.target.roomName)
      }
  }

export const displayEnigmaModal = () => enigmaModal.style.display = 'block'
export const displayLetterModal = () => letterModal.style.display = 'block'
export const displayCodeModal = (world, roomName) => {
  codeInput.world = world
  codeInput.roomName = roomName
  codeInput.addEventListener('keyup', pressEnterListener)
  codeModal.style.display = 'block'
  codeConfirmButton.onclick = () => checkCode(world, roomName)
}

export const initializeParameters = (world) => {
  // Buttons in parameters
  playerButton.onclick = () => askPlayerName(world.player, world.updateLocalData)
  resetButton.onclick = () => {
    world.timer.stopTimer()
    world.resetGame()
  }
  pauseButton.onclick = () => world.timer.pause()
  displayHistoryButton.onclick = () => {
    historyText.innerText = world.history
    historyModal.style.display = 'block'
  }
  helpButton.onclick = () => helpModal.style.display = 'block'

  // Timer modal
  timerCloseModal.onclick = () => {
    timerModal.style.display = 'none'
    world.timer.play(world, world.timer.time)
  }
  confirmPlayTimer.onclick = () => {
    timerModal.style.display = 'none'
    world.timer.play(world, world.timer.time)
  }

  // Other button configuration
  // Ask code modal
  closeCodeModal.onclick = () => codeModal.style.display = 'none'
  
  // Letter modal
  closeLetterModal.onclick = () => letterModal.style.display = 'none'
  letterConfirmButton.onclick = () => letterModal.style.display = 'none'

  // Enigma modal
  closeEnigmaModal.onclick = () => enigmaModal.style.display = 'none'
  enigmaConfirmButton.onclick = () => enigmaModal.style.display = 'none'
  helpEnigma.onclick = () => {
      if (helpEnigmaText.style.display === 'block')
        helpEnigmaText.style.display = 'none'
      else {
        helpEnigmaText.style.display = 'block'
      }
  }

  // History modal
  hitoryCloseModal.onclick = () => historyModal.style.display = 'none'
  historyConfirmButton.onclick = () => historyModal.style.display = 'none'

  // Help modal
  helpCloseModal.onclick = () => helpModal.style.display = 'none'
  helpConfirmButton.onclick = () => helpModal.style.display = 'none'
}