/**
 * Some test functions
 * For debug purposes only
 */

import CascadeNode from '../index.js';
import binaural from 'binaural';

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
 */
function writeTextDataToFile( text, textFile = null ) {
    
    const data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if ( textFile !== null ) {
      window.URL.revokeObjectURL( textFile );
    }

    textFile = window.URL.createObjectURL( data );

    // returns a URL you can use as a href
    return textFile;
};

//==============================================================================
/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * The text file is formatted so that it can be easily copy/paste into Matlab
 * 
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFileWithMatlabFormat( buffer ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    const numDecimals = 9;

    for( let i = 0 ; i < numChannels; i++){

        const channel_ = buffer.getChannelData( i );

        text += "channel(" + (i+1) + ", 1:" + numSamples + ") = ";
        text += "...\n";

        text += "[ ";

        for( let j = 0; j < numSamples; j++ ){
            const value = channel_[j];

            const valueAsString = value.toFixed( numDecimals );

            text += valueAsString;
            text += " ";
        }
        text += " ];"

        text += "\n";
    }

    return writeTextDataToFile( text );
}

/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFile( buffer ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    const numDecimals = 9;

    for( let i = 0 ; i < numChannels; i++){

        const channel_ = buffer.getChannelData( i );

        text += "channel[" + i + "] = ";
        text += "\n";

        for( let j = 0; j < numSamples; j++ ){
            const value = channel_[j];

            const valueAsString = value.toFixed( numDecimals );

            text += valueAsString;
            text += " ";
        }
        text += "\n";
    }

    return writeTextDataToFile( text );
}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBufferChannel( buffer, channelIndex ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    /// boundary check
    if( channelIndex < 0 || channelIndex >= numChannels ){
        throw new Error("Invalid channelIndex");
    }

    const channel_ = buffer.getChannelData( channelIndex );

    for( let j = 0; j < numSamples; j++ ){
        channel_[ j ] = 0.0;
    }
}


/**
 * Fills all channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBuffer( buffer ){

    const numChannels = buffer.numberOfChannels;
    
    for( let i = 0 ; i < numChannels; i++){

        clearBufferChannel( buffer, i );
    }
}

/**
 * Creates a Dirac in one given channel of the AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {int} sampleIndex
 */
function makeImpulse( buffer, channelIndex = 0, sampleIndex = 0 ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    /// boundary check
    if( channelIndex < 0 || channelIndex >= numChannels ){
        throw new Error("Invalid channelIndex");
    }

    /// boundary check
    if( sampleIndex < 0 || sampleIndex >= numSamples ){
        throw new Error("Invalid sampleIndex");
    }

    /// first clear the channel
    clearBufferChannel( buffer, channelIndex );

    /// then create a Dirac
    const channel_ = buffer.getChannelData( channelIndex );
    channel_[ sampleIndex ] = 1.0;           

}

//==============================================================================
export function testBiquadNode(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    var buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    clearBuffer( buffer );
    makeImpulse( buffer, 0, 0 );
    makeImpulse( buffer, 1, 10 );

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var biquadNode = audioContext1.createBiquadFilter();
    
    /// configure the biquad filter
    {
        biquadNode.type = "lowpass";

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        biquadNode.gain.value = 10;

        /// measured in hertz (Hz)
        biquadNode.frequency.value = 1000;

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        biquadNode.Q.value = 10;
    }


    /// connect the node to the buffer source
    bufferSource.connect( biquadNode );

    /// connect the node to the destination of the audio context
    biquadNode.connect( audioContext1.destination );

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start( localTime );

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = (output) => {

        const buf = output.renderedBuffer;
                
        const bufUrl = writeBufferToTextFileWithMatlabFormat( buf );
        console.log( "buffer URL :  " + bufUrl );

        debugger;                
    };

    /// start rendering
    audioContext1.startRendering();

}

