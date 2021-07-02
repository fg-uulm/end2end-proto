# end2end-proto

a minimal example of end-to-end interface prototyping with arduino, serial connection (via webserial API) and a minimal bootstrap UI. currently only working in browsers supporting webserial API (e.g. chrome).

## requirements / gettings started
* clone repository
* flash sketch to arduino (use nano 33 ble sense if you want to avoid sensor/led wiring, otherwise you need to set up sensor and led on a breadboard)
* open index.html in browser
* click "Connect" and choose arduino from list
* wave your hand over the sensor left-to-right to start time tracking, right-to-left to stop again
