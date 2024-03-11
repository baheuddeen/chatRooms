import Mp3Encoder from './mp3-encoder';
import WavEncoder from './wav-encoder';
import { convertTimeMMSS } from './utils';
import RecorderProcessorUrl from "./audio-processor.js?url";

export default class {
  public duration: number;
  public volume: string | number;
  public records: any[];
  public isPause: boolean;
  public isRecording: boolean;
  public wavSamples: any[];
  public _duration: number;
  public lameEncoder: any;
  public encoderOptions: { bitRate: any; sampleRate: any; };
  public bufferSize: number;
  public format: any;
  public micFailed: any;
  public afterRecording: any;
  public pauseRecording: any;
  public beforeRecording: any;
  public processor: any;
  public input: any;
  public context: any;
  public stream: any;
  public recorderProcessor: AudioWorkletNode;


  constructor (options: any = {}) {
    this.beforeRecording = options.beforeRecording
    this.pauseRecording  = options.pauseRecording
    this.afterRecording  = options.afterRecording
    this.micFailed       = options.micFailed
    this.format          = options.format

    this.encoderOptions = {
      bitRate    : options.bitRate,
      sampleRate : options.sampleRate
    }

    this.bufferSize = 4096
    this.records    = []

    this.isPause     = false
    this.isRecording = false

    this.duration = 0
    this.volume   = 0

    this.wavSamples = []

    this._duration = 0
  }

  public async createWorkletNode(
    context: BaseAudioContext,
    name: string,
    url: string
  ) {
    const x = 'wow';
    try {
      return new AudioWorkletNode(context, name);
    } catch (err) {
      await context.audioWorklet.addModule(url);
      return new AudioWorkletNode(context, name);
    }
  }

  start () {
    const constraints = {
      video: false,
      audio: {
        channelCount: 1,
        echoCancellation: false,
      }
    }

    this.beforeRecording && this.beforeRecording('start recording')

    navigator.mediaDevices
             .getUserMedia({
              video: false,
              audio: {
                channelCount: 1,
                echoCancellation: false,
                sampleSize: 16,
                sampleRate: this.encoderOptions.sampleRate,
              }
             })
             .then(this._micCaptured.bind(this))
             .catch(this._micError.bind(this))

    this.isPause     = false
    this.isRecording = true

    if (this._isMp3() && !this.lameEncoder) {
      this.lameEncoder = new Mp3Encoder(this.encoderOptions)
    }
  }

  stop () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.recorderProcessor.disconnect()
    this.context.close()

    let record = null

    if (this._isMp3()) {
      record = this.lameEncoder.finish()
    } else {
      let wavEncoder = new WavEncoder({
        bufferSize : this.bufferSize,
        sampleRate : this.encoderOptions.sampleRate,
        samples    : this.wavSamples
      })
      record = wavEncoder.finish()
      this.wavSamples = []
    }

    record.duration = convertTimeMMSS(this.duration)
    this.records.push(record)

    this._duration = 0
    this.duration  = 0

    this.isPause     = false
    this.isRecording = false

    this.afterRecording && this.afterRecording(record)
  }

  pause () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.recorderProcessor.disconnect()

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

  async _micCaptured (stream) {
    this.context    = new(window.AudioContext || (window as any).webkitAudioContext)()
    this.duration   = this._duration
    this.input      = this.context.createMediaStreamSource(stream);

    this.recorderProcessor = await this.createWorkletNode(this.context, "recorder-processor", RecorderProcessorUrl);

    this.stream     = stream;
    
    this.recorderProcessor.port.onmessage = (ev) => {
      
      const sample = ev.data[0][0];
      let sum = 0.0;
      if (this._isMp3()) {
        this.lameEncoder.encode(sample)
      } else {
        this.wavSamples.push(...sample)
      }

      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }

      this.duration = parseFloat(`${this._duration}`) + parseFloat(this.context.currentTime.toFixed(2))
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)
    }
    const gainNode = this.context.createGain();
    console.log('mini', 'before', gainNode.gain.value);
    gainNode.gain.value = 10;
    console.log('after', gainNode.gain.value);
    this.input.connect(gainNode);
    gainNode.connect(this.recorderProcessor);
    this.recorderProcessor.connect(this.context.destination)
  }

  _micError (error) {
    this.micFailed && this.micFailed(error)
  }

  _isMp3 () { 
    return this.format.toLowerCase() === 'mp3'
  }
}
