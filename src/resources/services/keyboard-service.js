import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { NOTE_ON, NOTE_OFF, MidiService } from './midi-service';
import { OnmidimessageEvent } from '../events/onmidimessage';

const keys = ['a','w','s','e','d','f','t','g','y','h','u','j'];

const keyToNote = ( key ) => {
  const pitch = keys.indexOf( key );
  const octave = 5;

  return (pitch + (12 * octave));
};

@inject( EventAggregator, MidiService )
export class KeyboardService {
  constructor( EventAggregator, MidiService ) {
    this.ea = EventAggregator;
    this.midi = MidiService;

    this.boundOnKeypress = this.onKeypress.bind( this );
  }

  bind() {
    window.addEventListener( 'keydown', this.boundOnKeypress, false );
    window.addEventListener( 'keyup', this.boundOnKeypress, false );
  }

  unbind() {
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  }

  onKeypress( e ) {
    const key = e.key;

    if ( keys.includes( key ) && !e.repeat ) {
      let status;

      const note = keyToNote( key );

      switch( e.type ) {
        case 'keydown':
          status = NOTE_ON;
          break;
        case 'keyup':
          status = NOTE_OFF;
          break;
      }

      this.ea.publish( new OnmidimessageEvent( this.midi.toMessage(
        status,
        note
      ) ) );
    }
  }
}
