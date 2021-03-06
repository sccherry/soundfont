import Observable from 'zen-observable';
import fromEvent from '../lib/Observable/fromEvent';
import requestMIDIAccess from '../lib/requestMIDIAccess';
import toMessage from '../lib/toMessage';

const inputDevices = requestMIDIAccess().map(access => access.inputs);

const midi = inputDevices
  .flatMap(inputs => Observable.from(Array.from(inputs.values())))
  .flatMap(input => fromEvent(input, 'midimessage'))
  .map(e => toMessage(...e.data));

export default midi;
