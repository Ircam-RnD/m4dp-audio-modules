/************************************************************************************/
/*!
 *   @file       testbinaural.js
 *   @brief      Misc test function for binaural
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import sofatests from './testsofa.js'
import bufferutilities from '../core/bufferutils.js';

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
export function testBinauralNode(){

	const sampleRate    = 44100;

	sofatests.getHrir( 1147, sampleRate, -30, 0 ).then( (hrir) => 
	{
		const leftHrir  = hrir.getChannelData(0);
		const rightHrir = hrir.getChannelData(1);

    	const bufferSize    = 4096;
    	const numChannels   = 2;

	    /// create an offline audio context
	    const audioContext1 = new OfflineAudioContext( 2, bufferSize, sampleRate );

	    /// create a test buffer
	    const buffer = audioContext1.createBuffer( 1, bufferSize, sampleRate );

	    /// just a precaution
	    bufferutilities.clearBuffer( buffer );
	    bufferutilities.makeImpulse( buffer, 0, 0 );
	    
		const convolver = audioContext1.createConvolver();

		/// create a buffer source
	    const bufferSource = audioContext1.createBufferSource();

	    /// reference the test buffer with the buffer source
	    bufferSource.buffer = buffer;

	    {
	    	convolver.normalize = false;
	    	convolver.buffer = hrir;
	    }


	    /// connect the node to the buffer source
	    bufferSource.connect( convolver );

	    /// connect the node to the destination of the audio context
	    convolver.connect( audioContext1.destination );

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

		debugger;
	})

}


//==============================================================================
const binauraltests = {
    testBinauralNode,
};

export default binauraltests;
