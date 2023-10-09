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
}
