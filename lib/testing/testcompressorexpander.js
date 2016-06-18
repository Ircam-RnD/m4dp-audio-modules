/************************************************************************************/
/*!
 *   @file       testcompressorexpander.js
 *   @brief      Misc test functions for M4DPAudioModules.CompressorExpanderNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import CompressorExpanderNode from '../dsp/compressorexpander.js';
import bufferutilities from '../core/bufferutils.js';

//==============================================================================
export function testCompressorExpanderNode(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 1;

    /// create an offline audio context
    const audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    const buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    bufferutilities.clearBuffer( buffer );
    bufferutilities.makeImpulse( buffer, 0, 0 );
    
    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const compressorExpanderNode = new M4DPAudioModules.CompressorExpanderNode( audioContext1 );
    
    /// configure the processor
    {
        
    }

    /// connect the node to the buffer source
    bufferSource.connect( compressorExpanderNode._input );

    /// connect the node to the destination of the audio context
    compressorExpanderNode._output.connect( audioContext1.destination );

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
const compressorexpandertests = {
    testCompressorExpanderNode,
};

export default compressorexpandertests;
