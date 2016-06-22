/************************************************************************************/
/*!
 *   @file       testtransaural.js
 *   @brief      Misc test functions for M4DPAudioModules.TransauralShufflerNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import {TransauralShufflerNode} from '../dsp/transaural.js';
import bufferutilities from '../core/bufferutils.js';

//==============================================================================
export function testTransauralShuffler(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 2;

    /// create an offline audio context
    const audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    const buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

	/// just a precaution
	bufferutilities.clearBuffer( buffer );
	bufferutilities.makeImpulse( buffer, 1, 0 );

    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const transauralNode_ = new TransauralShufflerNode( audioContext1 );
    
    /// connect the node to the buffer source
    bufferSource.connect( transauralNode_.input );

    /// connect the node to the destination of the audio context
    transauralNode_._output.connect( audioContext1.destination );

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
const transauraltests = {
    testTransauralShuffler,
};

export default transauraltests;

