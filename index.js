const display = document.getElementById('clock')
const alarmSound = document.getElementById('alarmSound')
const alarmsList = document.getElementById('alarmsList')
let currentAlarmAudio = null
let alarms = []

function updateTime() {
	const date = new Date()
	const hour = formatTime(date.getHours())
	const minutes = formatTime(date.getMinutes())
	const seconds = formatTime(date.getSeconds())
	display.innerText = `${hour} : ${minutes} : ${seconds}`
}

function formatTime(time) {
	return time < 10 ? '0' + time : time
}

function setAlarmTime(value) {
	return new Date(value)
}

function addAlarm() {
	const alarmTime = setAlarmTime(
		document.querySelector('input[name="alarmTime"]').value
	)
	const currentTime = new Date()

	if (alarmTime && alarmTime > currentTime) {
		const alarm = {
			time: alarmTime,
			sound: alarmSound.value,
			active: true,
		}
		alarms.push(alarm)
		renderAlarms()
	} else {
		alert('Please set a future alarm time.')
	}
}

function toggleAlarm(index) {
	alarms[index].active = !alarms[index].active
	renderAlarms()
}

function deleteAlarm(index) {
	alarms.splice(index, 1)
	renderAlarms()
}

function renderAlarms() {
	alarmsList.innerHTML = ''
	alarms.forEach((alarm, index) => {
		const alarmItem = document.createElement('div')
		alarmItem.className = 'alarm-item'

		const alarmTime = document.createElement('div')
		alarmTime.className = 'alarm-time'
		alarmTime.innerText = `${formatTime(alarm.time.getHours())} : ${formatTime(
			alarm.time.getMinutes()
		)}`

		const toggleSwitch = document.createElement('label')
		toggleSwitch.className = 'switch'
		const input = document.createElement('input')
		input.type = 'checkbox'
		input.checked = alarm.active
		input.onclick = () => toggleAlarm(index)
		input.setAttribute('data-index', index) // Устанавливаем индекс для обновления
		const slider = document.createElement('span')
		slider.className = 'slider'

		const deleteButton = document.createElement('button')
		deleteButton.innerText = 'Delete'
		deleteButton.className = 'button clear-alarm'
		deleteButton.onclick = () => deleteAlarm(index)

		toggleSwitch.appendChild(input)
		toggleSwitch.appendChild(slider)

		alarmItem.appendChild(alarmTime)
		alarmItem.appendChild(toggleSwitch)
		alarmItem.appendChild(deleteButton)

		alarmsList.appendChild(alarmItem)
	})
}

function checkAlarms() {
	const current = new Date()
	alarms.forEach((alarm, index) => {
		if (alarm.active && alarm.time <= current) {
			playSound(alarm.sound)

			// Отключаем будильник и снимаем галочку
			alarm.active = false

			// Перенос будильника на следующий день
			alarm.time.setDate(alarm.time.getDate() + 1)

			renderAlarms() // Обновляем UI, чтобы галочка снялась
			showStopButton()
		}
	})
}

function playSound(src) {
	let audio = new Audio(src)
	audio.onerror = function () {
		alert('Unable to play the selected sound.')
		console.error('Error loading audio file:', src)
	}
	audio.play().catch(error => {
		console.error('Playback failed:', error)
	})
	currentAlarmAudio = audio
}

function stopAlarm() {
	if (currentAlarmAudio) {
		currentAlarmAudio.pause()
		currentAlarmAudio.currentTime = 0
		currentAlarmAudio = null
		hideStopButton()
	}
}

function showStopButton() {
	const stopButton = document.getElementById('stopAlarmButton')
	if (stopButton) {
		stopButton.style.display = 'block'
	}
}

function hideStopButton() {
	const stopButton = document.getElementById('stopAlarmButton')
	if (stopButton) {
		stopButton.style.display = 'none'
	}
}

setInterval(updateTime, 1000)
setInterval(checkAlarms, 1000)
