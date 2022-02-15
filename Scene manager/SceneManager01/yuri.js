  function initMidi(){
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess({
          sysex: false, // this defaults to 'false' and we won't be covering sysex in this article.
        })
        .then(onMIDISuccess, onMIDIFailure)
    } else {
      alert('No MIDI support in your browser.')
    }
  }
  
  function onMIDIMessage(message) {
    let data = message.data // this gives us our [command/channel, note, velocity] data.
    // console.log('MIDI data', data) // MIDI data [144, 63, 73]
  
    let cmd = data[0] >> 4
    let channel = data[0] & 0xf
    let type = data[0] & 0xf0 // channel agnostic message type. Thanks, Phil Burk.
    let note = data[1]
    let velocity = data[2]
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14
  
    switch (type) {
      case 144: // noteOn message
        noteOn(note, velocity)
        break
      case 128: // noteOff message
        noteOff(note, velocity)
        break
      case 176: // cc message
        controlChange(note, velocity)
        break;
    }
  
    //console.log('data', data, 'cmd', cmd, 'channel', channel);
    // console.log('key data', data)
  }
  
  function controlChange(midiNote, velocity){
    if(midiVerbose){
        console.log("CONTROL CHANGE ");
        console.log(midiNote);
        console.log(velocity);
        console.log("----");
    }
    if(midiNote === 4){
        generalControl = velocity/127.0;
    }else if(midiNote === 5){
        generalNoiseScale = (velocity/127.0) * 0.5;
        console.log("noiseScale " + generalNoiseScale);
    }else if(midiNote === 6){
        maxNoiseDisplace = (velocity/127.0) * 100;
    }else if(midiNote === 7){
        maxDisplace = (velocity/127.0) * 100;
    }
   
  }
  
  function noteOn(midiNote, velocity) {
    // player(midiNote, velocity);
   // s.sine.freq(s.midiToFreq(midiNote))
  //  s.envelope.play(s.sine, 0, 0.1)\
  if(midiVerbose){
    console.log("Note ON");
    console.log(midiNote);
    console.log(velocity);
    console.log("----");
}
  }
  
  function noteOff(midiNote, velocity) {
    // player(midiNote, velocity);
    // s.envelope.play(s.sine, 0, 0.1)
    if(midiVerbose){
        console.log("Note OFF");
        console.log(midiNote);
        console.log(velocity);
        console.log("----");
    }
  }
  // midi functions
  function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    console.log('MIDI Access Object', midiAccess)
    // when we get a succesful response, run this code
    let midi = midiAccess // this is our raw MIDI data, inputs, outputs, and sysex status
  
    var inputs = midi.inputs.values()
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      // each time there is a midi message call the onMIDIMessage function
      input.value.onmidimessage = onMIDIMessage
      listInputs(input)
    }
    midi.onstatechange = onStateChange
  }
  
  function onStateChange(event) {
    var port = event.port,
      state = port.state,
      name = port.name,
      type = port.type
    if (type == 'input') console.log('name', name, 'port', port, 'state', state)
  }
  
  function listInputs(inputs) {
    var input = inputs.value
    console.log(
      "Input port : [ type:'" +
        input.type +
        "' id: '" +
        input.id +
        "' manufacturer: '" +
        input.manufacturer +
        "' name: '" +
        input.name +
        "' version: '" +
        input.version +
        "']"
    )
  }
  
  function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log(
      "No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " +
        e
    )
  }