class AudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastMicLevel = 0;
    this.lastSpeakerLevel = 0;
    this.currentMainChannel = "speaker";
    this.lastMicPcm16Audio = null;
    this.lastSpeakerPcm16Audio = null;
  }

  process(inputs, outputs, parameters) {
    const inputBuffer = inputs[0][0];
    const float32Audio = inputBuffer;
    const pcm16Audio = this.float32To16BitPCM(float32Audio);
    const level = pcm16Audio.reduce((acc, val) => acc + Math.abs(val), 0);

    if (inputs[0] === this.port.sourceNodeMic) {
      this.lastMicLevel = level;
      this.lastMicPcm16Audio = pcm16Audio;
      this.port.postMessage({ level, pcm16Audio, channel: "mic" });
    } else if (inputs[0] === this.port.sourceNodeSpeaker) {
      this.lastSpeakerLevel = level;
      this.lastSpeakerPcm16Audio = pcm16Audio;
      this.port.postMessage({ level, pcm16Audio, channel: "speaker" });
    }

    return true;
  }

  float32To16BitPCM(float32Arr) {
    const pcm16bit = new Int16Array(float32Arr.length);
    for (let i = 0; i < float32Arr.length; ++i) {
      const s = Math.max(-1, Math.min(1, float32Arr[i]));
      pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16bit;
  }
}

registerProcessor("audio-worklet-processor", AudioWorkletProcessor);
