class RecorderProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      this.port.postMessage(inputs);
      return true;
    }
  }
  
  registerProcessor("recorder-processor", RecorderProcessor);