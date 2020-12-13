import { displayTime, displayPause } from '../Interface/Timer'
import { World } from './World'

export default class Timer {
    constructor() {
        this.time = 0
        this.timerFunction = undefined
    }

    /**
     * Play the timer and display the time
     * @param {number} time - the time to start from, in ms
     */
    play = (world, time = 0) => {
        this.time = time
        this.timerFunction = setInterval(() => this.runTimer(world), 1000)
    }

    /**
     * Pause the timer and display the modal for game paused
     */
    pause = () => {
        this.playing = false
        this.stopTimer()
        displayPause(this.time)
    }

    /**
     * Stop the timer
     */
    stopTimer = () => {
        clearInterval(this.timerFunction)
    }

    /**
     * @private
     */
    runTimer = (world) => {
        this.time ++
        displayTime(this.time)
        world.updateLocalData()
    }
}