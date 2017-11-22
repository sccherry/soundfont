class BufferSynth {
  constructor(context, { envelope }) {
    this.context = context;
    this.gain = this.context.createGain();
    this.envelope = envelope;
  }

  start(buffer, amplitude) {
    if (!this.source) {
      this.source = this.context.createBufferSource();
      this.source.connect(this.gain);
      this.source.buffer = buffer;

      this.gain.gain.setValueAtTime(0, this.context.currentTime);
      this.source.start(this.context.currentTime);

      this.gain.gain.linearRampToValueAtTime(
        amplitude,
        this.context.currentTime + this.envelope.attack,
      );

      this.gain.gain.linearRampToValueAtTime(
        amplitude * this.envelope.sustain,
        this.context.currentTime + this.envelope.attack + this.envelope.decay,
      );
    }

    return this;
  }

  stop() {
    if (this.source) {
      this.source.onended = () => {
        this.source.disconnect();
        this.source = null;
      };

      this.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.envelope.release);
      this.source.stop(this.context.currentTime + this.envelope.release);
    }

    return this;
  }

  connect(to) {
    this.gain.connect(to);

    return this;
  }

  disconnect(from) {
    this.gain.disconnect(from);

    return this;
  }
}

export default BufferSynth;