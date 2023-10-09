import { Mp3Encoder } from 'lamejs'

export default class {
  constructor(config) {
    this.bitRate    = config.bitRate
    this.sampleRate = config.sampleRate
    this.dataBuffer = []
    this.encoder    = new Mp3Encoder(1, this.sampleRate, 400)
  }

  encode(arrayBuffer) {
    const maxSamples = 1152
    const samples    = this._convertBuffer(arrayBuffer)
    let remaining    = samples.length

    for (let i = 0; remaining >= 0; i += maxSamples) {
      const left = samples.subarray(i, i + maxSamples)
      const buffer = this.encoder.encodeBuffer(left);
      console.log('high bitRate');
      this.dataBuffer.push(new Int8Array(buffer))
      remaining -= maxSamples
    }
  }

  finish() {
    this.dataBuffer.push(this.encoder.flush())
    const blob = new Blob(this.dataBuffer, { type: 'audio/mp3' })
    this.dataBuffer = []

    return {
      id   : Date.now(),
      blob : blob,
      url  : URL.createObjectURL(blob)
    }
  }

  _floatTo16BitPCM(input, output) {
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]))
      output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF)
    }
  }

  _convertBuffer(arrayBuffer) {
    const data = new Float32Array(arrayBuffer)
    const out = new Int32Array(arrayBuffer.length)
    this._floatTo16BitPCM(data, out)
    return out
  }
}