//==============================================================================
export function testCascadeNode(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    var buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    clearBuffer( buffer );
    makeImpulse( buffer, 0, 0 );
    makeImpulse( buffer, 1, 10 );

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var cascadeNode = new M4DPAudioModules.CascadeNode( audioContext1 );
    
    /// configure the cascade filter
    {
        cascadeNode.numCascades = 2;

        cascadeNode.setType( 0, "peaking" );
        cascadeNode.setType( 1, "peaking" );

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        cascadeNode.setGain( 0, 6 );
        cascadeNode.setGain( 1, 6 );

        /// measured in hertz (Hz)
        cascadeNode.setFrequency(0, 1000 );
        cascadeNode.setFrequency(1, 8000 );

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        cascadeNode.setQ( 0, 10 );
        cascadeNode.setQ( 1, 10 );
    }

    /// connect the node to the buffer source
    bufferSource.connect( cascadeNode.input );

    /// connect the node to the destination of the audio context
    cascadeNode._output.connect( audioContext1.destination );

    cascadeNode.bypass = true;

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start( localTime );

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = (output) => {

        const buf = output.renderedBuffer;
                
        const bufUrl = writeBufferToTextFileWithMatlabFormat( buf );
        console.log( "buffer URL :  " + bufUrl );

        debugger;                
    };

    /// start rendering
    audioContext1.startRendering();
}





//==============================================================================
export function testBinaural(){

const audio = binaural.audio.utilities;
const Source = binaural.audio.Source;
const HrtfSet = binaural.sofa.HrtfSet;
const ServerDataBase = binaural.sofa.ServerDataBase;

const audioContext = new window.AudioContext();

const noiseBuffer = audio.createNoiseBuffer({
  audioContext,
  channelCount: 1,
  duration: 5,
  gain: -20,
});

const positionsType = 'sofaSpherical';
const testPositions = [
  [30, 0, 2], // front-left
  [0, 0, 2], // centre
  [-30, 0, 2], // front-right
];

const testPositionsName = [
  'front-left',
  'centre',
  'front-right',
];

const hrtfSet = new HrtfSet({
  audioContext,
  filterPositions: testPositions,
  positionsType,
});

console.log('accessing server');
const serverDataBase = new ServerDataBase();

serverDataBase.loadCatalogue()
  .then( () => {

    return serverDataBase.getUrls({
      convention: 'HRIR',
      dataBase: 'BILI',
      equalisation: 'COMPENSATED',
      sampleRate: audioContext.sampleRate,
      freePattern: '1147',
    });
  })
  .then( (urls) => {
    console.log('loading HRTF set');
    return hrtfSet.load(urls[0]);
  })
  .then( () => {
    console.log('activate audio');
    return new Promise( (resolve, reject) => {
      const now = audioContext.currentTime;
      if (now === 0) {
        console.log('manually start audio context');
        if (window.confirm('Start Audio?') ) {
          const gain = audioContext.createGain();
          gain.gain.value = 0;
          gain.connect(audioContext.destination);

          const noiseBufferSource = audioContext.createBufferSource();
          noiseBufferSource.buffer = noiseBuffer;
          noiseBufferSource.loop = true;

          noiseBufferSource.connect(gain);
          noiseBufferSource.start(now);
          noiseBufferSource.stop(now + 0.3);
          resolve();
        } else {
          reject(new Error('Audio not started'));
        }
      } else {
        resolve();
      }
    });
  })
  .then( () => {
    console.log('testing sources');
    testPositions.forEach( (position, index) => {
      const positionName = testPositionsName[index];
      console.log(`Test for source on the ${positionName}`);
      return new Promise( (resolve) => {
        const source = new Source({
          audioContext,
          hrtfSet,
          position,
        });

        const noiseBufferSource = audioContext.createBufferSource();
        noiseBufferSource.buffer = noiseBuffer;
        noiseBufferSource.loop = true;

        source.inputConnect(noiseBufferSource);
        noiseBufferSource.start(0);

        source.outputConnect(audioContext.destination);

        if (window.confirm(`Is sound on the ${positionName}?`) ) {
          resolve(noiseBufferSource);
        } else {
          // resolve any way to stop sound
          resolve(noiseBufferSource);
        }
      })
        .then( (noiseBufferSource) => {
          noiseBufferSource.stop(0);
        });
    });
  }); // for each position

}




/// @n technique pour avoir un pseudo-namespace
const unittests = {
    testBiquadNode, 
    testCascadeNode,   
    testBinaural,
};

export default unittests;
