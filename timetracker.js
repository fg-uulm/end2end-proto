const baudRate = 115200;
let timings = [];
let interval = -1;

//Warte auf Daten vom Arduino via Serialport (siehe Library)
navigator.serial.addEventListener('serialdata', function (e) { 
  gestureFromArdu(e.detail)
});

//Gesten-Messages vom Arduino auswerten
function gestureFromArdu(gestureId) {
  if (gestureId == 0) startTimer()
  else if (gestureId == 1) endTimer()
  else console.log("Unknown command: "+gestureId+ " (type: "+typeof(gestureId)+")")
}

//Neuen Timer starten
function startTimer() {
  if ([timings.length - 1].end === null) return

  //Neuen Eintrag anlegen      
  timings.push({
    start: new Date(),
    end: null
  })
  //Sende LED rot an Arduino      
  writeToStream("0,1,1")

  //Update UI
  document.getElementById("timer_started").innerText = timings[timings.length - 1].start.toLocaleString()
  clearInterval(interval)
  interval = setInterval(renderCurrentTimer, 60)
}

//Laufenden Timer beenden
function endTimer() {
  if (timings.length < 1 || timings[timings.length - 1].end !== null) {
    console.log("Cannot stop: ", timings)
    return
  }
  //Laufenden Eintrag abschließen, Endzeit speichern
  timings[timings.length - 1].end = new Date()

  //Sende LED grün an Arduino
  writeToStream("1,0,1")
  clearInterval(interval)

  //Update UI
  let li = document.createElement('li');
  li.textContent = "Von " + timings[timings.length - 1].start.toLocaleString() + " Uhr bis " + timings[timings.length -
    1].end.toLocaleString()+" Uhr";
  document.getElementById("list").appendChild(li)
  let newTotal = 0
  timings.forEach(element => {
    newTotal += (element.end.getTime() - element.start.getTime())
  })
  document.getElementById("sum").textContent = msToTime(newTotal)
}

//Zeit "weitertickern" lassen 
function renderCurrentTimer() {
  let timeSpan = new Date().getTime() - timings[timings.length - 1].start.getTime() //time in milliseconds
  document.getElementById("timer_elapsed").innerText = msToTime(timeSpan)
}

//Helfer - macht aus Millisekunden vernünftige Zeitspannen-Angaben (hh:mm:ss)
function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}