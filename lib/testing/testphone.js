/************************************************************************************/
/*!
 *   @file       testphone.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import PhoneNode from '../dsp/phone.js';
import bufferutilities from '../core/bufferutils.js';

//==============================================================================
export function testPhoneNode(){

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
    bufferutilities.makeNoise( buffer, 2, 0 );
    bufferutilities.makeNoise( buffer, 3, -6 );

    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const phoneNode = new PhoneNode( audioContext1 );
    
    /// configure the phone filter
    {
        phoneNode.gain = 6; // NOT default, default is 0

        phoneNode.frequency = 1200; // default
        phoneNode.q = 1; // default
    }

    /// connect the node to the buffer source
    bufferSource.connect( phoneNode._input );

    /// connect the node to the destination of the audio context
    phoneNode._output.connect( audioContext1.destination );

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
const phonetests =
{
    testPhoneNode,
};

export default phonetests;
