/************************************************************************************/
/*!
 *   @file       testbiquad.js
 *   @brief      Misc test functions for BiquadFilterNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import bufferutilities from '../core/bufferutils.js';

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
export function testBiquadNode(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 4;

    /// create an offline audio context
    const audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    const buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    bufferutilities.clearBuffer( buffer );
    bufferutilities.makeImpulse( buffer, 0, 0 );
    bufferutilities.makeImpulse( buffer, 1, 10 );

    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const biquadNode = audioContext1.createBiquadFilter();
    
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
    const localTime = 0;
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

//==============================================================================
const biquadtests = {
    testBiquadNode,
};

export default biquadtests;
