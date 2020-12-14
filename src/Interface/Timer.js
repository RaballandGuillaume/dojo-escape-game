const timerModal = document.getElementById('timer-paused-modal')
const displayTimeModal = document.getElementById('timer-modal-time')
const displayTimeTitle = document.getElementById('title-time')

export const formatTime = (time) => {
    var hours = (time - time % 3600) / 3600
    var timeTemp = time - hours * 3600
    var minutes = (timeTemp - timeTemp % 60) / 60
    var seconds = timeTemp - minutes * 60
    const formattedTime = formatNumber(hours) + ':' + formatNumber(minutes) + ':' + formatNumber(seconds)
    return formattedTime
}

const formatNumber = (number) => {
    if (number < 10) {
        return '0' + String(number)
    }
    else if (number >= 0) {
        return String(number)
    }
    else {
        return '00'
    }
}

export const displayTime = (time) => {
    displayTimeTitle.innerText = formatTime(time)
}

export const displayPause = (time) => {
    displayTimeModal.innerText = formatTime(time)
    timerModal.style.display = 'block'
}