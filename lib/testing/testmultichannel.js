/************************************************************************************/
/*!
 *   @file       testmultichannel.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import bufferutilities from '../core/bufferutils.js';

//==============================================================================
export function testMultiChannel(){

    const sampleRate    = 44100;
    const bufferSize    = 512;
    const numChannels   = 6;    /// 5.1

    /// create an offline audio context
    const audioContext1 = new OfflineAudioContext( numChannels, bufferSize, sampleRate );

    /// create a test buffer
    const buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    /// just a precaution
    bufferutilities.clearBuffer( buffer );
    bufferutilities.fillChannel( buffer, 0, 0.1 );
    bufferutilities.fillChannel( buffer, 1, 0.2 );
    bufferutilities.fillChannel( buffer, 2, 0.3 );
    bufferutilities.fillChannel( buffer, 3, 0.4 );
    bufferutilities.fillChannel( buffer, 4, 0.5 );
    bufferutilities.fillChannel( buffer, 5, 0.6 );

    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;


    bufferSource.connect( audioContext1.destination );

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
const multichanneltests = {
    testMultiChannel,
};

export default multichanneltests;
