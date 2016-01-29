/**
 * Some test functions
 * For debug purposes only
 */

import CascadeNode from '../dsp/cascade.js';
import bufferutilities from '../core/bufferutils.js';

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
    bufferutilities.clearBuffer( buffer );
    bufferutilities.makeImpulse( buffer, 0, 0 );
    bufferutilities.makeImpulse( buffer, 1, 10 );

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
                
        const bufUrl = bufferutilities.writeBufferToTextFileWithMatlabFormat( buf );
        console.log( "buffer URL :  " + bufUrl );

        debugger;                
    };

    /// start rendering
    audioContext1.startRendering();
}


/// @n technique pour avoir un pseudo-namespace
const cascadetests = {
    testCascadeNode,
};

export default cascadetests;
