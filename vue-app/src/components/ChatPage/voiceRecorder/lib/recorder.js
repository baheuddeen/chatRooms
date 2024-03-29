import { convertTimeMMSS } from './utils'

export default class {
  constructor (options = {}) {
    this.beforeRecording = options.beforeRecording
    this.pauseRecording  = options.pauseRecording
    this.afterRecording  = options.afterRecording
    this.micFailed       = options.micFailed
    this.format          = options.format
    this.encoderOptions = {
      bitRate    : options.bitRate,
      sampleRate : options.sampleRate
    }

    this.chunks = [];
    this.bufferSize = 4096
    this.records    = []

    this.isPause     = false
    this.isRecording = false

    this.duration = 0
    this.volume   = 0

    this._duration = 0
    this.startTime; // to keep track of the start time
    this.stopwatchInterval; // to keep track of the interval
    this.duration = 0
  }

  start () {
    const constraints = {
      video: false,
      audio: {
        channelCount: 1,
        echoCancellation: false,
        sampleRate: this.encoderOptions.sampleRate,
      }
    }

    this.beforeRecording && this.beforeRecording('start recording')

    navigator.mediaDevices
             .getUserMedia(constraints)
             .then(this._micCaptured.bind(this))
             .catch(this._micError.bind(this))
    this.isPause     = false
    this.isRecording = true
  }

  stop () {
    this.mediaRecorder.stop();
    clearInterval(this.stopwatchInterval); // stop the interval
    this.duration = new Date().getTime() - this.startTime; // calculate elapsed paused time
    this.stopwatchInterval = null; // reset the interval variable
  }

  pause () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()

    this._duration = this.duration
    this.isPause = true

    this.pauseRecording && this.pauseRecording('pause recording')
  }

  recordList () {
    return this.records
  }

  lastRecord () {
    return this.records.slice(-1).pop()
  }

  _micCaptured (stream) {
    this.mediaRecorder = new MediaRecorder(stream);
    this.duration   = this._duration;
    this._startStopwatch();
    this.mediaRecorder.ondataavailable = (ev) => {
      console.log('ondata:', ev);
      this.chunks.push(ev.data);
    };
    this.mediaRecorder.onstop = (ev) => {
      console.log('on stop');
      const blob = new Blob(this.chunks,  { type: "audio/ogg; codecs=opus" })
      this.chunks = []
      const record = {
        id   : Date.now(),
        blob : blob,
        url  : URL.createObjectURL(blob)
      }
      
      this.records.push(record);
      console.log(this.records);

      
      this._duration = 0
      this.duration  = 0

      this.isPause     = false
      this.isRecording = false

      this.afterRecording && this.afterRecording(record)
    };

    this.mediaRecorder.start();

  }

  _micError (error) {
    this.micFailed && this.micFailed(error)
  }

  _isMp3 () {
    return this.format.toLowerCase() === 'mp3'
  }
  _startStopwatch() {
    if (!this.stopwatchInterval) {
    //   console.log(this);
      this.startTime = new Date().getTime() - this.duration; // get the starting time by subtracting the elapsed paused time from the current time
      this.stopwatchInterval = setInterval(this._updateStopwatch.bind(this), 1000); // update every second
    }
  }
  _updateStopwatch() {
    const currentTime = new Date().getTime(); // get current time in milliseconds
    this.duration = (currentTime - this.startTime) / 1000; // calculate elapsed time in milliseconds
    console.log(this.duration);
    // var seconds = Math.floor(this.duration / 1000) % 60; // calculate seconds
    // var minutes = Math.floor(this.duration / 1000 / 60) % 60; // calculate minutes
    // var hours = Math.floor(this.duration / 1000 / 60 / 60); // calculate hours
    // var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
  }
}




function stopStopwatch() {
  
}

function resetStopwatch() {
  stopStopwatch(); // stop the interval
  elapsedPausedTime = 0; // reset the elapsed paused time variable
  document.getElementById("stopwatch").innerHTML = "00:00:00"; // reset the display
}



function pad(number) {
  return (number < 10 ? "0" : "") + number;
}