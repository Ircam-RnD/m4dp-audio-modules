/************************************************************************************/
/*!
 *   @file       testcascade.js
 *   @brief      Misc test functions for M4DPAudioModules.SumDiffNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import SumDiffNode from '../dsp/sumdiff.js';
import bufferutilities from '../core/bufferutils.js';


//==============================================================================
export function testSumDiffNode(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 2;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    var buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    bufferutilities.clearBuffer( buffer );
    bufferutilities.fillChannel( buffer, 0, 0.2 );
    bufferutilities.fillChannel( buffer, 1, 0.7 );

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var sumDiffNode_ = new M4DPAudioModules.SumDiffNode( audioContext1 );
    
    /// connect the node to the buffer source
    bufferSource.connect( sumDiffNode_.input );

    /// connect the node to the destination of the audio context
    sumDiffNode_._output.connect( audioContext1.destination );

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


//==============================================================================
const sumdifftests = {
    testSumDiffNode,
};

export default sumdifftests;
