/************************************************************************************/
/*!
 *   @file       testrouting.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import bufferutilities from '../core/bufferutils.js';
import StreamRouting from '../multichannel-spatialiser/routing.js'

//==============================================================================
export function testRouting(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numInputs     = 10;
    const numOutputs    = 6;    /// 5.1

    /// create an offline audio context
    const audioContext1 = new OfflineAudioContext( numOutputs, bufferSize, sampleRate );

    /// create a test buffer
    const buffer = audioContext1.createBuffer( numInputs, bufferSize, sampleRate );

    /// just a precaution
    bufferutilities.clearBuffer( buffer );
    for( let i = 0; i < numInputs; i++ ){
        bufferutilities.fillChannel( buffer, i, (i+1) * 0.1 );        
    }


    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const routingNode = new StreamRouting( audioContext1 );

    /// connect the node to the buffer source
    bufferSource.connect( routingNode.input );

    routingNode.connect( audioContext1.destination );

    /// prepare the rendering
    const localTime = 0;
    bufferSource.start( localTime );

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = (output) => {

        const buf = output.renderedBuffer;
                
        const bufUrl = bufferutilities.writeBufferToTextFileWithMatlabFormat( buf );
        console.log( "buffer URL :  " + bufUrl );

        ///@n it seems that the audioContext1.destination has only 2 channels
        /// as long as no multichannel audio device is plugged ?

        debugger;                
    };

    /// start rendering
    audioContext1.startRendering();
}


//==============================================================================
const routingtests = {
    testRouting,
};

export default routingtests;
